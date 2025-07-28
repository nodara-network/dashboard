import { PublicKey } from '@solana/web3.js';

// Smart Contract Account Types (matching IDL)
export interface TaskAccount {
  taskId: number;
  creator: PublicKey;
  rewardPerResponse: number;
  maxResponses: number;
  deadline: number; // Unix timestamp
  responsesReceived: number;
  isComplete: boolean;
  bump: number;
  cid: string;
}

export interface ResponseAccount {
  taskBump: number;
  responder: PublicKey;
  timestamp: number; // Unix timestamp
  isVerified: boolean;
  bump: number;
  cid: string;
}

export interface RewardVaultAccount {
  taskBump: number;
  balance: number;
  bump: number;
}

// Frontend Task Interface (enhanced for UI)
export interface Task {
  id: string;
  taskAccount: PublicKey;
  title: string;
  description: string;
  reward: number;
  responses: number;
  maxResponses: number;
  deadline: Date;
  status: 'active' | 'completed' | 'cancelled';
  creator: string;
  cid: string;
  isComplete: boolean;
  responsesReceived: number;
}

// Task Creation Form Data
export interface CreateTaskData {
  taskId: number;
  rewardPerResponse: number;
  maxResponses: number;
  deadline: Date;
  cid: string;
}

// Task Response Data
export interface TaskResponse {
  id: string;
  taskId: string;
  responder: string;
  cid: string;
  timestamp: Date;
  isVerified: boolean;
}

// Smart Contract Program Constants
export const PROGRAM_ID = '5rA6ZXgbDsW96eqXneKUBCP69bBn2e4yERmMKuTGkjAQ';
export const PROGRAM_ID_PUBKEY = new PublicKey(PROGRAM_ID);

// PDA Seeds
export const TASK_SEEDS = ['task'];
export const RESPONSE_SEEDS = ['response'];
export const VAULT_SEEDS = ['vault'];

// Error Types
export interface TaskError {
  code: number;
  name: string;
  message: string;
}

// Task Status Enum
export enum TaskStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Response Status Enum
export enum ResponseStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
} 