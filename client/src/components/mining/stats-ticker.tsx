import { Cpu, Coins, Target, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatsTickerProps {
  blockNumber: number;
  balance: number;
  target: string;
  isMining: boolean;
}

export function StatsTicker({ blockNumber, balance, target, isMining }: StatsTickerProps) {
  return (
    <div className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Crypto Miner</h1>
            {isMining && (
              <Badge variant="outline" className="animate-pulse border-success text-success" data-testid="badge-mining-status">
                <Activity className="h-3 w-3 mr-1" />
                Mining
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2" data-testid="stat-block-number">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Block</span>
              <span className="font-mono text-sm font-bold">{blockNumber}</span>
            </div>
            
            <div className="flex items-center gap-2" data-testid="stat-balance">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Balance</span>
              <span className="font-mono text-sm font-bold">{balance}</span>
            </div>
            
            <div className="flex items-center gap-2" data-testid="stat-difficulty">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Difficulty</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {target || "0000"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
