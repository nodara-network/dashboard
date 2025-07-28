"use client";

import { useSmartContractsProgram } from "@/hooks/useSmartContracts";
import { WalletButton } from "@/components/solana/SolanaProvider";

export function TasksList() {
  const { getAllTasks } = useSmartContractsProgram();

  if (getAllTasks.isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  if (getAllTasks.isError) {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="text-red-600 mb-4">Failed to load tasks</div>
        <WalletButton />
      </div>
    );
  }

  const tasks = getAllTasks.data || [];

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Tasks ({tasks.length})</h2>
        <WalletButton />
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No tasks found. Create the first task!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task, index) => (
            <TaskCard key={task.publicKey.toString()} task={task} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, index }: { task: any; index: number }) {
  const account = task.account;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Task #{account.taskId.toString()}</h3>
          <p className="text-sm text-gray-600">
            Created by: {account.creator.toString().slice(0, 8)}...{account.creator.toString().slice(-8)}
          </p>
        </div>
        <div className="text-right">
          <div className={`px-2 py-1 rounded text-sm ${
            account.isComplete ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {account.isComplete ? 'Completed' : 'Active'}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Reward per response:</span>
          <p className="text-gray-600">{(account.rewardPerResponse.toNumber() / 1e9).toFixed(4)} SOL</p>
        </div>
        <div>
          <span className="font-medium">Max responses:</span>
          <p className="text-gray-600">{account.maxResponses}</p>
        </div>
        <div>
          <span className="font-medium">Responses received:</span>
          <p className="text-gray-600">{account.responsesReceived}</p>
        </div>
        <div>
          <span className="font-medium">Deadline:</span>
          <p className="text-gray-600">
            {new Date(account.deadline.toNumber() * 1000).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {account.cid && (
        <div className="mt-4">
          <span className="font-medium text-sm">Content ID:</span>
          <p className="text-xs text-gray-600 break-all">{account.cid}</p>
        </div>
      )}
    </div>
  );
}
