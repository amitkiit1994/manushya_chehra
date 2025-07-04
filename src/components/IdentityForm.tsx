"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createIdentity } from "../lib/api";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

const schema = z.object({
  external_id: z.string().min(1, "External ID is required"),
});

type FormData = z.infer<typeof schema>;

export default function IdentityForm({ onCreated }: { onCreated?: () => void }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setSuccess("");
    try {
      await createIdentity(data.external_id, "agent");
      setSuccess("Identity created successfully!");
      reset();
      onCreated?.();
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Failed to create identity");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Identity</CardTitle>
        <CardDescription>
          Create a new identity with an external ID
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="external_id">External ID</Label>
            <Input
              id="external_id"
              {...register("external_id")}
              placeholder="Enter external ID"
            />
            {errors.external_id && (
              <p className="text-sm text-destructive">{errors.external_id.message}</p>
            )}
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Identity"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
