"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createPolicy } from "../lib/api";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  document: z.string().min(1, "Policy JSON is required"),
});

type FormData = z.infer<typeof schema>;

export default function PolicyEditor({ onCreated }: { onCreated?: () => void }) {
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
      const doc = JSON.parse(data.document);
      await createPolicy({ name: data.name, document: doc });
      setSuccess("Policy created!");
      reset();
      onCreated?.();
    } catch (e: any) {
      setError(e?.message || "Failed to create policy (check JSON)");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1">Name</label>
        <input
          {...register("name")}
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00FFD1]"
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="block mb-1">Policy JSON</label>
        <textarea
          {...register("document")}
          rows={6}
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00FFD1] font-mono"
        />
        {errors.document && (
          <p className="text-red-400 text-sm mt-1">{errors.document.message}</p>
        )}
      </div>
      {error && <div className="text-red-400">{error}</div>}
      {success && <div className="text-green-400">{success}</div>}
      <button
        type="submit"
        className="w-full py-2 rounded bg-[#00FFD1] text-black font-semibold hover:bg-teal-300 transition"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Policy"}
      </button>
    </form>
  );
}
