"use client";
import { useAuth } from "../lib/useAuth";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LogOut, User } from "lucide-react";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-primary">Manushya.ai</h1>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <Badge variant="secondary" className="gap-2">
              <User className="h-3 w-3" />
              <span className="truncate max-w-32" title={user.external_id}>
                {user.external_id}
              </span>
            </Badge>
          )}
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
