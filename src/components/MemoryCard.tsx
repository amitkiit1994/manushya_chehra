"use client";
import type { Memory } from "../lib/types";
import { motion } from "framer-motion";

export default function MemoryCard({ memory, onDelete }: { memory: Memory; onDelete?: (id: string) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`bg-slate-900 rounded-lg p-4 shadow flex flex-col gap-2 relative ${memory.deleted ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="text-[#00FFD1] font-semibold text-sm">{memory.type}</div>
        <div className="text-xs text-slate-400">{new Date(memory.timestamp).toLocaleString()}</div>
      </div>
      <pre className="text-xs text-white bg-slate-800 p-2 rounded overflow-x-auto">
        {JSON.stringify(memory.metadata, null, 2)}
      </pre>
      {onDelete && !memory.deleted && (
        <button
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => onDelete(memory.id)}
        >
          Delete
        </button>
      )}
      {memory.deleted && (
        <div className="absolute top-2 right-2 text-xs text-red-400">Deleted</div>
      )}
    </motion.div>
  );
}
