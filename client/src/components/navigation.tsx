import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-gradient-to-br from-gray-900 via-gray-800 to-black backdrop-blur-2xl shadow-lg border-b border-gray-700/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer group" data-testid="link-home">
                <div className="w-10 h-10 bg-gradient-to-br from-bitcoin-500 to-bitcoin-600 rounded-xl flex items-center justify-center mr-3 group-hover:shadow-moderate transition-apple">
                  <i className="fab fa-bitcoin text-white text-lg"></i>
                </div>
                <span className="text-2xl font-light text-white group-hover:text-gray-200 transition-apple">BIP Explorer</span>
              </div>
            </Link>
            <div className="hidden lg:flex space-x-8">
              <Link href="/" data-testid="link-browse">
                <span className={`font-medium transition-apple cursor-pointer px-4 py-2 rounded-lg ${
                  isActive('/') 
                    ? 'text-bitcoin-400 bg-bitcoin-900/30' 
                    : 'text-gray-300 hover:text-bitcoin-400 hover:bg-white/10'
                }`}>
                  Browse
                </span>
              </Link>
              <Link href="/search" data-testid="link-search">
                <span className={`font-medium transition-apple cursor-pointer px-4 py-2 rounded-lg ${
                  isActive('/search') 
                    ? 'text-bitcoin-400 bg-bitcoin-900/30' 
                    : 'text-gray-300 hover:text-bitcoin-400 hover:bg-white/10'
                }`}>
                  Search
                </span>
              </Link>
              <Link href="/categories" data-testid="link-categories">
                <span className={`font-medium transition-apple cursor-pointer px-4 py-2 rounded-lg ${
                  isActive('/categories') || (typeof window !== 'undefined' && window.location.pathname.startsWith('/category/'))
                    ? 'text-bitcoin-400 bg-bitcoin-900/30' 
                    : 'text-gray-300 hover:text-bitcoin-400 hover:bg-white/10'
                }`}>
                  Categories
                </span>
              </Link>
              <Link href="/authors" data-testid="link-authors">
                <span className={`font-medium transition-apple cursor-pointer px-4 py-2 rounded-lg ${
                  isActive('/authors') 
                    ? 'text-bitcoin-400 bg-bitcoin-900/30' 
                    : 'text-gray-300 hover:text-bitcoin-400 hover:bg-white/10'
                }`}>
                  Authors
                </span>
              </Link>
              <Link href="/about" data-testid="link-about">
                <span className={`font-medium transition-apple cursor-pointer px-4 py-2 rounded-lg ${
                  isActive('/about') 
                    ? 'text-bitcoin-400 bg-bitcoin-900/30' 
                    : 'text-gray-300 hover:text-bitcoin-400 hover:bg-white/10'
                }`}>
                  About
                </span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-3 text-gray-300 hover:text-bitcoin-400 hover:bg-white/10 rounded-xl transition-apple"
              data-testid="button-theme-toggle"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-apple"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black backdrop-blur-2xl border-t border-gray-700/20">
          <div className="px-6 py-6 space-y-4">
            <Link href="/" data-testid="link-mobile-browse">
              <span 
                className="block text-gray-300 hover:text-bitcoin-400 hover:bg-white/10 px-4 py-3 rounded-xl transition-apple font-medium cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse
              </span>
            </Link>
            <Link href="/search" data-testid="link-mobile-search">
              <span 
                className="block text-gray-300 hover:text-bitcoin-400 hover:bg-white/10 px-4 py-3 rounded-xl transition-apple font-medium cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Search
              </span>
            </Link>
            <Link href="/authors" data-testid="link-mobile-authors">
              <span 
                className="block text-gray-300 hover:text-bitcoin-400 hover:bg-white/10 px-4 py-3 rounded-xl transition-apple font-medium cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Authors
              </span>
            </Link>
            <Link href="/about" data-testid="link-mobile-about">
              <span 
                className="block text-gray-300 hover:text-bitcoin-400 hover:bg-white/10 px-4 py-3 rounded-xl transition-apple font-medium cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
