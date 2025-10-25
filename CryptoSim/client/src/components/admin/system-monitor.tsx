import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Cpu, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SystemMonitorProps {
  blockNumber: number;
  currentHash: string;
  difficulty: string;
  reward: number;
  totalMiners: number;
  isConnected: boolean;
}

export function SystemMonitor({ 
  blockNumber, 
  currentHash, 
  difficulty, 
  reward, 
  totalMiners,
  isConnected 
}: SystemMonitorProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card data-testid="card-connection-status">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Badge 
            variant="outline" 
            className={isConnected ? "border-success text-success" : "border-destructive text-destructive"}
            data-testid="badge-connection-status"
          >
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">
            WebSocket connection status
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-active-miners">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Miners</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono" data-testid="stat-active-miners">
            {totalMiners}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Currently mining on network
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-current-block">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Block</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono mb-2" data-testid="stat-current-block">
            #{blockNumber}
          </div>
          <p className="text-xs text-muted-foreground font-mono break-all" data-testid="text-current-hash">
            {currentHash ? `${currentHash.slice(0, 16)}...` : 'N/A'}
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-current-reward">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Block Reward</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono" data-testid="stat-current-reward">
            {reward}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Coins per solved block
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
