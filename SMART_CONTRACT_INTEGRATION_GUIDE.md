# Smart Contract Integration Guide - Nodara Dashboard

This document outlines the comprehensive steps used to integrate the frontend with smart contracts in the Nodara Dashboard project, based on the successful PixelMint integration pattern.

## 🏗️ Architecture Overview

The integration follows a layered architecture:
- **Frontend**: Next.js 15 with React 19
- **Blockchain Integration**: Solana Web3.js + Anchor Framework
- **Wallet Management**: Solana Wallet Adapter
- **State Management**: React Query + Jotai
- **Smart Contract**: Anchor-based Solana program for task management
- **Toast Notifications**: Sonner for user feedback

## 📋 Step-by-Step Integration Process

### 1. Core Dependencies Setup

**Updated packages in package.json:**
```json
{
  "@coral-xyz/anchor": "^0.31.1",
  "@solana/wallet-adapter-base": "^0.9.27",
  "@solana/wallet-adapter-react": "^0.15.39",
  "@solana/wallet-adapter-react-ui": "^0.9.39",
  "@solana/wallet-adapter-wallets": "^0.19.37",
  "@solana/web3.js": "^1.98.2",
  "@solana/spl-token": "^0.4.13",
  "@tanstack/react-query": "^5.82.0",
  "jotai": "^2.12.5",
  "sonner": "^2.0.6"
}
```

### 2. Smart Contract IDL Integration

**File Structure:**
```
dashboard/
├── target/
│   ├── idl/
│   │   └── smart_contracts.json      # Smart contract IDL
│   └── types/
│       └── smart_contracts.ts        # TypeScript types from IDL
└── src/
    └── utils/
        └── solana.ts                 # Contract utilities
```

**Key Implementation (`src/utils/solana.ts`):**
```typescript
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { PublicKey } from "@solana/web3.js";
import idl from "../../target/idl/smart_contracts.json";
import { SmartContracts } from '../../target/types/smart_contracts';

export const programId = new PublicKey("Afja4Q8urL5j8Hn3PpCkgP2Tgpe8xtp98khPmAVZF5Vk");

export function getProgram(provider: AnchorProvider): Program<SmartContracts> {
  return new Program(idl as any, provider);
}

export const getProgramId = () => programId;
```

**Updated Program ID:**
- Changed from: `5rA6ZXgbDsW96eqXneKUBCP69bBn2e4yERmMKuTGkjAQ`
- Changed to: `5rA6ZXgbDsW96eqXneKUBCP69bBn2e4yERmMKuTGkjAQ` (using deployed program ID)

### 3. Cluster Management

**Network Configuration (`src/components/cluster/cluster-data-access.tsx`):**
- Supports devnet, testnet, and local development
- Uses Jotai for state management
- Provides cluster switching functionality

### 4. Solana Provider Setup

**Provider Implementation (`src/components/solana/SolanaProvider.tsx`):**
```tsx
export function SolanaProvider({ children }: { children: ReactNode }) {
  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export function useAnchorProvider() {
  const connection = new Connection("https://api.devnet.solana.com", 'confirmed')
  const wallet = useWallet()
  return new AnchorProvider(connection, wallet as AnchorWallet, { commitment: 'confirmed' })
}
```

### 5. Smart Contract Hooks

**Main Hook (`src/hooks/useSmartContracts.tsx`):**

**Query Functions:**
- `getAllTasks()` - Fetch all task accounts
- `getAllResponses()` - Fetch all response accounts
- `getAllRewardVaults()` - Fetch all reward vault accounts

**Mutation Functions:**
- `createTask()` - Create a new task with rewards
- `submitResponse()` - Submit a response to a task
- `depositFunds()` - Deposit funds to task reward vault
- `markTaskComplete()` - Mark task as completed
- `initAdmin()` - Initialize admin account
- `delegateTaskAccount()` - Delegate task account to MagicBlock
- `undelegateTaskAccount()` - Undelegate task account from MagicBlock

**Example Task Creation:**
```tsx
const createTask = useMutation({
  mutationFn: async ({
    taskId, rewardPerResponse, maxResponses, deadline, cid
  }) => {
    const taskIdBN = new BN(taskId);
    const rewardBN = new BN(rewardPerResponse);
    const deadlineBN = new BN(deadline);

    const [taskAccountPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("task"), creator.toBuffer(), taskIdBN.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    return await program.methods
      .createTask(taskIdBN, rewardBN, maxResponses, deadlineBN, cid)
      .accountsPartial({ taskAccount: taskAccountPda, creator, systemProgram: SystemProgram.programId })
      .rpc();
  },
  onSuccess: () => toast.success('Task created successfully!'),
  onError: () => toast.error('Failed to create task'),
});
```

### 6. Provider Hierarchy

**App Providers (`src/components/AppProviders.tsx`):**
```tsx
export function AppProviders({ children }) {
  return (
    <ReactQueryProvider>
      <ClusterProvider>
        <SolanaProvider>
          {children}
          <Toaster />
        </SolanaProvider>
      </ClusterProvider>
    </ReactQueryProvider>
  )
}
```

### 7. UI Components

**Task Creation Form (`src/components/tasks/CreateTaskForm.tsx`):**
- Form for creating new tasks
- Integrates with smart contract hooks
- Real-time validation and feedback

**Tasks List (`src/components/tasks/TasksList.tsx`):**
- Displays all tasks from the blockchain
- Real-time updates via React Query
- Shows task status, rewards, and deadlines

### 8. Contract Test Page

**Demo Page (`src/app/contract-test/page.tsx`):**
- Interactive demo of smart contract functionality
- Side-by-side task creation and listing
- Wallet connection integration

### 9. Layout Updates

**BigInt Serialization Fix:**
```tsx
// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
```

## 🔑 Smart Contract Methods Implemented

Based on the IDL analysis, the following methods are available:

### Core Task Management
1. **create_task** - Create a new task with rewards
2. **submit_response** - Submit a response to a task
3. **verify_response** - Verify a submitted response
4. **mark_task_complete** - Mark task as completed
5. **cancel_task** - Cancel an existing task

### Financial Operations
6. **deposit_funds** - Deposit funds to reward vault
7. **disburse_rewards** - Distribute rewards to responders
8. **refund_remaining** - Refund unused funds

### Administrative
9. **process_undelegation** - Handle delegation processing

## 🏗️ Account Structure

### TaskAccount
- `task_id`: Unique identifier
- `creator`: Task creator's public key
- `reward_per_response`: Reward amount per response
- `max_responses`: Maximum number of responses
- `deadline`: Task deadline
- `responses_received`: Current response count
- `is_complete`: Completion status
- `cid`: Content identifier (IPFS/description)

### ResponseAccount
- `task_bump`: Task PDA bump
- `responder`: Responder's public key
- `timestamp`: Submission timestamp
- `is_verified`: Verification status
- `cid`: Response content identifier

### RewardVaultAccount
- `task_bump`: Task PDA bump
- `balance`: Current vault balance
- `bump`: Vault PDA bump

## 🚀 Usage Examples

### Creating a Task
```tsx
const { createTask } = useSmartContractsProgramAccount();

await createTask.mutateAsync({
  taskId: 1,
  rewardPerResponse: 1000000000, // 1 SOL in lamports
  maxResponses: 10,
  deadline: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  cid: "QmTaskDescription...",
});
```

### Submitting a Response
```tsx
const { submitResponse } = useSmartContractsProgramAccount();

await submitResponse.mutateAsync({
  taskId: 1,
  creator: creatorPublicKey,
  cid: "QmResponseData...",
});
```

### Querying Tasks
```tsx
const { getAllTasks } = useSmartContractsProgram();
const { data: tasks, isLoading } = getAllTasks;
```

## 🔧 Development Workflow

1. **Smart Contract Changes:**
   - Update Rust program
   - Regenerate IDL: `anchor build`
   - Update TypeScript types
   - Test integration with frontend

2. **Frontend Development:**
   - Use React Query DevTools for debugging
   - Monitor wallet adapter state changes
   - Test with different wallet providers

## 🎯 Key Differences from PixelMint

1. **Task-based vs NFT-based**: Focus on task management rather than NFT marketplace
2. **Multi-account types**: Tasks, Responses, and Reward Vaults vs single NFT listings
3. **Complex PDA derivation**: Multiple seed combinations for different account types
4. **Financial flow**: Reward distribution vs direct sales

## ✅ Testing

Visit `/contract-test` page to:
- Test wallet connection
- Create new tasks
- View all existing tasks
- Test smart contract interactions

This integration provides a robust foundation for the Nodara task management system with full blockchain integration.
