"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Home, Users, Brain, FileText, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { cn } from "../lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/identities", label: "Identities", icon: Users },
  { href: "/memories", label: "Memories", icon: Brain },
  { href: "/policies", label: "Policies", icon: FileText },
  { href: "/logs", label: "Logs", icon: Activity },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <span className="text-xl font-bold text-primary">Manushya.ai</span>
      </div>
      <nav className="flex-1 py-4 space-y-2 px-3">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Button
              key={link.href}
              asChild
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-2 h-10",
                isActive && "bg-primary text-primary-foreground"
              )}
              onClick={() => setOpen(false)}
            >
              <Link href={link.href}>
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-background border-r border-border">
        <SidebarContent />
      </aside>
    </>
  );
}
