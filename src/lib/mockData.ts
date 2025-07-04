import type { AuditLog } from './types';

// Mock audit logs for testing
export const mockAuditLogs: AuditLog[] = [
  {
    id: "log_001",
    timestamp: "2025-07-03T23:20:15.123Z",
    actor_identity: "frontend_test",
    action: "create",
    resource_type: "memory",
    resource_id: "cd58fd1c-c6d0-444d-9977-ea85dad79ef1",
    metadata: {
      memory_type: "conversation",
      content_preview: "Welcome to Manushya.ai! This is your first...",
      source: "manual_entry"
    }
  },
  {
    id: "log_002", 
    timestamp: "2025-07-03T23:18:42.456Z",
    actor_identity: "frontend_test",
    action: "update",
    resource_type: "identity",
    resource_id: "2ce9984e-b55e-4a97-aa61-1286dccb8259",
    metadata: {
      field_changed: "claims",
      old_value: {"name": "Test User"},
      new_value: {"name": "Frontend Test User"}
    }
  },
  {
    id: "log_003",
    timestamp: "2025-07-03T23:17:30.789Z", 
    actor_identity: "frontend_test",
    action: "create",
    resource_type: "memory",
    resource_id: "ade4c453-5696-430c-b8a5-2ad073b05b75",
    metadata: {
      memory_type: "action",
      content_preview: "User completed the dashboard setup...",
      duration: "5 minutes",
      status: "success"
    }
  },
  {
    id: "log_004",
    timestamp: "2025-07-03T23:15:18.234Z",
    actor_identity: "frontend_test", 
    action: "create",
    resource_type: "memory",
    resource_id: "757de2b4-b232-45d8-b112-1c1bec5330b7",
    metadata: {
      memory_type: "observation",
      content_preview: "Learning that the user prefers detailed...",
      confidence: 0.9,
      learning_source: "interaction_pattern"
    }
  },
  {
    id: "log_005",
    timestamp: "2025-07-03T23:10:45.567Z",
    actor_identity: "frontend_test",
    action: "delete",
    resource_type: "memory", 
    resource_id: "old_memory_123",
    metadata: {
      memory_type: "conversation",
      content_preview: "Old test conversation that was removed",
      deletion_reason: "cleanup"
    }
  },
  {
    id: "log_006",
    timestamp: "2025-07-03T23:08:12.890Z",
    actor_identity: "frontend_test",
    action: "create",
    resource_type: "policy",
    resource_id: "policy_001",
    metadata: {
      policy_name: "Memory Retention Policy",
      complexity_score: 0.3,
      validation_status: "passed"
    }
  },
  {
    id: "log_007",
    timestamp: "2025-07-03T23:05:33.123Z",
    actor_identity: "frontend_test",
    action: "search",
    resource_type: "memory",
    resource_id: "search_query_001",
    metadata: {
      query: "dashboard setup",
      results_count: 2,
      search_duration: "0.15s",
      search_score: 0.8
    }
  },
  {
    id: "log_008",
    timestamp: "2025-07-03T23:02:15.456Z",
    actor_identity: "frontend_test",
    action: "login",
    resource_type: "identity",
    resource_id: "2ce9984e-b55e-4a97-aa61-1286dccb8259",
    metadata: {
      login_method: "external_id",
      ip_address: "127.0.0.1",
      user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      session_duration: "25 minutes"
    }
  },
  {
    id: "log_009",
    timestamp: "2025-07-03T22:58:47.789Z",
    actor_identity: "system",
    action: "create",
    resource_type: "identity",
    resource_id: "2ce9984e-b55e-4a97-aa61-1286dccb8259",
    metadata: {
      external_id: "frontend_test",
      role: "user",
      created_via: "api_endpoint"
    }
  },

  {
    id: "log_011",
    timestamp: "2025-07-03T22:52:33.456Z",
    actor_identity: "frontend_test",
    action: "read",
    resource_type: "memory",
    resource_id: "cd58fd1c-c6d0-444d-9977-ea85dad79ef1",
    metadata: {
      access_type: "view",
      response_time: "0.05s",
      user_agent: "Mozilla/5.0"
    }
  },
  {
    id: "log_012",
    timestamp: "2025-07-03T22:48:15.789Z",
    actor_identity: "system",
    action: "update",
    resource_type: "policy",
    resource_id: "policy_001",
    metadata: {
      field_changed: "validation_rules",
      change_reason: "security_update",
      automated: true
    },
    memory_diff: {
      old_value: {"max_memory_size": 1000},
      new_value: {"max_memory_size": 2000}
    }
  },
  {
    id: "log_013",
    timestamp: "2025-07-03T22:45:42.123Z",
    actor_identity: "frontend_test",
    action: "search",
    resource_type: "memory",
    resource_id: "search_session_002",
    metadata: {
      query: "user preferences",
      results_count: 3,
      search_duration: "0.12s",
      filters_applied: ["type:observation"]
    }
  },
  {
    id: "log_014",
    timestamp: "2025-07-03T22:40:18.567Z",
    actor_identity: "admin",
    action: "create",
    resource_type: "identity",
    resource_id: "admin_user_001",
    metadata: {
      external_id: "admin_user",
      role: "admin",
      permissions: ["read", "write", "delete", "admin"]
    }
  }
];

// Helper function to get mock audit logs (simulates API call)
export const getMockAuditLogs = (): Promise<AuditLog[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(mockAuditLogs);
    }, 500);
  });
}; 