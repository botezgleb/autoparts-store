export const decodeJWT = (token) => {
  try {
    if (!token || typeof token !== 'string') {
      console.error('Invalid token provided to decodeJWT');
      return null;
    }
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }
    
    const base64Url = parts[1];
    
    const base64 = base64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    
    const jsonPayload = atob(paddedBase64);
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return currentTime >= decoded.exp;
};

export const getTokenData = (token) => {
  return decodeJWT(token);
};