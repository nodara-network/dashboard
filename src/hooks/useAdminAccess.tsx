"use client";

import { useSmartContractsProgram } from "@/hooks/useSmartContracts";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";

export function useAdminAccess() {
  const { publicKey } = useWallet();
  const { program } = useSmartContractsProgram();

  const { data: adminAccounts = [], isLoading } = useQuery({
    queryKey: ['admin-accounts', { publicKey: publicKey?.toString() }],
    queryFn: async () => {
      if (!publicKey) return [];
      
      try {
        const admins = await program.account.adminAccount.all();
        return admins;
      } catch (error) {
        console.error('Error fetching admin accounts:', error);
        return [];
      }
    },
    enabled: !!publicKey,
  });

  // Check if current wallet is an admin
  const isAdmin = adminAccounts.some(
    (admin: any) => admin.account.authority.toString() === publicKey?.toString()
  );

  return {
    isAdmin,
    isLoading,
    adminAccounts,
  };
} 