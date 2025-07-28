"use client";

import { useSmartContractsProgramAccount } from "@/hooks/useSmartContracts";
import { useState } from "react";

export function CreateTaskForm() {
  const [taskId, setTaskId] = useState("");
  const [rewardPerResponse, setRewardPerResponse] = useState("");
  const [maxResponses, setMaxResponses] = useState("");
  const [deadline, setDeadline] = useState("");
  const [cid, setCid] = useState("");

  const { createTask } = useSmartContractsProgramAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskId || !rewardPerResponse || !maxResponses || !deadline || !cid) {
      alert("Please fill all fields");
      return;
    }

    try {
      await createTask.mutateAsync({
        taskId: parseInt(taskId),
        rewardPerResponse: parseInt(rewardPerResponse),
        maxResponses: parseInt(maxResponses),
        deadline: Math.floor(new Date(deadline).getTime() / 1000),
        cid: cid,
      });
      
      // Reset form
      setTaskId("");
      setRewardPerResponse("");
      setMaxResponses("");
      setDeadline("");
      setCid("");
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task ID
          </label>
          <input
            type="number"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter unique task ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reward Per Response (lamports)
          </label>
          <input
            type="number"
            value={rewardPerResponse}
            onChange={(e) => setRewardPerResponse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 1000000000 (1 SOL)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Responses
          </label>
          <input
            type="number"
            value={maxResponses}
            onChange={(e) => setMaxResponses(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deadline
          </label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content ID (CID)
          </label>
          <input
            type="text"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="IPFS CID or task description"
          />
        </div>

        <button
          type="submit"
          disabled={createTask.isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {createTask.isPending ? "Creating Task..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}
