// API Types for Nodara Network Dashboard

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

export interface ApiConfig {
  baseUrl: string;
  defaultHeaders: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface AuthToken {
  token: string;
  expiresAt?: Date;
  refreshToken?: string;
}

export interface ApiHeaders {
  [key: string]: string;
}

export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  data?: any;
  params?: QueryParams;
  headers?: ApiHeaders;
  timeout?: number;
}

export interface ApiResponseConfig {
  success: boolean;
  status: number;
  statusText: string;
  headers: Headers;
  data: any;
}

export interface RetryConfig {
  maxRetries: number;
  delay: number;
  backoffMultiplier: number;
  retryableStatusCodes: number[];
}

export interface DebounceConfig {
  wait: number;
  leading?: boolean;
  trailing?: boolean;
}

export interface ApiUtils {
  handleResponse: <T>(response: ApiResponse<T>) => T;
  createQueryString: (params: Record<string, any>) => string;
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ) => ((...args: Parameters<T>) => void);
  retry: <T>(
    fn: () => Promise<T>,
    maxRetries?: number,
    delay?: number
  ) => Promise<T>;
}

export interface ApiClient {
  get: <T>(endpoint: string, params?: Record<string, string>) => Promise<ApiResponse<T>>;
  post: <T>(endpoint: string, data?: any) => Promise<ApiResponse<T>>;
  put: <T>(endpoint: string, data?: any) => Promise<ApiResponse<T>>;
  delete: <T>(endpoint: string) => Promise<ApiResponse<T>>;
  patch: <T>(endpoint: string, data?: any) => Promise<ApiResponse<T>>;
  setAuthToken: (token: string) => void;
  clearAuthToken: () => void;
  setHeader: (key: string, value: string) => void;
  removeHeader: (key: string) => void;
}

// HTTP Method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Content Type types
export type ContentType = 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data';

// Response status types
export type ResponseStatus = 'success' | 'error' | 'pending';

// Error severity types
export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';

// Request priority types
export type RequestPriority = 'high' | 'normal' | 'low'; 