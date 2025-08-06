"use client";

import { useCluster } from "@/components/cluster/cluster-data-access";
import { useAnchorProvider } from "@/components/solana/SolanaProvider";
import { getProgram, getProgramId } from "@/utils/solana";
import { BN } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

export function useSmartContractsProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster()

  // Anchor Config
  const provider = useAnchorProvider();
  const programId = useMemo(() => getProgramId(), [cluster]);
  const program = getProgram(provider);

  const accounts = useQuery({
    queryKey: ['smart-contracts-accounts', { endpoint: connection.rpcEndpoint }],
    queryFn: () => program.provider.connection.getProgramAccounts(programId),
    retry: 1,
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const getAllTasks = useQuery({
    queryKey: ['all-tasks', { cluster }],
    queryFn: async () => {
      try {
        const tasks = await program.account.taskAccount.all();
        return tasks;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
    },
  });

  const getAllResponses = useQuery({
    queryKey: ['all-responses', { cluster }],
    queryFn: async () => {
      try {
        const responses = await program.account.responseAccount.all();
        return responses;
      } catch (error) {
        console.error('Error fetching responses:', error);
        return [];
      }
    },
  });

  const getAllRewardVaults = useQuery({
    queryKey: ['all-reward-vaults', { cluster }],
    queryFn: async () => {
      try {
        const vaults = await program.account.rewardVaultAccount.all();
        return vaults;
      } catch (error) {
        console.error('Error fetching reward vaults:', error);
        return [];
      }
    },
  });

  const getAllAdminAccounts = useQuery({
    queryKey: ['all-admin-accounts', { cluster }],
    queryFn: async () => {
      try {
        const admins = await program.account.adminAccount.all();
        return admins;
      } catch (error) {
        console.error('Error fetching admin accounts:', error);
        return [];
      }
    },
  });

  return {
    program,
    accounts,
    getProgramAccount,
    getAllTasks,
    getAllResponses,
    getAllRewardVaults,
    getAllAdminAccounts
  }
}

export function useSmartContractsProgramAccount() {
  const { cluster } = useCluster();
  const { program } = useSmartContractsProgram();
  const wallet = useWallet();
  const { connection } = useConnection();

  const createTask = useMutation({
    mutationKey: ['create-task', { cluster }],
    mutationFn: async ({
      taskId,
      rewardPerResponse,
      maxResponses,
      deadline,
      cid
    }: {
      taskId: number;
      rewardPerResponse: number;
      maxResponses: number;
      deadline: number;
      cid: string;
    }) => {
      if (!wallet?.publicKey) {
        throw new Error("Wallet not connected");
      }

      const creator = wallet.publicKey;
      const taskIdBN = new BN(taskId);
      const rewardBN = new BN(rewardPerResponse);
      const deadlineBN = new BN(deadline);

      // Derive the task account PDA
      const [taskAccountPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("task"),
          creator.toBuffer(),
          taskIdBN.toArrayLike(Buffer, "le", 8)
        ],
        program.programId
      );

      const tx = await program.methods
        .createTask(taskIdBN, rewardBN, maxResponses, deadlineBN, cid)
        .accountsPartial({
          taskAccount: taskAccountPda,
          creator,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    },
    onSuccess: () => {
      toast.success('Task created successfully!');
    },
    onError: (error) => {
      console.error('Create task error:', error);
      toast.error('Failed to create task');
    },
  });

  const submitResponse = useMutation({
    mutationKey: ['submit-response', { cluster }],
    mutationFn: async ({
      taskId,
      creator,
      cid
    }: {
      taskId: number;
      creator: PublicKey;
      cid: string;
    }) => {
      console.log('🔄 WebSocket submitResponse called with:', { taskId, creator: creator.toString(), cid });
      
      if (!wallet?.publicKey) {
        throw new Error("Wallet not connected");
      }

      const responder = wallet.publicKey;

      // Note: Task data will be fetched by WebSocket service
      // We send minimal required data and let the backend handle the blockchain queries

      // Submit response via WebSocket to your existing service
      const responseData = {
        type: 'submit_response',
        payload: {
          txnId: `${taskId}-${responder.toString().slice(0, 8)}-${Date.now()}`,
          url: `https://aqua-holy-guineafowl-4.mypinata.cloud/ipfs/${cid}`,
          creatorWallet: creator.toString(),
          rewardLamports: "0", // Will be populated by your service
          maxResponses: 0, // Will be populated by your service
          taskId: taskId.toString(),
          cid,
          responder: responder.toString(),
          submitterWallet: wallet.publicKey.toString(),
          timestamp: Date.now(),
          cluster: cluster.name || 'localnet'
        }
      };

      console.log('🔄 WebSocket VERSION - Submitting response to ws.nodara.network:', responseData);

      // Connect to your existing WebSocket service
      return new Promise((resolve, reject) => {
        const wsUrl = `wss://ws.nodara.network?publicKey=${encodeURIComponent(wallet.publicKey?.toString() || '')}`;
        const ws = new WebSocket(wsUrl);
        
        const timeout = setTimeout(() => {
          ws.close();
          reject(new Error('WebSocket connection timeout (30s)'));
        }, 30000);

        ws.onopen = () => {
          console.log('✅ Connected to Nodara WebSocket service');
          console.log('📤 Sending response data:', responseData);
          ws.send(JSON.stringify(responseData));
        };

        ws.onmessage = (event) => {
          try {
            const response = JSON.parse(event.data);
            console.log('📥 Received response from WebSocket:', response);
            
            if (response.type === 'WELCOME') {
              console.log('👋 Received welcome message - treating as successful submission');
              clearTimeout(timeout);
              resolve('Response submitted to Nodara network successfully');
              ws.close();
              return;
            }
            
            // Handle other success/error responses (if your service sends them)
            clearTimeout(timeout);
            
            if (response.success === true || response.type === 'RESPONSE_SUCCESS') {
              resolve(response.transactionId || response.txnId || 'Response submitted successfully');
            } else if (response.success === false || response.type === 'RESPONSE_ERROR') {
              reject(new Error(response.error || response.message || 'Failed to submit response'));
            } else {
              // Any other response type, treat as success
              console.log('🎉 Received unknown response type, treating as success:', response);
              resolve('Response submitted to Nodara network');
            }
            
            ws.close();
          } catch (error) {
            reject(new Error('Invalid response from server'));
            ws.close();
          }
        };

        ws.onerror = (error) => {
          clearTimeout(timeout);
          console.error('❌ WebSocket error:', error);
          reject(new Error('Failed to connect to Nodara network'));
          ws.close();
        };

        ws.onclose = (event) => {
          clearTimeout(timeout);
          if (event.code !== 1000) {
            console.warn('⚠️ WebSocket closed unexpectedly:', event.code, event.reason);
            reject(new Error(`Connection to Nodara network was closed unexpectedly (${event.code})`));
          }
        };
      });
    },
    onSuccess: (result) => {
      toast.success('Response submitted successfully to Nodara network!');
      console.log('Response submission result:', result);
    },
    onError: (error) => {
      console.error('Submit response error:', error);
      toast.error(`Failed to submit response: ${error.message}`);
    },
  });

  const depositFunds = useMutation({
    mutationKey: ['deposit-funds', { cluster }],
    mutationFn: async ({
      taskId,
      creator,
      amount
    }: {
      taskId: number;
      creator: PublicKey;
      amount: number;
    }) => {
      if (!wallet?.publicKey) {
        throw new Error("Wallet not connected");
      }

      const taskIdBN = new BN(taskId);
      const amountBN = new BN(amount);

      // Derive the task account PDA
      const [taskAccountPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("task"),
          creator.toBuffer(),
          taskIdBN.toArrayLike(Buffer, "le", 8)
        ],
        program.programId
      );

      // Derive the reward vault PDA
      const [rewardVaultPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("reward_vault"),
          taskAccountPda.toBuffer()
        ],
        program.programId
      );

      const tx = await program.methods
        .depositFunds(taskIdBN,amountBN)
        .accountsPartial({
          taskAccount: taskAccountPda,
          rewardVault: rewardVaultPda,
          creator: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    },
    onSuccess: () => {
      toast.success('Funds deposited successfully!');
    },
    onError: (error) => {
      console.error('Deposit funds error:', error);
      toast.error('Failed to deposit funds');
    },
  });

  const markTaskComplete = useMutation({
    mutationKey: ['mark-task-complete', { cluster }],
    mutationFn: async ({
      taskId,
      creator
    }: {
      taskId: number;
      creator: PublicKey;
    }) => {
      if (!wallet?.publicKey) {
        throw new Error("Wallet not connected");
      }

      const taskIdBN = new BN(taskId);

      // Derive the task account PDA
      const [taskAccountPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("task"),
          creator.toBuffer(),
          taskIdBN.toArrayLike(Buffer, "le", 8)
        ],
        program.programId
      );

      // Derive the admin account PDA
      const [adminAccountPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("admin")],
        program.programId
      );

      const tx = await program.methods
        .markTaskComplete()
        .accountsPartial({
          taskAccount: taskAccountPda,
          adminAccount: adminAccountPda,
          signer: wallet.publicKey,
        })
        .rpc();

      return tx;
    },
    onSuccess: () => {
      toast.success('Task marked as complete!');
    },
    onError: (error) => {
      console.error('Mark task complete error:', error);
      toast.error('Failed to mark task as complete');
    },
  });

  const initAdmin = useMutation({
    mutationKey: ['init-admin', { cluster }],
    mutationFn: async () => {
      if (!wallet?.publicKey) {
        throw new Error("Wallet not connected");
      }

      // Derive the admin account PDA
      const [adminAccountPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("admin")],
        program.programId
      );

      const tx = await program.methods
        .initAdmin()
        .accountsPartial({
          admin: wallet.publicKey,
          adminAccount: adminAccountPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    },
    onSuccess: () => {
      toast.success('Admin account initialized!');
    },
    onError: (error) => {
      console.error('Init admin error:', error);
      toast.error('Failed to initialize admin account');
    },
  });

  const delegateTaskAccount = useMutation({
    mutationKey: ['delegate-task-account', { cluster }],
    mutationFn: async ({
      taskId,
      creator
    }: {
      taskId: number;
      creator: PublicKey;
    }) => {
      // Delegate function temporarily disabled for local development
      console.log('Delegate task account temporarily disabled', { taskId, creator: creator.toString() });
      return 'delegate-disabled';
    },
    onSuccess: () => {
      toast.info('Delegate function temporarily disabled for local development');
    },
    onError: (error) => {
      console.error('Delegate task account error:', error);
      toast.error('Failed to delegate task account');
    },
  });

  const undelegateTaskAccount = useMutation({
    mutationKey: ['undelegate-task-account', { cluster }],
    mutationFn: async ({
      taskId,
      creator
    }: {
      taskId: number;
      creator: PublicKey;
    }) => {
      // Undelegate function temporarily disabled for local development
      console.log('Undelegate task account temporarily disabled', { taskId, creator: creator.toString() });
      return 'undelegate-disabled';
    },
    onSuccess: () => {
      toast.info('Undelegate function temporarily disabled for local development');
    },
    onError: (error) => {
      console.error('Undelegate task account error:', error);
      toast.error('Failed to undelegate task account');
    },
  });

  return {
    createTask,
    submitResponse,
    depositFunds,
    markTaskComplete,
    initAdmin,
    delegateTaskAccount,
    undelegateTaskAccount
  };
}
