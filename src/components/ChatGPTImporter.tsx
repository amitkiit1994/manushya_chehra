"use client";
import { useState } from "react";
import { createMemory } from "../lib/api";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle, Brain } from "lucide-react";
import { toast } from "sonner";

interface ChatGPTMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

interface ChatGPTConversation {
  title?: string;
  messages: ChatGPTMessage[];
  create_time?: number;
  update_time?: number;
}

export default function ChatGPTImporter() {
  const [jsonData, setJsonData] = useState("");
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    total: number;
    imported: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const parseAndImport = async () => {
    if (!jsonData.trim()) {
      toast.error("Please paste your ChatGPT export data");
      return;
    }

    setImporting(true);
    setProgress(0);
    setResults(null);

    try {
      // Try to parse the JSON
      let conversations: ChatGPTConversation[] = [];
      const parsed = JSON.parse(jsonData);

      // Handle different ChatGPT export formats
      if (Array.isArray(parsed)) {
        // Array of conversations
        conversations = parsed;
      } else if (parsed.conversations) {
        // Wrapped in conversations object
        conversations = parsed.conversations;
      } else if (parsed.messages) {
        // Single conversation
        conversations = [parsed];
      } else {
        throw new Error("Unrecognized ChatGPT export format");
      }

      const total = conversations.length;
      let imported = 0;
      let failed = 0;
      const errors: string[] = [];

      for (let i = 0; i < conversations.length; i++) {
        const conversation = conversations[i];
        setProgress(((i + 1) / total) * 100);

        try {
          // Create a summary of the conversation
          const title = conversation.title || `Conversation ${i + 1}`;
          const messageCount = conversation.messages?.length || 0;
          
          if (messageCount === 0) {
            errors.push(`${title}: No messages found`);
            failed++;
            continue;
          }

          // Extract key information from the conversation
          const userMessages = conversation.messages.filter(m => m.role === "user");
          const assistantMessages = conversation.messages.filter(m => m.role === "assistant");
          
          // Create a summary text
          const firstUserMessage = userMessages[0]?.content || "";
          const conversationSummary = `${title}\n\nFirst question: ${firstUserMessage.substring(0, 200)}${firstUserMessage.length > 200 ? "..." : ""}`;
          
          // Create memory with rich metadata
          await createMemory({
            text: conversationSummary,
            type: "conversation",
            meta_data: {
              source: "chatgpt_import",
              title: title,
              message_count: messageCount,
              user_messages: userMessages.length,
              assistant_messages: assistantMessages.length,
              create_time: conversation.create_time,
              update_time: conversation.update_time,
              full_conversation: conversation.messages.map(m => ({
                role: m.role,
                content: m.content.substring(0, 1000) // Truncate very long messages
              }))
            }
          });

          imported++;
        } catch (error: any) {
          errors.push(`${conversation.title || `Conversation ${i + 1}`}: ${error.message}`);
          failed++;
        }

        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setResults({ total, imported, failed, errors });
      
      if (imported > 0) {
        toast.success(`Successfully imported ${imported} conversations!`);
      }
      
      if (failed > 0) {
        toast.error(`Failed to import ${failed} conversations. Check details below.`);
      }

    } catch (error: any) {
      toast.error(`Failed to parse JSON: ${error.message}`);
      setResults({
        total: 0,
        imported: 0,
        failed: 1,
        errors: [`JSON parsing error: ${error.message}`]
      });
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonData(content);
    };
    reader.readAsText(file);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          ChatGPT Conversation Import
        </CardTitle>
        <CardDescription>
          Import your ChatGPT conversation history as memories. Supports JSON export format from ChatGPT.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Option */}
        <div className="space-y-2">
          <label htmlFor="file-upload" className="text-sm font-medium">
            Upload ChatGPT Export File
          </label>
          <div className="flex items-center gap-4">
            <input
              id="file-upload"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Choose JSON File
            </Button>
            <span className="text-sm text-muted-foreground">
              Or paste JSON data below
            </span>
          </div>
        </div>

        {/* Manual Paste Option */}
        <div className="space-y-2">
          <label htmlFor="json-data" className="text-sm font-medium">
            ChatGPT Export JSON Data
          </label>
          <Textarea
            id="json-data"
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder="Paste your ChatGPT export JSON here..."
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        {/* Import Button */}
        <Button
          onClick={parseAndImport}
          disabled={!jsonData.trim() || importing}
          className="w-full gap-2"
        >
          {importing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Importing...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Import Conversations
            </>
          )}
        </Button>

        {/* Progress Bar */}
        {importing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Importing conversations...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{results.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{results.imported}</div>
                <div className="text-sm text-green-600">Imported</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>

            {results.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Import Errors:</p>
                    <ul className="text-sm space-y-1">
                      {results.errors.slice(0, 5).map((error, i) => (
                        <li key={i} className="list-disc list-inside">
                          {error}
                        </li>
                      ))}
                      {results.errors.length > 5 && (
                        <li className="text-muted-foreground">
                          ... and {results.errors.length - 5} more errors
                        </li>
                      )}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {results.imported > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Successfully imported {results.imported} conversations! 
                  You can now find them in your memories with the tag "chatgpt_import".
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            How to Export from ChatGPT:
          </h4>
          <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
            <li>Go to ChatGPT Settings → Data Controls</li>
            <li>Click "Export data"</li>
            <li>Wait for the export email</li>
            <li>Download and extract the ZIP file</li>
            <li>Open the conversations.json file</li>
            <li>Copy the content and paste it here</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
} 