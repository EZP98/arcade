import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth, useIsMobile } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  // Se non autenticato, redirect al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se è mobile/tablet, mostra schermata di blocco
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-secondary p-8 rounded-xl border" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            {/* Icon */}
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Titolo */}
            <h1
              className="text-3xl font-bold text-white uppercase mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Accesso Limitato
            </h1>

            {/* Messaggio */}
            <p className="text-white/80 mb-6">
              Il backoffice è accessibile <span className="text-pink-500 font-bold">solo da desktop</span>.
            </p>

            <p className="text-white/60 text-sm">
              Per accedere all'area di amministrazione, utilizza un computer desktop o laptop.
            </p>

            {/* Info device */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <p className="text-white/40 text-xs">
                Dispositivo rilevato: <span className="text-pink-400">Mobile/Tablet</span>
              </p>
            </div>

            {/* Link home */}
            <a
              href="/"
              className="mt-6 inline-block px-6 py-3 font-bold uppercase text-white border hover:bg-white/5 transition-colors"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                fontFamily: 'Montserrat, sans-serif',
                borderRadius: 0
              }}
            >
              Torna alla Home
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // Autenticato e desktop: mostra il contenuto
  return <>{children}</>;
};

export default ProtectedRoute;
