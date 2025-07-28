"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Task, CreateTaskData, TaskResponse } from '@/types/tasks';
import { TaskService } from '@/services/tasks';

interface TaskContextType {
  // State
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<string>;
  submitResponse: (taskId: number, taskCreator: PublicKey, responder: PublicKey, cid: string) => Promise<string>;
  verifyResponse: (responseAccount: PublicKey, signer: PublicKey) => Promise<string>;
  cancelTask: (taskId: number, creator: PublicKey) => Promise<string>;
  markTaskComplete: (taskId: number, creator: PublicKey) => Promise<string>;
  depositFunds: (taskId: number, creator: PublicKey, amount: number) => Promise<string>;
  disburseRewards: (taskAccount: PublicKey, recipient: PublicKey, amount: number) => Promise<string>;
  fetchTaskResponses: (taskAccount: PublicKey) => Promise<TaskResponse[]>;
  
  // Utilities
  getTaskById: (id: string) => Task | undefined;
  getTasksByStatus: (status: 'active' | 'completed' | 'cancelled') => Task[];
  getTasksByCreator: (creator: string) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: React.ReactNode;
  connection: Connection;
  wallet: any;
}

export function TaskProvider({ children, connection, wallet }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const taskService = new TaskService(connection, wallet);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!wallet) {
        console.log('Wallet not connected, skipping task fetch');
        setTasks([]);
        return;
      }
      
      // Create a new TaskService instance to avoid dependency issues
      const service = new TaskService(connection, wallet);
      const fetchedTasks = await service.fetchTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [connection, wallet]);

  // Create new task
  const createTask = useCallback(async (data: CreateTaskData): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!wallet?.publicKey) {
        throw new Error('Wallet not connected');
      }
      
      // Create a new TaskService instance to avoid dependency issues
      const service = new TaskService(connection, wallet);
      const signature = await service.createTask(data, wallet.publicKey);
      
      // Refresh tasks after creation
      await fetchTasks();
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [connection, wallet, fetchTasks]);

  // Submit response to task
  const submitResponse = useCallback(async (
    taskId: number, 
    taskCreator: PublicKey, 
    responder: PublicKey, 
    cid: string
  ): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const signature = await taskService.submitResponse(taskId, taskCreator, responder, cid);
      
      // Refresh tasks after response submission
      await fetchTasks();
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response');
      console.error('Error submitting response:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [taskService, fetchTasks]);

  // Verify response
  const verifyResponse = useCallback(async (
    responseAccount: PublicKey, 
    signer: PublicKey
  ): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const signature = await taskService.verifyResponse(responseAccount, signer);
      
      // Refresh tasks after verification
      await fetchTasks();
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify response');
      console.error('Error verifying response:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [taskService, fetchTasks]);

  // Cancel task
  const cancelTask = useCallback(async (taskId: number, creator: PublicKey): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const signature = await taskService.cancelTask(taskId, creator);
      
      // Refresh tasks after cancellation
      await fetchTasks();
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel task');
      console.error('Error cancelling task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [taskService, fetchTasks]);

  // Mark task as complete
  const markTaskComplete = useCallback(async (taskId: number, creator: PublicKey): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const signature = await taskService.markTaskComplete(taskId, creator);
      
      // Refresh tasks after completion
      await fetchTasks();
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark task complete');
      console.error('Error marking task complete:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [taskService, fetchTasks]);

  // Deposit funds
  const depositFunds = useCallback(async (
    taskId: number, 
    creator: PublicKey, 
    amount: number
  ): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const signature = await taskService.depositFunds(taskId, creator, amount);
      
      // Refresh tasks after deposit
      await fetchTasks();
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deposit funds');
      console.error('Error depositing funds:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [taskService, fetchTasks]);

  // Disburse rewards
  const disburseRewards = useCallback(async (
    taskAccount: PublicKey, 
    recipient: PublicKey, 
    amount: number
  ): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const signature = await taskService.disburseRewards(taskAccount, recipient, amount);
      
      // Refresh tasks after disbursement
      await fetchTasks();
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disburse rewards');
      console.error('Error disbursing rewards:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [taskService, fetchTasks]);

  // Fetch task responses
  const fetchTaskResponses = useCallback(async (taskAccount: PublicKey): Promise<TaskResponse[]> => {
    try {
      setError(null);
      return await taskService.fetchTaskResponses(taskAccount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task responses');
      console.error('Error fetching task responses:', err);
      throw err;
    }
  }, [taskService]);

  // Utility functions
  const getTaskById = useCallback((id: string): Task | undefined => {
    return tasks.find(task => task.id === id);
  }, [tasks]);

  const getTasksByStatus = useCallback((status: 'active' | 'completed' | 'cancelled'): Task[] => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const getTasksByCreator = useCallback((creator: string): Task[] => {
    return tasks.filter(task => task.creator === creator);
  }, [tasks]);

  // Initial fetch on mount
  useEffect(() => {
    if (connection && wallet) {
      // Use a separate function to avoid dependency issues
      const loadTasks = async () => {
        try {
          setLoading(true);
          setError(null);
          
          if (!wallet) {
            console.log('Wallet not connected, skipping task fetch');
            setTasks([]);
            return;
          }
          
          const fetchedTasks = await taskService.fetchTasks();
          setTasks(fetchedTasks);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
          console.error('Error fetching tasks:', err);
          setTasks([]);
        } finally {
          setLoading(false);
        }
      };
      
      loadTasks();
    }
  }, [connection, wallet?.publicKey?.toString()]); // Only depend on wallet public key string

  const value: TaskContextType = {
    // State
    tasks,
    loading,
    error,
    
    // Actions
    fetchTasks,
    createTask,
    submitResponse,
    verifyResponse,
    cancelTask,
    markTaskComplete,
    depositFunds,
    disburseRewards,
    fetchTaskResponses,
    
    // Utilities
    getTaskById,
    getTasksByStatus,
    getTasksByCreator,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

// Hook to use TaskContext
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
} 