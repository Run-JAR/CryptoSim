import { useState } from "react";
import { Settings, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface DifficultyControlProps {
  currentDifficulty: string;
  onSetDifficulty: (targetPrefix: string) => void;
}

const PRESET_DIFFICULTIES = [
  { label: "Very Easy", value: "0", color: "bg-green-500" },
  { label: "Easy", value: "00", color: "bg-blue-500" },
  { label: "Medium", value: "000", color: "bg-yellow-500" },
  { label: "Hard", value: "0000", color: "bg-orange-500" },
  { label: "Extreme", value: "00000", color: "bg-red-500" },
];

export function DifficultyControl({ currentDifficulty, onSetDifficulty }: DifficultyControlProps) {
  const [customTarget, setCustomTarget] = useState(currentDifficulty);

  const handlePresetClick = (value: string) => {
    setCustomTarget(value);
    onSetDifficulty(value);
  };

  const handleCustomSet = () => {
    if (customTarget.trim()) {
      onSetDifficulty(customTarget);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Difficulty Control
        </CardTitle>
        <CardDescription>
          Adjust mining difficulty to control block solve rate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Preset Difficulties</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESET_DIFFICULTIES.map((preset) => (
              <Button
                key={`preset-${preset.value || 'empty'}`}
                variant={currentDifficulty === preset.value ? "default" : "outline"}
                onClick={() => handlePresetClick(preset.value)}
                className="flex flex-col h-auto py-3"
                data-testid={`button-difficulty-${preset.label.toLowerCase().replace(' ', '-')}`}
              >
                <span className="font-semibold text-xs mb-1">{preset.label}</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {preset.value || "∅"}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="custom-target">Custom Target Prefix</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="custom-target"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                className="pl-9 font-mono"
                placeholder="e.g., 0000"
                data-testid="input-custom-difficulty"
              />
            </div>
            <Button 
              onClick={handleCustomSet}
              data-testid="button-apply-difficulty"
            >
              Apply
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Hashes must start with this prefix. More zeros = harder difficulty.
          </p>
        </div>

        <div className="p-4 rounded-md bg-muted/50 space-y-2" data-testid="card-difficulty-info">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Difficulty</span>
            <Badge variant="outline" className="font-mono" data-testid="badge-current-difficulty">
              {currentDifficulty || "∅"}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground" data-testid="text-difficulty-probability">
            Estimated probability: 1 in {Math.pow(16, currentDifficulty.length).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
