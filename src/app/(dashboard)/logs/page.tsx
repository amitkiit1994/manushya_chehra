"use client";
import { useEffect, useState } from "react";
import { getAuditLogs } from "../../../lib/api";
import type { AuditLog } from "../../../lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { ScrollText, Activity, Clock, User, Database, Sparkles, AlertTriangle, RefreshCw } from "lucide-react";

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    const colors = {
      'create': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'update': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'delete': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'read': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'search': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'login': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'bulk_import': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400',
    };
    return colors[action.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType.toLowerCase()) {
      case 'memory':
        return <Database className="h-4 w-4" />;
      case 'identity':
        return <User className="h-4 w-4" />;
      case 'policy':
        return <ScrollText className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <ScrollText className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          </div>
          <p className="text-muted-foreground">
            Monitor all system activities and track changes across your autonomous agent infrastructure
          </p>
        </div>
        
        <Button onClick={fetchLogs} disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{loading ? "--" : logs.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Resource Types</p>
                <p className="text-2xl font-bold">{loading ? "--" : new Set(logs.map(l => l.resource_type)).size}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Unique Actors</p>
                <p className="text-2xl font-bold">{loading ? "--" : new Set(logs.map(l => l.actor_identity)).size}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <User className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Time Range</p>
                <p className="text-2xl font-bold">24h</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="logs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="logs" className="gap-2">
            <ScrollText className="h-4 w-4" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="h-5 w-5" />
                System Activity Log
              </CardTitle>
              <CardDescription>
                Real-time audit trail of all system activities and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[300px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-12 w-12 text-destructive/50" />
                  <h3 className="mt-4 text-lg font-semibold">Error Loading Logs</h3>
                  <p className="text-destructive">{error}</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-12">
                  <ScrollText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No audit logs found</h3>
                  <p className="text-muted-foreground">System activities will appear here as they occur</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {logs.map((log) => (
                        <motion.tr
                          key={log.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="group"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-mono">{formatDate(log.timestamp)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getActionColor(log.action)}>
                              {log.action.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getResourceIcon(log.resource_type)}
                              <div>
                                <p className="font-medium">{log.resource_type}</p>
                                <p className="text-sm text-muted-foreground font-mono">
                                  {log.resource_id.slice(0, 8)}...
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium">
                                {log.actor_identity.slice(0, 2).toUpperCase()}
                              </div>
                              <span className="text-sm font-mono">{log.actor_identity.slice(0, 12)}...</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {log.memory_diff && (
                                <div className="text-xs">
                                  <span className="font-medium">Memory Changes:</span>
                                  <pre className="mt-1 text-xs bg-muted rounded p-2 max-w-xs overflow-hidden">
                                    {JSON.stringify(log.memory_diff, null, 2).slice(0, 100)}...
                                  </pre>
                                </div>
                              )}
                              {log.metadata && (
                                <div className="text-xs">
                                  <span className="font-medium">Metadata:</span>
                                  <pre className="mt-1 text-xs bg-muted rounded p-2 max-w-xs overflow-hidden">
                                    {JSON.stringify(log.metadata, null, 2).slice(0, 100)}...
                                  </pre>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Activity Analytics
              </CardTitle>
              <CardDescription>
                Insights and patterns in your system activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">Activity patterns and insights will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 