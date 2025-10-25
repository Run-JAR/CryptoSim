import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Create WebSocket server on /ws path to avoid conflicts with Vite HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  console.log('WebSocket server initialized on /ws');

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection");

    // Send current block to newly connected client
    const currentBlock = storage.getCurrentBlock();
    const blockNumber = storage.getBlockNumber();
    
    sendMessage(ws, "newBlock", {
      blockNumber,
      currentBlock,
    });

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        handleMessage(ws, message, wss);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  return httpServer;
}

function sendMessage(ws: WebSocket, type: string, data: any) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, data }));
  }
}

function broadcast(wss: WebSocketServer, type: string, data: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, data }));
    }
  });
}

function handleMessage(ws: WebSocket, message: any, wss: WebSocketServer) {
  const { type, data } = message;

  switch (type) {
    case "blockSolved": {
      const { user, hash } = data;
      
      if (!user || !hash) {
        console.log("Invalid blockSolved message");
        return;
      }

      const currentBlock = storage.getCurrentBlock();
      const blockNumber = storage.getBlockNumber();
      
      // Add reward to miner
      const newBalance = storage.addCoinsToMiner(user, currentBlock.reward);
      
      // Broadcast block solved event
      broadcast(wss, "blockSolved", {
        user,
        hash,
        newBalance,
        blockNumber,
      });
      
      console.log(`✅ ${user} solved block #${blockNumber}`);
      
      // Generate new block
      storage.generateNewBlock();
      const newBlock = storage.getCurrentBlock();
      const newBlockNumber = storage.getBlockNumber();
      
      broadcast(wss, "newBlock", {
        blockNumber: newBlockNumber,
        currentBlock: newBlock,
      });
      
      console.log(`🧱 New block #${newBlockNumber}: ${newBlock.hash}`);
      break;
    }

    case "setDifficulty": {
      const { targetPrefix, password } = data;
      
      if (password !== ADMIN_PASSWORD) {
        console.log(`❌ Unauthorized difficulty change attempt`);
        sendMessage(ws, "authFailed", {
          message: "Incorrect admin password",
        });
        return;
      }
      
      storage.setDifficulty(targetPrefix);
      
      broadcast(wss, "difficultyChanged", {
        targetPrefix,
      });
      
      console.log(`🔧 Difficulty changed to ${targetPrefix}`);
      break;
    }

    default:
      console.log(`Unknown message type: ${type}`);
  }
}
