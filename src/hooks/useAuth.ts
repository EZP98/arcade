import { useState, useEffect } from 'react';

const AUTH_KEY = 'alf_backoffice_auth';
const AUTH_PASSWORD = import.meta.env.VITE_BACKOFFICE_PASSWORD || 'AdeleLoFeudo2024!';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => boolean;
  loginWithGoogle: (email: string) => void;
  logout: () => void;
}

export const useAuth = (): AuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Controlla se già autenticato
    const authToken = sessionStorage.getItem(AUTH_KEY);
    if (authToken === 'authenticated' || authToken?.startsWith('google:')) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    if (password === AUTH_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'authenticated');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const loginWithGoogle = (email: string): void => {
    sessionStorage.setItem(AUTH_KEY, `google:${email}`);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, loginWithGoogle, logout };
};

// Hook per rilevare dispositivo mobile
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /mobile|android|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent);
      const isTablet = /ipad|android(?!.*mobile)|tablet/.test(userAgent);
      const isSmallScreen = window.innerWidth < 1024;

      setIsMobile(isMobileDevice || isTablet || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};
