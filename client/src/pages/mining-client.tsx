import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatsTicker } from "@/components/mining/stats-ticker";
import { MiningControl } from "@/components/mining/mining-control";
import { ActivityLog } from "@/components/mining/activity-log";
import { Leaderboard } from "@/components/mining/leaderboard";
import { StatsDashboard } from "@/components/mining/stats-dashboard";
import { useWebSocket } from "@/lib/websocket";
import { sha256hex, hashMeetsTarget, generateNonce } from "@/lib/mining";
import { type MiningEvent, type MinerBalance } from "@shared/schema";

export default function MiningClient() {
  const [blockNumber, setBlockNumber] = useState(0);
  const [currentBlock, setCurrentBlock] = useState({ hash: "", target: "0000", reward: 3 });
  const [balance, setBalance] = useState(0);
  const [blocksSolved, setBlocksSolved] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [hashRate, setHashRate] = useState(0);
  const [username, setUsername] = useState("");
  const [events, setEvents] = useState<MiningEvent[]>([]);
  const [balances, setBalances] = useState<Map<string, number>>(new Map());

  const miningIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const targetHashRateRef = useRef(200);
  const hashCountRef = useRef(0);
  const lastHashRateUpdateRef = useRef(Date.now());

  const { isConnected, on, off, send } = useWebSocket("/ws");

  const addEvent = useCallback((type: MiningEvent['type'], data: Partial<MiningEvent>) => {
    const event: MiningEvent = {
      type,
      timestamp: Date.now(),
      ...data,
    };
    setEvents((prev) => [event, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    on("newBlock", (data) => {
      setBlockNumber(data.blockNumber);
      setCurrentBlock(data.currentBlock);
      addEvent("newBlock", {
        blockNumber: data.blockNumber,
        hash: data.currentBlock.hash,
      });
    });

    on("blockSolved", (data) => {
      setBalances((prev) => new Map(prev).set(data.user, data.newBalance));
      
      if (data.user === username) {
        setBalance(data.newBalance);
        setBlocksSolved((prev) => prev + 1);
      }
      
      addEvent("blockSolved", {
        user: data.user,
        hash: data.hash,
        blockNumber: data.blockNumber,
        newBalance: data.newBalance,
      });
    });

    on("difficultyChanged", (data) => {
      setCurrentBlock((prev) => ({ ...prev, target: data.targetPrefix }));
      addEvent("difficultyChanged", {
        targetPrefix: data.targetPrefix,
      });
    });

    return () => {
      off("newBlock");
      off("blockSolved");
      off("difficultyChanged");
    };
  }, [on, off, addEvent, username]);

  const mineTick = useCallback(async () => {
    if (!currentBlock.hash || !username) return;

    const targetHashes = targetHashRateRef.current;
    
    for (let i = 0; i < targetHashes; i++) {
      const nonce = generateNonce();
      const hash = await sha256hex(currentBlock.hash + nonce);
      
      hashCountRef.current++;
      
      if (hashMeetsTarget(hash, currentBlock.target)) {
        send("blockSolved", { user: username, hash });
        return;
      }
    }

    const now = Date.now();
    const elapsed = (now - lastHashRateUpdateRef.current) / 1000;
    if (elapsed >= 1) {
      setHashRate(Math.round(hashCountRef.current / elapsed));
      hashCountRef.current = 0;
      lastHashRateUpdateRef.current = now;
    }
  }, [currentBlock.hash, currentBlock.target, username, send]);

  const startMining = (minerName: string, targetHashRateValue: number) => {
    setUsername(minerName);
    setIsMining(true);
    targetHashRateRef.current = targetHashRateValue;
    hashCountRef.current = 0;
    lastHashRateUpdateRef.current = Date.now();

    miningIntervalRef.current = setInterval(mineTick, 300);
  };

  const stopMining = () => {
    setIsMining(false);
    if (miningIntervalRef.current) {
      clearInterval(miningIntervalRef.current);
      miningIntervalRef.current = null;
    }
    setHashRate(0);
  };

  useEffect(() => {
    if (isMining) {
      miningIntervalRef.current = setInterval(mineTick, 300);
    }
    
    return () => {
      if (miningIntervalRef.current) {
        clearInterval(miningIntervalRef.current);
      }
    };
  }, [isMining, mineTick]);

  const minerBalances: MinerBalance[] = Array.from(balances.entries()).map(
    ([username, balance]) => ({ username, balance })
  );

  return (
    <div className="min-h-screen flex flex-col">
      <StatsTicker
        blockNumber={blockNumber}
        balance={balance}
        target={currentBlock.target}
        isMining={isMining}
      />

      <div className="flex-1 container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Mining Dashboard</h2>
            <p className="text-muted-foreground mt-1">
              Compete to solve blocks and earn cryptocurrency rewards
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/admin">
              <Button variant="outline" size="icon" data-testid="button-admin-panel">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Admin Panel</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-6">
            <MiningControl
              onStart={startMining}
              onStop={stopMining}
              isMining={isMining}
              hashRate={hashRate}
            />
            <Leaderboard balances={minerBalances} currentUser={username} />
          </div>

          <div className="lg:col-span-8 space-y-6">
            <StatsDashboard
              balance={balance}
              blocksSolved={blocksSolved}
              hashRate={hashRate}
              reward={currentBlock.reward}
            />
            <div className="h-[500px]">
              <ActivityLog events={events} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
