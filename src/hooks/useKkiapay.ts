import { useEffect, useCallback } from 'react';

// KKIAPAY Public API Key
const KKIAPAY_PUBLIC_KEY = '193bbb7e7387d1c3ac16ced9d47fe52fad2b228e';

declare global {
  interface Window {
    openKkiapayWidget: (config: KkiapayConfig) => void;
    addKkiapayListener: (event: 'success' | 'failed', callback: (data: any) => void) => void;
    removeKkiapayListener: (event: 'success' | 'failed') => void;
    addKkiapayCloseListener: (callback: () => void) => void;
  }
}

interface KkiapayConfig {
  amount: number;
  key: string;
  sandbox?: boolean;
  reason?: string;
  name?: string;
  email?: string;
  phone?: string;
  data?: string;
  theme?: string;
  callback?: string;
  countries?: string[];
  paymentMethods?: string[];
}

interface UseKkiapayProps {
  onSuccess?: (data: { transactionId: string }) => void;
  onFailed?: (data: any) => void;
  onClose?: () => void;
}

export const useKkiapay = ({ onSuccess, onFailed, onClose }: UseKkiapayProps = {}) => {
  useEffect(() => {
    // Load KKIAPAY script dynamically if not already loaded
    if (!document.querySelector('script[src="https://cdn.kkiapay.me/k.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.kkiapay.me/k.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Set up listeners
    const handleSuccess = (data: any) => {
      console.log('KKIAPAY Success:', data);
      onSuccess?.(data);
    };

    const handleFailed = (data: any) => {
      console.log('KKIAPAY Failed:', data);
      onFailed?.(data);
    };

    const handleClose = () => {
      console.log('KKIAPAY Widget Closed');
      onClose?.();
    };

    // Wait for script to load then set up listeners
    const checkAndSetupListeners = () => {
      if (window.addKkiapayListener) {
        window.addKkiapayListener('success', handleSuccess);
        window.addKkiapayListener('failed', handleFailed);
        if (window.addKkiapayCloseListener) {
          window.addKkiapayCloseListener(handleClose);
        }
      } else {
        setTimeout(checkAndSetupListeners, 100);
      }
    };

    checkAndSetupListeners();

    return () => {
      if (window.removeKkiapayListener) {
        window.removeKkiapayListener('success');
        window.removeKkiapayListener('failed');
      }
    };
  }, [onSuccess, onFailed, onClose]);

  const openPayment = useCallback((config: Omit<KkiapayConfig, 'key'>) => {
    if (window.openKkiapayWidget) {
      window.openKkiapayWidget({
        ...config,
        key: KKIAPAY_PUBLIC_KEY,
        sandbox: false, // Production mode
        theme: '#1a5f4a', // MIPROJET green
        countries: ['CI', 'SN', 'TG', 'BJ', 'BF', 'ML', 'NE', 'GN'],
        paymentMethods: ['momo', 'card', 'wave'],
      });
    } else {
      console.error('KKIAPAY Widget not loaded');
    }
  }, []);

  return { openPayment };
};
