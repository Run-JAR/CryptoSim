import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminAuth } from "@/components/admin/admin-auth";
import { DifficultyControl } from "@/components/admin/difficulty-control";
import { SystemMonitor } from "@/components/admin/system-monitor";
import { ActivityLog } from "@/components/mining/activity-log";
import { useWebSocket } from "@/lib/websocket";
import { type MiningEvent } from "@shared/schema";

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authStatus, setAuthStatus] = useState<'success' | 'failed' | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState("0000");
  const [blockNumber, setBlockNumber] = useState(0);
  const [currentHash, setCurrentHash] = useState("");
  const [reward, setReward] = useState(3);
  const [events, setEvents] = useState<MiningEvent[]>([]);
  const [totalMiners, setTotalMiners] = useState(0);

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
      setCurrentHash(data.currentBlock.hash);
      setCurrentDifficulty(data.currentBlock.target);
      setReward(data.currentBlock.reward);
      addEvent("newBlock", {
        blockNumber: data.blockNumber,
        hash: data.currentBlock.hash,
      });
    });

    on("blockSolved", (data) => {
      addEvent("blockSolved", {
        user: data.user,
        hash: data.hash,
        blockNumber: data.blockNumber,
        newBalance: data.newBalance,
      });
      setTotalMiners((prev) => Math.max(prev, 1));
    });

    on("difficultyChanged", (data) => {
      setCurrentDifficulty(data.targetPrefix);
      setAuthStatus('success');
      addEvent("difficultyChanged", {
        targetPrefix: data.targetPrefix,
      });
    });

    on("authFailed", (data) => {
      setAuthStatus('failed');
      addEvent("authFailed", {
        message: data.message,
      });
      setTimeout(() => setAuthStatus(null), 3000);
    });

    return () => {
      off("newBlock");
      off("blockSolved");
      off("difficultyChanged");
      off("authFailed");
    };
  }, [on, off, addEvent]);

  const handleSetDifficulty = (targetPrefix: string) => {
    if (!password.trim()) {
      addEvent("authFailed", {
        message: "Please enter admin password",
      });
      setAuthStatus('failed');
      setTimeout(() => setAuthStatus(null), 3000);
      return;
    }

    send("setDifficulty", {
      targetPrefix,
      password,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" data-testid="button-back-to-mining">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Back to Mining</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold tracking-tight" data-testid="heading-admin-panel">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">
                  System controls and monitoring
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <AdminAuth
              password={password}
              onPasswordChange={setPassword}
              authStatus={authStatus}
            />
            <DifficultyControl
              currentDifficulty={currentDifficulty}
              onSetDifficulty={handleSetDifficulty}
            />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <SystemMonitor
              blockNumber={blockNumber}
              currentHash={currentHash}
              difficulty={currentDifficulty}
              reward={reward}
              totalMiners={totalMiners}
              isConnected={isConnected}
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
