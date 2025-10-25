import { useState } from "react";
import { Play, Square, Hash, User, Cpu } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface MiningControlProps {
  onStart: (username: string, hashRate: number) => void;
  onStop: () => void;
  isMining: boolean;
  hashRate: number;
}

export function MiningControl({ onStart, onStop, isMining, hashRate }: MiningControlProps) {
  const [username, setUsername] = useState("Miner1");
  const [targetHashRate, setTargetHashRate] = useState(200);

  const handleStart = () => {
    if (username.trim()) {
      onStart(username, targetHashRate);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          Mining Control
        </CardTitle>
        <CardDescription>
          Configure your mining settings and start earning coins
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Miner Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isMining}
              className="pl-9"
              placeholder="Enter your name"
              data-testid="input-username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hashrate">Hashes Per Tick</Label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="hashrate"
              type="number"
              value={targetHashRate}
              onChange={(e) => setTargetHashRate(Number(e.target.value))}
              disabled={isMining}
              className="pl-9 font-mono"
              min={1}
              max={1000}
              data-testid="input-hashrate"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Higher values increase mining speed but use more CPU
          </p>
        </div>

        {isMining && (
          <div className="p-4 rounded-md bg-muted/50 space-y-2" data-testid="card-current-hashrate">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Hash Rate</span>
              <Badge variant="outline" className="font-mono" data-testid="badge-current-hashrate">
                {hashRate} h/s
              </Badge>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 animate-pulse"
                style={{ width: `${Math.min((hashRate / targetHashRate) * 100, 100)}%` }}
                data-testid="progress-hashrate"
              />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {!isMining ? (
            <Button 
              onClick={handleStart} 
              className="flex-1"
              size="lg"
              data-testid="button-start-mining"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Mining
            </Button>
          ) : (
            <Button 
              onClick={onStop} 
              variant="destructive"
              className="flex-1"
              size="lg"
              data-testid="button-stop-mining"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Mining
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
