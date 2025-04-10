export const PAYSTACK_CONFIG = {
  publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  currency: 'NGN',
  channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money']
};