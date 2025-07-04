// Identity type
export interface Identity {
  id: string;
  external_id: string;
  role: string;
  claims: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Identity create/update types
export interface IdentityCreate {
  external_id: string;
  role: string;
  claims?: Record<string, any>;
}

export interface IdentityUpdate {
  role?: string;
  claims?: Record<string, any>;
  is_active?: boolean;
}

// Memory type
export interface Memory {
  id: string;
  identity_id: string;
  text: string;
  type: string;
  meta_data: Record<string, any>;
  score?: number;
  version: number;
  ttl_days?: number;
  created_at: string;
  updated_at: string;
}

// Memory create/update types
export interface MemoryCreate {
  text: string;
  type: string;
  metadata?: Record<string, any>;
  ttl_days?: number;
}

export interface MemoryUpdate {
  text?: string;
  type?: string;
  metadata?: Record<string, any>;
  ttl_days?: number;
}

export interface MemorySearchRequest {
  query: string;
  type?: string;
  limit?: number;
  similarity_threshold?: number;
}

// Policy type
export interface Policy {
  id: string;
  role: string;
  rule: Record<string, any>;
  description?: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Policy create/update types
export interface PolicyCreate {
  role: string;
  rule: Record<string, any>;
  description?: string;
  priority?: number;
  is_active?: boolean;
}

export interface PolicyUpdate {
  rule?: Record<string, any>;
  description?: string;
  priority?: number;
  is_active?: boolean;
}

// Auth response type
export interface AuthResponse {
  access_token: string;
  token_type: string;
  identity: Identity;
}

// Audit log type
export interface AuditLog {
  id: string;
  timestamp: string;
  actor_identity: string;
  action: string;
  resource_type: string;
  resource_id: string;
  memory_diff?: Record<string, any>;
  metadata?: Record<string, any>;
}
