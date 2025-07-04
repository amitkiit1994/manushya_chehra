// Environment configuration utility
export const config = {
  // API Configuration
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    timeout: 10000,
  },
  
  // App Configuration
  app: {
    title: process.env.NEXT_PUBLIC_APP_TITLE || 'Manushya.ai',
    description: 'Secure identity + memory infrastructure system for autonomous agents',
  },
  
  // Debug Configuration
  debug: {
    enabled: process.env.NEXT_PUBLIC_DEBUG === 'true',
  },
  
  // Feature Flags
  features: {
    auditLogs: true, // Can be controlled via env var in the future
  },
} as const;

// Type-safe config access
export type Config = typeof config;

// Validation function
export function validateConfig() {
  const required = ['NEXT_PUBLIC_API_BASE_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing);
    console.warn('Using default values. See README.md for configuration.');
  }
  
  if (config.debug.enabled) {
    console.log('🔧 Configuration loaded:', config);
  }
}

// Export individual config sections for convenience
export const { api, app, debug, features } = config; 