import { useEffect, useCallback } from 'react';
import 'kkiapay'; // Import to initialize the widget on window

// KKIAPAY Public API Key
const KKIAPAY_PUBLIC_KEY = '193bbb7e7387d1c3ac16ced9d47fe52fad2b228e';

interface KkiapayConfig {
  amount: number;
  reason?: string;
  name?: string;
  email?: string;
  phone?: string;
  data?: string;
}

interface KkiapaySuccessResponse {
  transactionId: string;
  data?: string | Record<string, any>;
  partnerId?: string;
  flwRef?: string;
}

interface UseKkiapayProps {
  onSuccess?: (data: KkiapaySuccessResponse) => void;
  onFailed?: (data: KkiapaySuccessResponse) => void;
  onClose?: () => void;
}

export const useKkiapay = ({ onSuccess, onFailed, onClose }: UseKkiapayProps = {}) => {
  useEffect(() => {
    // Wait for kkiapay to be available on window
    const setupListeners = () => {
      if (typeof window.addKkiapayListener === 'function') {
        // Set up success listener
        window.addKkiapayListener('success', (data: KkiapaySuccessResponse) => {
          console.log('KKIAPAY Success:', data);
          onSuccess?.(data);
        });

        // Set up failed listener
        window.addKkiapayListener('failed', (data: KkiapaySuccessResponse) => {
          console.log('KKIAPAY Failed:', data);
          onFailed?.(data);
        });

        // Set up close listener
        if (typeof window.addKkiapayCloseListener === 'function') {
          window.addKkiapayCloseListener(() => {
            console.log('KKIAPAY Widget Closed');
            onClose?.();
          });
        }
      } else {
        // Retry after a short delay if not ready
        setTimeout(setupListeners, 100);
      }
    };

    setupListeners();

    return () => {
      if (typeof window.removeKkiapayListener === 'function') {
        window.removeKkiapayListener('success');
        window.removeKkiapayListener('failed');
      }
    };
  }, [onSuccess, onFailed, onClose]);

  const openPayment = useCallback((config: KkiapayConfig) => {
    if (typeof window.openKkiapayWidget === 'function') {
      try {
        window.openKkiapayWidget({
          amount: config.amount,
          api_key: KKIAPAY_PUBLIC_KEY,
          sandbox: false, // Production mode
          theme: '#1a5f4a', // MIPROJET green
          name: config.name,
          email: config.email,
          phone: config.phone,
          reason: config.reason,
          data: config.data,
        });
      } catch (error) {
        console.error('KKIAPAY Widget error:', error);
      }
    } else {
      console.error('KKIAPAY Widget not available');
    }
  }, []);

  return { openPayment };
};
