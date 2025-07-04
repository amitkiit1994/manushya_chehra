"use client";
import { useEffect, useState } from "react";
import { getIdentities } from "../../../lib/api";
import type { Identity } from "../../../lib/types";
import IdentityForm from "../../../components/IdentityForm";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Copy, Eye, Plus, Users, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function IdentitiesPage() {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null);

  const fetchIdentities = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getIdentities();
      setIdentities(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Failed to fetch identities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdentities();
  }, []);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Identity Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage secure identities and access tokens for your autonomous agents
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Identity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Create New Identity
              </DialogTitle>
              <DialogDescription>
                Generate a new secure identity for your autonomous agent
              </DialogDescription>
            </DialogHeader>
            <IdentityForm onCreated={fetchIdentities} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Identities</p>
                <p className="text-2xl font-bold">{loading ? "--" : identities.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold">{loading ? "--" : identities.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
                <p className="text-2xl font-bold">24h</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="identities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="identities" className="gap-2">
            <Users className="h-4 w-4" />
            All Identities
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Identity Registry
              </CardTitle>
              <CardDescription>
                View and manage all registered identities in your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : identities.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No identities found</h3>
                  <p className="text-muted-foreground">Get started by creating your first identity</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Identity</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Claims</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {identities.map((identity) => (
                        <motion.tr
                          key={identity.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="group"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium">
                                {identity.external_id.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">{identity.external_id}</p>
                                <p className="text-sm text-muted-foreground font-mono">
                                  {identity.id.slice(0, 8)}...
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{formatDate(identity.created_at)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="gap-1">
                              <span>{Object.keys(identity.claims || {}).length}</span>
                              <span>claims</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(identity.id, "Token")}
                                className="gap-2"
                              >
                                <Copy className="h-4 w-4" />
                                Copy Token
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="gap-2">
                                    <Eye className="h-4 w-4" />
                                    View Claims
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <Eye className="h-5 w-5" />
                                      Identity Claims
                                    </DialogTitle>
                                    <DialogDescription>
                                      Claims and metadata for {identity.external_id}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium">Identity ID:</span>
                                        <p className="font-mono text-muted-foreground">{identity.id}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium">External ID:</span>
                                        <p className="text-muted-foreground">{identity.external_id}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <span className="font-medium text-sm">Claims:</span>
                                      <pre className="mt-2 rounded-lg bg-muted p-4 text-xs overflow-auto">
                                        {JSON.stringify(identity.claims, null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
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
                Identity Analytics
              </CardTitle>
              <CardDescription>
                Insights and metrics about your identity usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">Identity usage patterns and insights will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
