"use client";
import { useEffect, useState } from "react";
import { getIdentities, getMemories, getPolicies, getAuditLogs } from "../../../lib/api";
import type { Identity, Memory, Policy, AuditLog } from "../../../lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Progress } from "../../../components/ui/progress";
import { 
  Users, 
  Brain, 
  Shield, 
  Activity, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Database,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  BarChart3
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  identities: number;
  memories: number;
  policies: number;
  logs: number;
  loading: boolean;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    identities: 0,
    memories: 0,
    policies: 0,
    logs: 0,
    loading: true,
  });

  const [recentActivity, setRecentActivity] = useState<AuditLog[]>([]);
  const [systemHealth, setSystemHealth] = useState({
    uptime: 99.9,
    responseTime: 45,
    throughput: 1250,
  });

  const fetchDashboardData = async () => {
    setStats(prev => ({ ...prev, loading: true }));
    
    try {
      const [identities, memories, policies, logs] = await Promise.allSettled([
        getIdentities(),
        getMemories(),
        getPolicies(),
        getAuditLogs(),
      ]);

      setStats({
        identities: identities.status === 'fulfilled' ? identities.value.length : 0,
        memories: memories.status === 'fulfilled' ? memories.value.length : 0,
        policies: policies.status === 'fulfilled' ? policies.value.length : 0,
        logs: logs.status === 'fulfilled' ? logs.value.length : 0,
        loading: false,
      });

      if (logs.status === 'fulfilled') {
        setRecentActivity(logs.value.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    const colors = {
      'create': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'update': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'delete': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'read': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    };
    return colors[action.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome to your autonomous agent infrastructure control center
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            System Online
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Identities</p>
                <div className="text-2xl font-bold">
                  {stats.loading ? <Skeleton className="h-8 w-12" /> : stats.identities}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last week
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Memory Entries</p>
                <div className="text-2xl font-bold">
                  {stats.loading ? <Skeleton className="h-8 w-12" /> : stats.memories}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +24% from last week
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                <div className="text-2xl font-bold">
                  {stats.loading ? <Skeleton className="h-8 w-12" /> : stats.policies}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  All policies valid
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Audit Events</p>
                <div className="text-2xl font-bold">
                  {stats.loading ? <Skeleton className="h-8 w-12" /> : stats.logs}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Last 24 hours
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent" />
          </CardContent>
        </Card>
      </div>

      {/* System Health & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uptime</span>
                <span className="font-medium">{systemHealth.uptime}%</span>
              </div>
              <Progress value={systemHealth.uptime} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Response Time</span>
                <span className="font-medium">{systemHealth.responseTime}ms</span>
              </div>
              <Progress value={Math.max(0, 100 - systemHealth.responseTime)} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Throughput</span>
                <span className="font-medium">{systemHealth.throughput}/min</span>
              </div>
              <Progress value={Math.min(100, systemHealth.throughput / 20)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/logs" className="flex items-center gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Badge className={getActionColor(log.action)} variant="secondary">
                      {log.action}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {log.resource_type} • {log.resource_id.slice(0, 8)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {log.actor_identity.slice(0, 12)}...
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(log.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview">Quick Actions</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group hover:shadow-md transition-all cursor-pointer">
              <Link href="/identities">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Manage Identities</h3>
                      <p className="text-sm text-muted-foreground">Create and manage agent identities</p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:shadow-md transition-all cursor-pointer">
              <Link href="/memories">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/30 transition-colors">
                      <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Memory Bank</h3>
                      <p className="text-sm text-muted-foreground">Store and search agent memories</p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:shadow-md transition-all cursor-pointer">
              <Link href="/policies">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20 group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors">
                      <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Policy Control</h3>
                      <p className="text-sm text-muted-foreground">Configure access policies</p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>
                Intelligent recommendations and patterns detected in your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">AI Insights Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced analytics and AI-powered recommendations will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
