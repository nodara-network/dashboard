// Wallet-specific API calls for Nodara Network Dashboard
import { apiClient, apiUtils } from './api';
import {
  WalletBalance,
  WalletTransaction,
  PaymentRequest,
  SwapRequest,
  WalletStats,
  SupportedToken,
  TokenPrice,
  FeeEstimate,
  AddressValidation,
  WalletActivity,
  WalletContact,
  WalletPreferences,
  TransactionReceipt,
  ExportData,
  TransactionHistory,
  TransactionResponse,
  SwapResponse,
  TransactionType,
  TransactionStatus,
  TransactionAction,
  ExportFormat,
} from '../types/wallet';

class WalletService {
  // Get wallet balance
  async getBalance(walletAddress: string): Promise<WalletBalance> {
    const response = await apiClient.get<WalletBalance>(`/wallet/${walletAddress}/balance`);
    return apiUtils.handleResponse(response);
  }

  // Get transaction history
  async getTransactions(
    walletAddress: string,
    params?: {
      limit?: number;
      offset?: number;
      type?: TransactionType;
      status?: TransactionStatus;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<TransactionHistory> {
    const queryParams = params ? apiUtils.createQueryString(params) : '';
    const response = await apiClient.get<TransactionHistory>(
      `/wallet/${walletAddress}/transactions${queryParams ? `?${queryParams}` : ''}`
    );
    return apiUtils.handleResponse(response);
  }

  // Send payment
  async sendPayment(
    walletAddress: string,
    paymentRequest: PaymentRequest
  ): Promise<TransactionResponse> {
    const response = await apiClient.post<TransactionResponse>(
      `/wallet/${walletAddress}/send`,
      paymentRequest
    );
    return apiUtils.handleResponse(response);
  }

  // Swap tokens
  async swapTokens(
    walletAddress: string,
    swapRequest: SwapRequest
  ): Promise<SwapResponse> {
    const response = await apiClient.post<SwapResponse>(
      `/wallet/${walletAddress}/swap`,
      swapRequest
    );
    return apiUtils.handleResponse(response);
  }

  // Get transaction status
  async getTransactionStatus(transactionId: string): Promise<WalletTransaction> {
    const response = await apiClient.get<WalletTransaction>(`/transactions/${transactionId}`);
    return apiUtils.handleResponse(response);
  }

  // Get wallet statistics
  async getWalletStats(walletAddress: string): Promise<WalletStats> {
    const response = await apiClient.get<WalletStats>(`/wallet/${walletAddress}/stats`);
    return apiUtils.handleResponse(response);
  }

  // Get supported tokens
  async getSupportedTokens(): Promise<SupportedToken[]> {
    const response = await apiClient.get<SupportedToken[]>('/wallet/supported-tokens');
    return apiUtils.handleResponse(response);
  }

  // Get token price
  async getTokenPrice(token: string): Promise<TokenPrice> {
    const response = await apiClient.get<TokenPrice>(`/wallet/token-price/${token}`);
    return apiUtils.handleResponse(response);
  }

  // Estimate transaction fee
  async estimateFee(
    walletAddress: string,
    transactionType: TransactionAction,
    amount: number,
    token: string
  ): Promise<FeeEstimate> {
    const response = await apiClient.post<FeeEstimate>(
      `/wallet/${walletAddress}/estimate-fee`,
      { type: transactionType, amount, token }
    );
    return apiUtils.handleResponse(response);
  }

  // Validate address
  async validateAddress(address: string): Promise<AddressValidation> {
    const response = await apiClient.get<AddressValidation>(`/wallet/validate-address/${address}`);
    return apiUtils.handleResponse(response);
  }

  // Get wallet activity
  async getWalletActivity(
    walletAddress: string,
    days: number = 30
  ): Promise<WalletActivity[]> {
    const response = await apiClient.get<WalletActivity[]>(`/wallet/${walletAddress}/activity?days=${days}`);
    return apiUtils.handleResponse(response);
  }

  // Get recent contacts
  async getRecentContacts(walletAddress: string): Promise<WalletContact[]> {
    const response = await apiClient.get<WalletContact[]>(`/wallet/${walletAddress}/contacts`);
    return apiUtils.handleResponse(response);
  }

  // Add contact
  async addContact(
    walletAddress: string,
    contact: { address: string; name: string }
  ): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(
      `/wallet/${walletAddress}/contacts`,
      contact
    );
    return apiUtils.handleResponse(response);
  }

  // Remove contact
  async removeContact(walletAddress: string, contactAddress: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(
      `/wallet/${walletAddress}/contacts/${contactAddress}`
    );
    return apiUtils.handleResponse(response);
  }

  // Get wallet preferences
  async getWalletPreferences(walletAddress: string): Promise<WalletPreferences> {
    const response = await apiClient.get<WalletPreferences>(`/wallet/${walletAddress}/preferences`);
    return apiUtils.handleResponse(response);
  }

  // Update wallet preferences
  async updateWalletPreferences(
    walletAddress: string,
    preferences: Partial<WalletPreferences>
  ): Promise<{ success: boolean }> {
    const response = await apiClient.patch<{ success: boolean }>(
      `/wallet/${walletAddress}/preferences`,
      preferences
    );
    return apiUtils.handleResponse(response);
  }

  // Get transaction receipt
  async getTransactionReceipt(transactionId: string): Promise<TransactionReceipt> {
    const response = await apiClient.get<TransactionReceipt>(`/transactions/${transactionId}/receipt`);
    return apiUtils.handleResponse(response);
  }

  // Export transaction history
  async exportTransactions(
    walletAddress: string,
    format: ExportFormat,
    dateRange?: { start: Date; end: Date }
  ): Promise<ExportData> {
    const response = await apiClient.post<ExportData>(
      `/wallet/${walletAddress}/export`,
      { format, dateRange }
    );
    return apiUtils.handleResponse(response);
  }
}

// Create singleton instance
export const walletService = new WalletService();

