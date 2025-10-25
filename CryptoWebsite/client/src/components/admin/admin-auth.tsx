import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface AdminAuthProps {
  password: string;
  onPasswordChange: (password: string) => void;
  authStatus?: 'success' | 'failed' | null;
}

export function AdminAuth({ password, onPasswordChange, authStatus }: AdminAuthProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Admin Authentication
            </CardTitle>
            <CardDescription>
              Enter admin password to access controls
            </CardDescription>
          </div>
          {authStatus === 'success' && (
            <Badge variant="outline" className="border-success text-success" data-testid="badge-auth-success">
              Authenticated
            </Badge>
          )}
          {authStatus === 'failed' && (
            <Badge variant="outline" className="border-destructive text-destructive" data-testid="badge-auth-failed">
              Access Denied
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-password">Admin Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="pl-9 pr-10"
              placeholder="Enter password"
              data-testid="input-admin-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-toggle-password"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
