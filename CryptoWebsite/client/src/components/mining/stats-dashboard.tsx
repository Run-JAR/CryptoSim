import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, TrendingUp, Zap, Award } from "lucide-react";

interface StatsDashboardProps {
  balance: number;
  blocksSolved: number;
  hashRate: number;
  reward: number;
}

export function StatsDashboard({ balance, blocksSolved, hashRate, reward }: StatsDashboardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card data-testid="card-total-balance">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono" data-testid="stat-total-balance">
            {balance}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Coins earned from mining
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-blocks-solved">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Blocks Solved</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono" data-testid="stat-blocks-solved">
            {blocksSolved}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Successfully mined blocks
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-hash-rate">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hash Rate</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono" data-testid="stat-hash-rate">
            {hashRate}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Hashes per second
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-block-reward">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Block Reward</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono" data-testid="stat-block-reward">
            {reward}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Coins per block found
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
