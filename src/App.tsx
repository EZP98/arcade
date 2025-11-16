import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import pages
import Collezione from './pages/Collezione';
import Content from './pages/Content';
import OperaForm from './pages/OperaForm';

// Import components
import Navbar from './components/Navbar';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/content');

  useEffect(() => {
    // GSAP initial setup
    gsap.set('body', { opacity: 1 });

    // Smooth scroll setup
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-primary font-sans leading-relaxed overflow-x-hidden">
      {showNavbar && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Collezione />} />
          <Route path="/collezione" element={<Collezione />} />
          <Route path="/content" element={<Content />} />
          <Route path="/content/opera" element={<OperaForm />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

export default App;
