"use client";
import { useEffect, useState } from "react";
import { getPolicies, createPolicy } from "../../../lib/api";
import type { Policy } from "../../../lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Shield, Plus, Clock, FileText, Sparkles, AlertTriangle, CheckCircle2, Eye, Edit } from "lucide-react";
import { toast } from "sonner";

const createSchema = z.object({
  name: z.string().min(1, "Policy name is required"),
  policy: z.string().min(1, "Policy JSON is required"),
});

type CreateForm = z.infer<typeof createSchema>;

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  const fetchPolicies = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPolicies();
      setPolicies(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Failed to fetch policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Create policy form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
  });

  const onCreate = async (data: CreateForm) => {
    setError("");
    try {
      const policyData = JSON.parse(data.policy);
      await createPolicy({ name: data.name, document: policyData });
      toast.success("Policy created successfully");
      reset();
      fetchPolicies();
    } catch (e: any) {
      setError(e?.message || "Failed to create policy (check policy JSON)");
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

  const validatePolicy = (policyString: string) => {
    try {
      JSON.parse(policyString);
      return { valid: true, error: null };
    } catch (e: any) {
      return { valid: false, error: e.message };
    }
  };

  const getPolicyComplexity = (document: any) => {
    if (!document) {
      return { level: 'Unknown', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' };
    }
    
    try {
      const str = JSON.stringify(document);
      if (str.length < 500) return { level: 'Simple', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
      if (str.length < 1500) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' };
      return { level: 'Complex', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' };
    } catch (error) {
      return { level: 'Invalid', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Policy Management</h1>
          </div>
          <p className="text-muted-foreground">
            Define and manage access control policies for your autonomous agents
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Create New Policy
              </DialogTitle>
              <DialogDescription>
                Define a new access control policy with JSON configuration
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Policy Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Admin Access Policy"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy">Policy Configuration (JSON)</Label>
                <Textarea
                  id="policy"
                  {...register("policy")}
                  rows={12}
                  className="font-mono text-sm"
                  placeholder={`{
  "version": "1.0",
  "rules": [
    {
      "action": "allow",
      "resource": "*",
      "conditions": {
        "role": ["admin"]
      }
    }
  ]
}`}
                />
                {errors.policy && (
                  <p className="text-sm text-destructive">{errors.policy.message}</p>
                )}
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Policy"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Policies</p>
                <p className="text-2xl font-bold">{loading ? "--" : policies.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                <p className="text-2xl font-bold">{loading ? "--" : policies.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-2xl font-bold">Today</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="policies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="policies" className="gap-2">
            <Shield className="h-4 w-4" />
            All Policies
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Policy Registry
              </CardTitle>
              <CardDescription>
                View and manage all access control policies in your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-12 w-12 text-destructive/50" />
                  <h3 className="mt-4 text-lg font-semibold">Error Loading Policies</h3>
                  <p className="text-destructive">{error}</p>
                </div>
              ) : policies.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No policies found</h3>
                  <p className="text-muted-foreground">Get started by creating your first policy</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Policy</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Complexity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {policies.map((policy) => {
                        const complexity = getPolicyComplexity(policy.document);
                        return (
                          <motion.tr
                            key={policy.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="group"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white">
                                  <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-medium">{policy.name}</p>
                                  <p className="text-sm text-muted-foreground font-mono">
                                    {policy.id.slice(0, 8)}...
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{formatDate(policy.created_at)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={complexity.color}>
                                {complexity.level}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                Active
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="gap-2">
                                      <Eye className="h-4 w-4" />
                                      View Policy
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Policy Details
                                      </DialogTitle>
                                      <DialogDescription>
                                        Configuration and metadata for {policy.name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="font-medium">Policy ID:</span>
                                          <p className="font-mono text-muted-foreground">{policy.id}</p>
                                        </div>
                                        <div>
                                          <span className="font-medium">Policy Name:</span>
                                          <p className="text-muted-foreground">{policy.name}</p>
                                        </div>
                                        <div>
                                          <span className="font-medium">Created:</span>
                                          <p className="text-muted-foreground">{formatDate(policy.created_at)}</p>
                                        </div>
                                        <div>
                                          <span className="font-medium">Complexity:</span>
                                          <Badge className={complexity.color}>
                                            {complexity.level}
                                          </Badge>
                                        </div>
                                      </div>
                                                                             <div>
                                         <span className="font-medium text-sm">Policy Configuration:</span>
                                         <pre className="mt-2 rounded-lg bg-muted p-4 text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                                            {policy.document ? JSON.stringify(policy.document, null, 2) : 'No policy document available'}
                                         </pre>
                                       </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
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
                Policy Analytics
              </CardTitle>
              <CardDescription>
                Insights and usage patterns for your access control policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">Policy usage patterns and insights will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
