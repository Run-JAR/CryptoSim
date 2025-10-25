import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Box, CheckCircle2, Settings, AlertCircle, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type MiningEvent } from "@shared/schema";

interface ActivityLogProps {
  events: MiningEvent[];
}

export function ActivityLog({ events }: ActivityLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'blockSolved':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'newBlock':
        return <Box className="h-4 w-4 text-info" />;
      case 'difficultyChanged':
        return <Settings className="h-4 w-4 text-warning" />;
      default:
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getEventMessage = (event: MiningEvent) => {
    switch (event.type) {
      case 'blockSolved':
        return (
          <span>
            <span className="font-semibold">{event.user}</span> solved block{' '}
            <span className="font-mono">#{event.blockNumber}</span>
            {event.hash && (
              <span className="text-muted-foreground ml-2 font-mono text-xs">
                {event.hash.slice(0, 12)}...
              </span>
            )}
          </span>
        );
      case 'newBlock':
        return (
          <span>
            New block <span className="font-mono">#{event.blockNumber}</span> generated
            {event.hash && (
              <span className="text-muted-foreground ml-2 font-mono text-xs">
                {event.hash.slice(0, 10)}...
              </span>
            )}
          </span>
        );
      case 'difficultyChanged':
        return (
          <span>
            Difficulty changed to{' '}
            <Badge variant="secondary" className="font-mono text-xs ml-1">
              {event.targetPrefix}
            </Badge>
          </span>
        );
      case 'authFailed':
        return <span className="text-destructive">{event.message}</span>;
      default:
        return event.message || 'Unknown event';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Log
        </CardTitle>
        <CardDescription>
          Real-time mining events and network activity
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0">
        <ScrollArea className="h-full px-6 pb-6" ref={scrollRef}>
          <div className="space-y-3" data-testid="activity-log">
            {events.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <p>No activity yet. Start mining to see events!</p>
              </div>
            ) : (
              events.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-md bg-muted/30 hover-elevate transition-all animate-in fade-in slide-in-from-top-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                  data-testid={`event-${event.type}`}
                >
                  <div className="mt-0.5">{getEventIcon(event.type)}</div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm leading-relaxed">
                      {getEventMessage(event)}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatTime(event.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
