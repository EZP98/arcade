import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#sculture', label: 'Collezione' },
    { href: '#dipinti', label: 'Collezione' },
    { href: '#installazioni', label: 'Collezione' },
    { href: '#opere-miste', label: 'Collezione' },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[1000] p-6 w-full transition-all duration-300"
        style={{
          background: 'linear-gradient(rgba(19, 19, 19, 0.4) 0%, rgba(19, 19, 19, 0.15) 50.4505%, rgba(19, 19, 19, 0) 100%)'
        }}
      >
        <div className="flex justify-between items-center w-full">
          <Link
            to="/"
            className="text-sm font-bold no-underline font-sans uppercase text-center text-accent"
          >
            ALF
          </Link>

          {/* Desktop Menu Items */}
          {navItems.map((item, index) => (
            <a
              key={index}
              onClick={() => handleNavClick(item.href)}
              className="hidden md:block no-underline font-sans text-base font-bold uppercase text-center leading-8 relative cursor-pointer text-accent"
            >
              {item.label}
            </a>
          ))}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 w-8 h-6 justify-center items-center z-[1001]"
            aria-label="Toggle menu"
          >
            <span
              className={`w-full h-0.5 bg-accent transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-full h-0.5 bg-accent transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-full h-0.5 bg-accent transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-secondary z-[999] transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6 pt-24 px-8">
          {navItems.map((item, index) => (
            <a
              key={index}
              onClick={() => handleNavClick(item.href)}
              className="no-underline font-sans text-lg font-bold uppercase text-accent hover:opacity-70 transition-opacity cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-[998] md:hidden"
        />
      )}
    </>
  );
};

export default Navbar; 