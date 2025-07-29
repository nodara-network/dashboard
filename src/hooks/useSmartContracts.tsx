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
      if (!wallet?.publicKey) {
        throw new Error("Wallet not connected");
      }

      const taskIdBN = new BN(taskId);
      const responder = wallet.publicKey;

      // Derive the task account PDA
      const [taskAccountPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("task"),
          creator.toBuffer(),
          taskIdBN.toArrayLike(Buffer, "le", 8)
        ],
        program.programId
      );

      // Derive the response account PDA
      const [responseAccountPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("response"),
          taskAccountPda.toBuffer(),
          responder.toBuffer()
        ],
        program.programId
      );

      const tx = await program.methods
        .submitResponse(cid)
        .accountsPartial({
          taskAccount: taskAccountPda,
          responseAccount: responseAccountPda,
          responder,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    },
    onSuccess: () => {
      toast.success('Response submitted successfully!');
    },
    onError: (error) => {
      console.error('Submit response error:', error);
      toast.error('Failed to submit response');
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

      const tx = await program.methods
        .markTaskComplete()
        .accountsPartial({
          taskAccount: taskAccountPda,
          creator: wallet.publicKey,
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

      const tx = await program.methods
        .delegateTaskAccount(taskIdBN)
        .accountsPartial({
          creator: wallet.publicKey,
          taskAccount: taskAccountPda,
        })
        .rpc();

      return tx;
    },
    onSuccess: () => {
      toast.success('Task account delegated successfully!');
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

      const tx = await program.methods
        .undelegateTaskAccount()
        .accountsPartial({
          creator: wallet.publicKey,
          taskAccount: taskAccountPda,
        })
        .rpc();

      return tx;
    },
    onSuccess: () => {
      toast.success('Task account undelegated successfully!');
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
