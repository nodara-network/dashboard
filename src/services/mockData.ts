export interface MockTask {
  taskId: number;
  creator: string;
  rewardPerResponse: number;
  maxResponses: number;
  responsesReceived: number;
  deadline: number;
  cid: string;
  isComplete: boolean;
  title: string;
  description: string;
  category: string;
}

export const mockTasks: MockTask[] = [
  {
    taskId: 160967,
    creator: "8xK9mP2nQ7vR4tU1wX5yZ3aB6cD9eF2gH4iJ7kL1mN",
    rewardPerResponse: 0.2,
    maxResponses: 5,
    responsesReceived: 3,
    deadline: Math.floor(Date.now() / 1000) + (72 * 60 * 60), // 72 hours from now
    cid: "QmX7yZ9aB2cD5eF8gH1iJ4kL7mN0pQ3rS6tU9vW2xY5zA",
    isComplete: false,
    title: "AI Model Training Dataset Validation",
    description: "Validate and clean training dataset for GPT-4 fine-tuning",
    category: "AI/ML"
  },
  {
    taskId: 160968,
    creator: "9yL0nQ3oR8wS5vV2xY6zA4bC7dE0fG3hI8jK2lM0nO",
    rewardPerResponse: 0.15,
    maxResponses: 3,
    responsesReceived: 2,
    deadline: Math.floor(Date.now() / 1000) + (48 * 60 * 60), // 48 hours from now
    cid: "QmY8zA0bC3dE6fG9hI2jK5lM8nO1pQ4rS7tU0vW3xY6zB",
    isComplete: false,
    title: "Blockchain Smart Contract Audit",
    description: "Security audit for DeFi lending protocol smart contracts",
    category: "Blockchain"
  },
  {
    taskId: 160969,
    creator: "0zM1oP4pS9xT6wW3yZ7aB5cD8eF1gH4iJ7kL2mN1oP",
    rewardPerResponse: 0.3,
    maxResponses: 4,
    responsesReceived: 4,
    deadline: Math.floor(Date.now() / 1000) - (24 * 60 * 60), // 24 hours ago
    cid: "QmZ9aB1cD4eF7gH0iJ3kL6mN9oP2pQ5rS8tU1vW4xY7zC",
    isComplete: true,
    title: "Web3 Frontend Development",
    description: "Build responsive React frontend for NFT marketplace",
    category: "Web3"
  },
  {
    taskId: 160970,
    creator: "1aN2pQ5qT0yU7xV4zA8bC6dE9fG2hI5jJ8kL3mN2oQ",
    rewardPerResponse: 0.25,
    maxResponses: 6,
    responsesReceived: 1,
    deadline: Math.floor(Date.now() / 1000) + (96 * 60 * 60), // 96 hours from now
    cid: "QmN0bC2dE5fG8hI1jJ4kL7mN0oP3pQ6rS9tU2vW5xY8zD",
    isComplete: false,
    title: "Data Science Pipeline Optimization",
    description: "Optimize ETL pipeline for real-time analytics dashboard",
    category: "Data Science"
  },
  {
    taskId: 160971,
    creator: "2bO3qR6rU1zV8yW5aB9cC7dE0fG3hI6jJ9kL4mN3pR",
    rewardPerResponse: 0.18,
    maxResponses: 2,
    responsesReceived: 2,
    deadline: Math.floor(Date.now() / 1000) - (12 * 60 * 60), // 12 hours ago
    cid: "QmO1cD3eF6gH9iJ2kL5mN8oP1pQ4rS7tU0vW3xY6zE",
    isComplete: true,
    title: "Mobile App UI/UX Design",
    description: "Design modern UI for fitness tracking mobile app",
    category: "Design"
  },
  {
    taskId: 160972,
    creator: "3cP4rS7sV2aW9zX6bC0dD8eF1gH4iI7jJ0kL5mN4qS",
    rewardPerResponse: 0.35,
    maxResponses: 3,
    responsesReceived: 0,
    deadline: Math.floor(Date.now() / 1000) + (120 * 60 * 60), // 120 hours from now
    cid: "QmP2dE4fG7hI0jJ3kL6mN9oP2pQ5rS8tU1vW4xY7zF",
    isComplete: false,
    title: "Cybersecurity Penetration Testing",
    description: "Comprehensive security audit for enterprise SaaS platform",
    category: "Cybersecurity"
  },
  {
    taskId: 160973,
    creator: "4dQ5sT8tW3bX0aY7cD1eE9fF2gH5iI8jJ1kL6mN5rT",
    rewardPerResponse: 0.12,
    maxResponses: 4,
    responsesReceived: 4,
    deadline: Math.floor(Date.now() / 1000) - (6 * 60 * 60), // 6 hours ago
    cid: "QmQ3eF5gH8iJ1kL4mN7oP0pQ3rS6tU9vW2xY5zG",
    isComplete: true,
    title: "API Integration Development",
    description: "Integrate payment gateway APIs for e-commerce platform",
    category: "Backend"
  },
  {
    taskId: 160974,
    creator: "5eR6tU9uX4cY1bZ8dE2fF0gG3hH6iI9jJ2kL7mN6sU",
    rewardPerResponse: 0.22,
    maxResponses: 5,
    responsesReceived: 2,
    deadline: Math.floor(Date.now() / 1000) + (60 * 60 * 60), // 60 hours from now
    cid: "QmR4fG6hI9jJ2kL5mN8oP1pQ4rS7tU0vW3xY6zH",
    isComplete: false,
    title: "Machine Learning Model Deployment",
    description: "Deploy and monitor ML model for predictive analytics",
    category: "AI/ML"
  }
];

export const mockStats = {
  totalTasks: 8,
  activeTasks: 4,
  completedTasks: 4,
  totalRewards: 1.67,
  totalResponses: 18,
  averageReward: 0.21,
  categories: {
    "AI/ML": 2,
    "Blockchain": 1,
    "Web3": 1,
    "Data Science": 1,
    "Design": 1,
    "Cybersecurity": 1,
    "Backend": 1
  }
};

export const mockResponses = [
  {
    id: 1,
    taskId: 160967,
    responder: "7fS7uV0vY5dZ2cA9eF3gG1hH4iI7jJ0kL3mN8sV",
    cid: "QmS5gH7iJ0kL3mN6oP9pQ2rS5tU8vW1xY4zI",
    submittedAt: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
    status: "pending"
  },
  {
    id: 2,
    taskId: 160967,
    responder: "8gT8vW1wZ6eA3dF0fG4hH2iI5jJ8kL1mN4tW",
    cid: "QmT6hI8jJ1kL4mN7oP0pQ3rS6tU9vW2xY5zJ",
    submittedAt: Date.now() - (4 * 60 * 60 * 1000), // 4 hours ago
    status: "approved"
  },
  {
    id: 3,
    taskId: 160968,
    responder: "9hU9wX2xA7fB4eG1gH5iI3jJ6kK9lL2mN5uX",
    cid: "QmU7iJ9kL2mN5oP8pQ1rS4tU7vW0xY3zK",
    submittedAt: Date.now() - (1 * 60 * 60 * 1000), // 1 hour ago
    status: "pending"
  }
]; 