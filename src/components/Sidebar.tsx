"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Mail, 
  MessageSquare, 
  Phone, 
  Shield, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { logoutUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Email Scanner", href: "/email-check", icon: Mail },
  { name: "SMS Scanner", href: "/sms-check", icon: MessageSquare },
  { name: "Teli AI", href: "/teli", icon: Phone },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  // Don't show sidebar on auth pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
    return null;
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 bg-card/50 backdrop-blur-xl border-r border-border/40 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border/40">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-md rounded-lg"></div>
                  <div className="relative p-2 bg-gradient-to-br from-primary/20 to-monitor-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg tracking-tight">PhishMirror</h1>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-xs text-muted-foreground">AI Security</span>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    isActive
                      ? "bg-primary/10 text-primary shadow-glow-sm"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                  {!collapsed && (
                    <span className="font-medium text-sm">{item.name}</span>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="border-t border-border/40 p-3 space-y-1">
            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
              title={collapsed ? "Settings" : undefined}
            >
              <Settings className="w-5 h-5" />
              {!collapsed && <span className="font-medium text-sm">Settings</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-threat-400 hover:bg-threat-500/10 hover:text-threat-300 transition-all"
              title={collapsed ? "Logout" : undefined}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content spacer */}
      <div className={`${collapsed ? "ml-20" : "ml-64"} transition-all duration-300`} />
    </>
  );
}