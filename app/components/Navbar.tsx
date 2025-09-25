'use client';

import Link from 'next/link';

export default function Navbar() {
  const handleMouseOver = (e: React.MouseEvent<HTMLAnchorElement>) => {
    (e.target as HTMLElement).style.background = 'rgba(209, 167, 92, 0.3)';
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    (e.target as HTMLElement).style.background = 'transparent';
  };

  return (
    <nav className="navbar">
      <Link 
        href="/" 
        className="nav-link"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        🏠 Início
      </Link>
      <Link 
        href="/sobre" 
        className="nav-link"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        📖 Sobre o Jogo
      </Link>
      <Link 
        href="/game-mode" 
        className="nav-link"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        🎮 Modo de Jogo
      </Link>
    </nav>
  );
}