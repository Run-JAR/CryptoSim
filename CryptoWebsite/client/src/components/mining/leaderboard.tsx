import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type MinerBalance } from "@shared/schema";

interface LeaderboardProps {
  balances: MinerBalance[];
  currentUser?: string;
}

export function Leaderboard({ balances, currentUser }: LeaderboardProps) {
  const sortedBalances = [...balances].sort((a, b) => b.balance - a.balance);
  const topThree = sortedBalances.slice(0, 3);
  const rest = sortedBalances.slice(3, 10);

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-warning" />;
      case 2:
        return <Medal className="h-5 w-5 text-muted-foreground" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
        <CardDescription>
          Top miners ranked by total coins earned
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3" data-testid="leaderboard">
          {sortedBalances.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p className="text-sm">No miners yet. Be the first to mine!</p>
            </div>
          ) : (
            <>
              {topThree.map((miner, index) => {
                const rank = index + 1;
                const isCurrentUser = miner.username === currentUser;
                
                return (
                  <div
                    key={`${miner.username}-${rank}`}
                    className={`flex items-center gap-3 p-4 rounded-md transition-all ${
                      isCurrentUser 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'bg-muted/30 hover-elevate'
                    }`}
                    data-testid={`leaderboard-rank-${rank}-${miner.username.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center justify-center w-8">
                      {getMedalIcon(rank)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">{miner.username}</p>
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Rank #{rank}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold">{miner.balance}</p>
                      <p className="text-xs text-muted-foreground">coins</p>
                    </div>
                  </div>
                );
              })}
              
              {rest.length > 0 && (
                <>
                  <div className="pt-2">
                    <div className="h-px bg-border" />
                  </div>
                  {rest.map((miner, index) => {
                    const rank = index + 4;
                    const isCurrentUser = miner.username === currentUser;
                    
                    return (
                      <div
                        key={`${miner.username}-${rank}`}
                        className={`flex items-center gap-3 p-3 rounded-md transition-all ${
                          isCurrentUser 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'bg-muted/20 hover-elevate'
                        }`}
                        data-testid={`leaderboard-rank-${rank}-${miner.username.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="w-8 text-center">
                          <span className="text-sm font-medium text-muted-foreground">
                            {rank}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{miner.username}</p>
                            {isCurrentUser && (
                              <Badge variant="outline" className="text-xs">You</Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-mono text-sm font-semibold">{miner.balance}</p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
