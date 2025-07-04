"use client";
import { useEffect, useState } from "react";
import { getMemories, searchMemories, createMemory, deleteMemory } from "../../../lib/api";
import type { Memory } from "../../../lib/types";
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
import { Search, Brain, Plus, Trash2, Clock, Database, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const createSchema = z.object({
  type: z.string().min(1, "Type is required"),
  text: z.string().min(1, "Text is required"),
  meta_data: z.string().default("{}"),
});

type CreateForm = z.infer<typeof createSchema>;

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const fetchMemories = async (query?: string) => {
    setSearching(true);
    setError("");
    try {
      const data = query ? await searchMemories(query) : await getMemories();
      setMemories(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Failed to fetch memories");
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMemories(search);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMemory(id);
      toast.success("Memory deleted successfully");
      fetchMemories(search);
    } catch (e: any) {
      toast.error("Failed to delete memory");
    }
  };

  // Create memory form
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
      const meta_data = JSON.parse(data.meta_data);
      await createMemory({ 
        text: data.text, 
        type: data.type, 
        metadata: meta_data 
      });
      toast.success("Memory created successfully");
      reset();
      fetchMemories(search);
    } catch (e: any) {
      setError(e?.message || "Failed to create memory (check metadata JSON)");
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

  const getTypeColor = (type: string) => {
    const colors = {
      'conversation': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'action': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'observation': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'thought': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Memory Bank</h1>
          </div>
          <p className="text-muted-foreground">
            Store, search, and manage your autonomous agent's memories and experiences
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Memory
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Create New Memory
              </DialogTitle>
              <DialogDescription>
                Add a new memory entry to your agent's knowledge base
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Memory Type</Label>
                <Input
                  id="type"
                  {...register("type")}
                  placeholder="e.g., conversation, action, observation"
                />
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="text">Memory Text</Label>
                <Textarea
                  id="text"
                  {...register("text")}
                  rows={4}
                  placeholder="Describe what happened or what was learned..."
                />
                {errors.text && (
                  <p className="text-sm text-destructive">{errors.text.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_data">Metadata (JSON)</Label>
                <Textarea
                  id="meta_data"
                  {...register("meta_data")}
                  rows={3}
                  className="font-mono text-sm"
                  placeholder='{"source": "user", "context": "conversation"}'
                />
                {errors.meta_data && (
                  <p className="text-sm text-destructive">{errors.meta_data.message}</p>
                )}
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Memory"}
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
                <p className="text-sm font-medium text-muted-foreground">Total Memories</p>
                <p className="text-2xl font-bold">{searching ? "--" : memories.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Memory Types</p>
                <p className="text-2xl font-bold">{searching ? "--" : new Set(memories.map(m => m.type)).size}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Memory Search
          </CardTitle>
          <CardDescription>
            Search through your agent's memories using natural language or keywords
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search memories... (e.g., 'conversations about AI')"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={searching}>
              {searching ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="memories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="memories" className="gap-2">
            <Brain className="h-4 w-4" />
            All Memories
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="memories" className="space-y-6">
          {searching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-destructive/50" />
                  <h3 className="mt-4 text-lg font-semibold">Search Error</h3>
                  <p className="text-destructive">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : memories.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <Brain className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No memories found</h3>
                  <p className="text-muted-foreground">
                    {search ? "Try adjusting your search terms" : "Start by creating your first memory"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {memories.map((memory) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    layout
                  >
                    <Card className="group hover:shadow-md transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className={getTypeColor(memory.type)}>
                            {memory.type}
                          </Badge>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(memory.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(memory.created_at)}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm leading-relaxed">{memory.text}</p>
                          {Object.keys(memory.meta_data || {}).length > 0 && (
                            <details className="text-xs">
                              <summary className="cursor-pointer font-medium text-muted-foreground">Metadata</summary>
                              <pre className="mt-2 bg-muted rounded-lg p-2 overflow-auto max-h-20 whitespace-pre-wrap">
                                {JSON.stringify(memory.meta_data, null, 2)}
                              </pre>
                            </details>
                          )}
                          {memory.score && (
                            <Badge variant="outline" className="text-xs">
                              Score: {memory.score.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>



        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Memory Analytics
              </CardTitle>
              <CardDescription>
                Insights and patterns in your agent's memory usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">Memory patterns and insights will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
