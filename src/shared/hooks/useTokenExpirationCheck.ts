import { useEffect, useRef } from 'react';
import { isTokenExpired } from '@/shared/utils/tokenUtils';

interface UseTokenExpirationCheckOptions {
  checkInterval?: number;
  checkImmediately?: boolean;
  onExpired?: () => void;
}

export function useTokenExpirationCheck({
  checkInterval = 60000,
  checkImmediately = true,
  onExpired,
}: UseTokenExpirationCheckOptions = {}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onExpiredRef = useRef(onExpired);

  useEffect(() => {
    onExpiredRef.current = onExpired;
  }, [onExpired]);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token && isTokenExpired(token)) {
        if (onExpiredRef.current) {
          onExpiredRef.current();
        }
      }
    };

    if (checkImmediately) {
      checkToken();
    }

    intervalRef.current = setInterval(checkToken, checkInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkInterval, checkImmediately]);
}

