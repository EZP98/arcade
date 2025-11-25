import React, { createContext, useContext, useEffect, useState } from 'react';

interface LoadingContextType {
  hasShownLoading: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mostra sempre il loading all'avvio
  const [hasShownLoading, setHasShownLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      // Dopo 3 secondi, nascondi il loading
      const timer = setTimeout(() => {
        setIsLoading(false);
        setHasShownLoading(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ hasShownLoading, isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};