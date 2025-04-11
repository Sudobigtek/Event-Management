import Web3 from 'web3';

interface PaymentMetadata {
  eventId: string;
  userId: string;
  quantity: number;
  email: string;
}

export const paymentService = {
  // Paystack Payment Integration
  async initializePaystackPayment(amount: number, metadata: PaymentMetadata) {
    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: metadata.email,
          amount: amount * 100, // Convert to kobo
          metadata: {
            ...metadata,
            paymentType: 'fiat'
          },
          callback_url: `${window.location.origin}/payment/verify`
        }),
      });

      const data = await response.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      return data.data.authorization_url;
    } catch (error) {
      console.error('Paystack payment initialization failed:', error);
      throw error;
    }
  },

  async verifyPaystackPayment(reference: string) {
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`,
        },
      });

      const data = await response.json();
      return {
        success: data.status && data.data.status === 'success',
        data: data.data
      };
    } catch (error) {
      console.error('Paystack payment verification failed:', error);
      throw error;
    }
  },

  // Crypto Payment Integration
  async initializeCryptoPayment(amount: number, metadata: PaymentMetadata) {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const accounts = await web3.eth.getAccounts();
      const recipientAddress = import.meta.env.VITE_CRYPTO_WALLET_ADDRESS;

      // Convert amount to wei (assuming amount is in ETH)
      const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

      // Create transaction
      const transaction = {
        from: accounts[0],
        to: recipientAddress,
        value: amountInWei,
        gas: '21000',
        data: web3.utils.asciiToHex(JSON.stringify({
          ...metadata,
          paymentType: 'crypto'
        }))
      };

      // Send transaction
      const txHash = await web3.eth.sendTransaction(transaction);
      return txHash;
    } catch (error) {
      console.error('Crypto payment failed:', error);
      throw error;
    }
  },

  async verifyCryptoPayment(txHash: string) {
    try {
      const web3 = new Web3(window.ethereum);
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      return {
        success: receipt && receipt.status,
        data: receipt
      };
    } catch (error) {
      console.error('Crypto payment verification failed:', error);
      throw error;
    }
  }
};