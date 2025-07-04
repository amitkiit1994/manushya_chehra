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

// Policy type
export interface Policy {
  id: string;
  name: string;
  document: Record<string, any>;
  created_at: string;
  validation_disabled?: boolean;
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
