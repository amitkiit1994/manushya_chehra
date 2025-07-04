"use client";
import { useEffect, useState } from "react";
import { getPolicies, createPolicy, updatePolicy, deletePolicy, testPolicy } from "../../../lib/api";
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
import { Switch } from "../../../components/ui/switch";
import { Shield, Plus, Clock, FileText, Sparkles, AlertTriangle, CheckCircle2, Eye, Edit, Trash2, TestTube } from "lucide-react";
import { toast } from "sonner";

const createSchema = z.object({
  role: z.string().min(1, "Role is required"),
  rule: z.string().min(1, "Policy rule (JSON) is required"),
  description: z.string().default(""),
  priority: z.number().default(0),
  is_active: z.boolean().default(true),
});

type CreateForm = z.infer<typeof createSchema>;

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [testingPolicy, setTestingPolicy] = useState(false);

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
  } = useForm({
    resolver: zodResolver(createSchema),
  });

  const onCreate = async (data: CreateForm) => {
    setError("");
    try {
      const ruleData = JSON.parse(data.rule);
      await createPolicy({ 
        role: data.role, 
        rule: ruleData,
        description: data.description,
        priority: data.priority,
        is_active: data.is_active
      });
      toast.success("Policy created successfully");
      reset();
      fetchPolicies();
    } catch (e: any) {
      setError(e?.message || "Failed to create policy (check rule JSON)");
    }
  };

  const handleToggleActive = async (policy: Policy) => {
    try {
      await updatePolicy(policy.id, { is_active: !policy.is_active });
      toast.success(`Policy ${policy.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchPolicies();
    } catch (e: any) {
      toast.error("Failed to update policy");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePolicy(id);
      toast.success("Policy deleted successfully");
      fetchPolicies();
    } catch (e: any) {
      toast.error("Failed to delete policy");
    }
  };

  const handleTestPolicy = async (policy: Policy) => {
    setTestingPolicy(true);
    try {
      const result = await testPolicy(policy.role, "read", "memory", { user_id: "test" });
      toast.success(`Policy test result: ${JSON.stringify(result)}`);
    } catch (e: any) {
      toast.error("Policy test failed");
    } finally {
      setTestingPolicy(false);
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

  const getPolicyComplexity = (rule: any) => {
    if (!rule) {
      return { level: 'Unknown', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' };
    }
    
    try {
      const str = JSON.stringify(rule);
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
                Define a new access control policy with JSON Logic rules
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  {...register("role")}
                  placeholder="e.g., admin, user, agent"
                />
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  {...register("description")}
                  placeholder="Policy description (optional)"
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  {...register("priority", { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  max="100"
                />
                {errors.priority && (
                  <p className="text-sm text-destructive">{errors.priority.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rule">Policy Rule (JSON Logic)</Label>
                <Textarea
                  id="rule"
                  {...register("rule")}
                  rows={12}
                  className="font-mono text-sm"
                  placeholder={`{
  "and": [
    { "==": [{ "var": "user.role" }, "admin"] },
    { "in": [{ "var": "action" }, ["read", "write", "delete"]] }
  ]
}`}
                />
                {errors.rule && (
                  <p className="text-sm text-destructive">{errors.rule.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is_active" {...register("is_active")} />
                <Label htmlFor="is_active">Active</Label>
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
                <p className="text-2xl font-bold">{loading ? "--" : policies.filter(p => p.is_active).length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Unique Roles</p>
                <p className="text-2xl font-bold">{loading ? "--" : new Set(policies.map(p => p.role)).size}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                Access Control Policies
              </CardTitle>
              <CardDescription>
                Manage policies that control access to resources and actions
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
                  <h3 className="mt-4 text-lg font-semibold">Error Loading Policies</h3>
                  <p className="text-destructive">{error}</p>
                </div>
              ) : policies.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No policies found</h3>
                  <p className="text-muted-foreground">Create your first access control policy to get started</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Complexity</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {policies.map((policy) => {
                        const complexity = getPolicyComplexity(policy.rule);
                        return (
                          <motion.tr
                            key={policy.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="group"
                          >
                            <TableCell>
                              <div className="font-medium">{policy.role}</div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate">
                                {policy.description || "No description"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{policy.priority}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={policy.is_active}
                                  onCheckedChange={() => handleToggleActive(policy)}
                                />
                                <Badge className={policy.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"}>
                                  {policy.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={complexity.color}>
                                {complexity.level}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{formatDate(policy.created_at)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleTestPolicy(policy)}
                                  disabled={testingPolicy}
                                  className="h-8 w-8 p-0"
                                >
                                  <TestTube className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedPolicy(policy)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(policy.id)}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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
                Insights and patterns in your access control policies
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

      {/* Policy Detail Dialog */}
      <Dialog open={!!selectedPolicy} onOpenChange={() => setSelectedPolicy(null)}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Policy Details
            </DialogTitle>
            <DialogDescription>
              View detailed information about this access control policy
            </DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <p className="text-sm text-muted-foreground">{selectedPolicy.role}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <p className="text-sm text-muted-foreground">{selectedPolicy.priority}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={selectedPolicy.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"}>
                    {selectedPolicy.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedPolicy.created_at)}</p>
                </div>
              </div>
              {selectedPolicy.description && (
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedPolicy.description}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Policy Rule (JSON Logic)</Label>
                <pre className="mt-2 text-xs bg-muted rounded-lg p-4 overflow-auto max-h-64">
                  {JSON.stringify(selectedPolicy.rule, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
