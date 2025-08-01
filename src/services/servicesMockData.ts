export interface ServiceProvider {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  trustScore: number;
  hourlyRate: number;
  specializations: string[];
  description: string;
  isOnline: boolean;
  responseTime: string;
  completedTasks: number;
  totalEarnings: number;
  badges: string[];
  image: string;
}

export const mockServices: ServiceProvider[] = [
  {
    id: "sp-001",
    name: "TechNode Solutions",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 127,
    trustScore: 98,
    hourlyRate: 0.15,
    specializations: ["AI/ML", "Data Science", "Backend"],
    description: "Expert in machine learning model deployment and data pipeline optimization. Specialized in TensorFlow and PyTorch implementations.",
    isOnline: true,
    responseTime: "< 5 min",
    completedTasks: 89,
    totalEarnings: 12.4,
    badges: ["Verified", "Top Performer", "AI Expert"],
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "sp-002",
    name: "BlockchainDev Pro",
    location: "Austin, TX",
    rating: 4.8,
    reviews: 94,
    trustScore: 95,
    hourlyRate: 0.25,
    specializations: ["Blockchain", "Smart Contracts", "Web3"],
    description: "Blockchain development specialist with expertise in Solana, Ethereum, and DeFi protocols. Smart contract security audits.",
    isOnline: true,
    responseTime: "< 10 min",
    completedTasks: 156,
    totalEarnings: 28.7,
    badges: ["Verified", "Blockchain Expert", "Security Certified"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "sp-003",
    name: "CyberShield Labs",
    location: "Seattle, WA",
    rating: 4.7,
    reviews: 203,
    trustScore: 97,
    hourlyRate: 0.35,
    specializations: ["Cybersecurity", "Penetration Testing", "Security"],
    description: "Cybersecurity expert specializing in penetration testing, vulnerability assessments, and security architecture design.",
    isOnline: false,
    responseTime: "< 30 min",
    completedTasks: 234,
    totalEarnings: 45.2,
    badges: ["Verified", "Security Expert", "Certified Ethical Hacker"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "sp-004",
    name: "DataFlow Analytics",
    location: "New York, NY",
    rating: 4.6,
    reviews: 78,
    trustScore: 92,
    hourlyRate: 0.18,
    specializations: ["Data Science", "Analytics", "ML"],
    description: "Data science specialist focusing on predictive analytics, ETL pipeline optimization, and business intelligence solutions.",
    isOnline: true,
    responseTime: "< 15 min",
    completedTasks: 67,
    totalEarnings: 8.9,
    badges: ["Verified", "Data Expert", "Fast Responder"],
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "sp-005",
    name: "DesignCraft Studio",
    location: "Los Angeles, CA",
    rating: 4.9,
    reviews: 145,
    trustScore: 96,
    hourlyRate: 0.12,
    specializations: ["UI/UX", "Design", "Frontend"],
    description: "Creative UI/UX designer with expertise in mobile app design, web interfaces, and user experience optimization.",
    isOnline: true,
    responseTime: "< 20 min",
    completedTasks: 112,
    totalEarnings: 15.3,
    badges: ["Verified", "Design Expert", "Creative Pro"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "sp-006",
    name: "CloudScale Systems",
    location: "Chicago, IL",
    rating: 4.5,
    reviews: 89,
    trustScore: 90,
    hourlyRate: 0.22,
    specializations: ["Backend", "DevOps", "Cloud"],
    description: "Full-stack developer specializing in scalable backend systems, cloud architecture, and API development.",
    isOnline: false,
    responseTime: "< 45 min",
    completedTasks: 178,
    totalEarnings: 32.1,
    badges: ["Verified", "Backend Expert", "Cloud Certified"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "sp-007",
    name: "MobileFirst Dev",
    location: "Miami, FL",
    rating: 4.8,
    reviews: 156,
    trustScore: 94,
    hourlyRate: 0.20,
    specializations: ["Mobile", "iOS", "Android"],
    description: "Mobile app development expert with deep knowledge of React Native, Flutter, and native iOS/Android development.",
    isOnline: true,
    responseTime: "< 8 min",
    completedTasks: 203,
    totalEarnings: 38.5,
    badges: ["Verified", "Mobile Expert", "App Store Featured"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "sp-008",
    name: "Quantum Computing Lab",
    location: "Boston, MA",
    rating: 4.7,
    reviews: 67,
    trustScore: 93,
    hourlyRate: 0.45,
    specializations: ["Quantum Computing", "Research", "AI"],
    description: "Quantum computing researcher and developer specializing in quantum algorithms and quantum machine learning applications.",
    isOnline: false,
    responseTime: "< 60 min",
    completedTasks: 34,
    totalEarnings: 12.8,
    badges: ["Verified", "Quantum Expert", "PhD Researcher"],
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
  }
];

export const serviceStats = {
  totalProviders: 8,
  onlineProviders: 5,
  averageRating: 4.7,
  totalEarnings: 193.9,
  totalTasks: 1174,
  averageResponseTime: "< 20 min",
  categories: {
    "AI/ML": 3,
    "Blockchain": 1,
    "Cybersecurity": 1,
    "Data Science": 2,
    "Design": 1,
    "Backend": 2,
    "Mobile": 1,
    "Quantum": 1
  }
}; 