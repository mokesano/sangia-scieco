import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Solution', path: '/#solution' },
    { name: 'Service', path: '/#service' },
    { name: 'Network', path: '/#network' },
    { name: 'SDGs API', path: '/#sdgs-api' },
    { name: 'Scopus Tracker', path: '/#scopus-tracker' },
    { name: 'Features', path: '/#features' },
  ];

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 h-20 px-6 md:px-10 flex justify-between items-center ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-gray-200'
          : 'bg-white/85 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <Link to="/" className="text-2xl font-extrabold tracking-tight text-gray-900 flex items-center">
        CODE<span className="text-brand">Canau</span>
      </Link>

      <nav className="hidden md:flex gap-2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`text-gray-500 font-medium px-4 py-2 rounded-md transition-colors ${
              location.pathname === link.path ||
              (link.path.startsWith('/#') && location.pathname === '/')
                ? 'text-gray-900 bg-gray-100/50'
                : 'hover:text-gray-900 hover:bg-gray-100/50'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <a
        href="/docs"
        className="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-sm bg-gray-900 text-white hover:bg-brand-muted transition-all duration-300"
      >
        Documentation
      </a>
    </header>
  );
};

export default Navbar;