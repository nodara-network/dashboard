"use client";

import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import { TasksList } from "@/components/tasks/TasksList";

export default function ContractTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smart Contract Integration Demo
          </h1>
          <p className="text-lg text-gray-600">
            Test the Nodara smart contract functionality
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <CreateTaskForm />
          </div>
          <div>
            <TasksList />
          </div>
        </div>
      </div>
    </div>
  );
}
