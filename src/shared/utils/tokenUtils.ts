/**
 * Utilidades para manejar tokens JWT con caché optimizado
 */

interface TokenCache {
  token: string;
  decoded: any;
  expirationTime: number;
  cachedAt: number;
}

let tokenCache: TokenCache | null = null;
const CACHE_TTL = 10000;

export const clearTokenCache = (): void => {
  tokenCache = null;
};

const decodeTokenCached = (token: string): any | null => {
  if (!token) return null;

  const now = Date.now();
  
  if (
    !tokenCache ||
    tokenCache.token !== token ||
    now - tokenCache.cachedAt > CACHE_TTL
  ) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        tokenCache = null;
        return null;
      }
      
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload));
      
      const expirationTime = decoded.exp ? decoded.exp * 1000 : 0;
      
      tokenCache = {
        token,
        decoded,
        expirationTime,
        cachedAt: now,
      };
    } catch (error) {
      tokenCache = null;
      console.error('Error al decodificar token:', error);
      return null;
    }
  }
  
  return tokenCache.decoded;
};

export const decodeToken = (token: string): any | null => {
  return decodeTokenCached(token);
};

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    const decoded = decodeTokenCached(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const expirationTime = tokenCache?.expirationTime || decoded.exp * 1000;
    const currentTime = Date.now();
    
    return currentTime >= (expirationTime - 60000);
  } catch (error) {
    console.error('Error al verificar expiración del token:', error);
    return true;
  }
};

export const getTokenTimeRemaining = (token: string): number => {
  if (!token) return 0;
  
  try {
    const decoded = decodeTokenCached(token);
    if (!decoded || !decoded.exp) {
      return 0;
    }
    
    const expirationTime = tokenCache?.expirationTime || decoded.exp * 1000;
    const currentTime = Date.now();
    const remaining = expirationTime - currentTime;
    
    return remaining > 0 ? remaining : 0;
  } catch (error) {
    return 0;
  }
};

export const getTokenExpiration = (token: string): number | null => {
  if (!token) return null;
  
  try {
    const decoded = decodeTokenCached(token);
    if (!decoded || !decoded.exp) {
      return null;
    }
    
    return tokenCache?.expirationTime || decoded.exp * 1000;
  } catch (error) {
    return null;
  }
};

