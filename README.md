# Nodara Network Dashboard

> **A web dashboard for the Nodara Network protocol - AWS Lambda but powered by smartphones with crypto-native payments**

## What is Nodara Network?

Nodara Network is a revolutionary protocol that transforms smartphones into a distributed microservice network. Think of it as **AWS Lambda meets DePIN** - where phones earn yield by providing verifiable functions like location proofs, sensor data, RPC proxying, and compute tasks, all paid in SOL/SPL tokens.

### Core Innovation
- **Mobile Function Marketplace**: Rent small, verifiable functions from nearby or global phones
- **Trust-Minimized Execution**: Signature-backed proofs and optional TEEs for security
- **Crypto-Native Monetization**: Pay-per-use model with reputation-based pricing
- **Global Device Registry**: Decentralized network of smartphone nodes

## Dashboard Purpose

This web dashboard serves as the **control center** for the Nodara Network ecosystem, providing:

### For Service Requestors (dApps/Users)
- **Task Creation Interface**: Easy-to-use forms for requesting services
- **Real-time Monitoring**: Track task progress, responses, and payments
- **Device Discovery**: Find and filter available PhoneNodes by location, capabilities, and reputation
- **Analytics Dashboard**: View usage statistics, costs, and performance metrics

### For Node Providers
- **Earnings Dashboard**: Track SOL/SPL earnings and payment history
- **Reputation Management**: Monitor device scores, uptime, and task completion rates
- **Service Configuration**: Set availability, pricing, and service offerings
- **Performance Metrics**: View response times, success rates, and network stats

### For Protocol Administrators
- **Network Overview**: Global map of active nodes and network health
- **Protocol Analytics**: Transaction volumes, fee collection, and growth metrics
- **Device Registry Management**: Verify and manage registered devices
- **Trust Score Monitoring**: Oversee reputation system and dispute resolution

## Technical Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive, modern UI
- **State Management**: React Query + Zustand for efficient data handling
- **Wallet Integration**: Solana wallet adapters for seamless crypto payments
- **Real-time Updates**: WebSocket integration for live data feeds

### Backend Integration
- **Solana Programs**: Direct interaction with PhoneNode smart contracts
- **API Gateway**: REST/GraphQL endpoints for task management
- **Indexing**: Real-time blockchain data indexing via Helius/Triton
- **WebRTC Signaling**: Peer-to-peer communication setup

### Core Smart Contracts
- **DeviceRegistry**: Manages device capabilities and reputation
- **RelayPool**: Handles task matching and execution
- **PaymentRouter**: Automates reward distribution
- **TrustScoreKeeper**: Maintains reputation scoring system

## Key Features

### **Service Marketplace**
- Browse available services (location proofs, RPC relay, sensor data, etc.)
- Dynamic pricing based on demand and device reputation
- SLA enforcement and automatic payment settlement

### **Interactive Device Map**
- Real-time visualization of active nodes globally
- Filter by service type, location, and availability
- Network health indicators and regional statistics

### **Crypto Payments**
- Seamless SOL/SPL token payments via Solana Pay
- Transparent fee structure and instant settlements
- Multi-token support for various service types

### **Analytics & Insights**
- Task completion rates and response times
- Earnings tracking and yield optimization
- Network growth and adoption metrics

### **Security Dashboard**
- Signature verification status
- Trust score monitoring
- Dispute resolution interface

## How to Contribute

We welcome contributions from developers, designers, and blockchain enthusiasts! Here's how you can help:

### **Frontend Development**
- **UI/UX Design**: Create intuitive interfaces for complex DeFi interactions
- **React Components**: Build reusable components for service requests and device management
- **Mobile Responsiveness**: Ensure the dashboard works seamlessly on all devices
- **Accessibility**: Implement WCAG guidelines for inclusive design

### **Backend Integration**
- **Solana Integration**: Develop wallet connections and transaction handling
- **API Development**: Create efficient endpoints for task management
- **Real-time Features**: Implement WebSocket connections for live updates
- **Performance Optimization**: Optimize queries and data fetching

### **Security & Testing**
- **Smart Contract Integration**: Ensure secure interaction with Solana programs
- **Input Validation**: Implement robust form validation and sanitization
- **E2E Testing**: Create comprehensive test suites for critical user flows
- **Security Audits**: Review code for potential vulnerabilities

### **Data & Analytics**
- **Visualization**: Create compelling charts and graphs for network metrics
- **Data Processing**: Implement efficient data aggregation and filtering
- **Performance Monitoring**: Build dashboards for network health tracking
- **Reporting**: Generate insights for protocol optimization

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Solana CLI tools
- Basic understanding of React and TypeScript
- Familiarity with Solana/web3 development

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/nodara-network/dashboard.git

# Install dependencies
cd dashboard && yarn install

# Set up environment variables
cp .env.example .env.local

# Start development server
yarn dev
```

### Development Guidelines
- **Code Style**: Follow TypeScript best practices and ESLint rules
- **Component Structure**: Use atomic design principles
- **Testing**: Write unit tests for components and integration tests for flows
- **Documentation**: Document complex functions and components

## Community & Support

- **Discord**: Join our developer community for real-time discussions
- **GitHub Discussions**: Share ideas and ask questions
- **Documentation**: Comprehensive guides and API references
- **Office Hours**: Weekly community calls for contributors

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Links

- **Protocol Documentation**: [docs.nodara.network](https://docs.nodara.network)
- **Mobile SDK**: [github.com/nodara-network/mobile-sdk](https://github.com/nodara-network/mobile-sdk)
- **Smart Contracts**: [github.com/nodara-network/solana-contracts](https://github.com/nodara-network/solana-contracts)
- **API Gateway**: [github.com/nodara-network/api-gateway](https://github.com/nodara-network/api-gateway)

---

**Ready to help revolutionize mobile computing?** 

Check out our [Contributing Guide](CONTRIBUTING.md) and dive into the issues marked with `good-first-issue` to get started!