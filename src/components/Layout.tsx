import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Award, Menu, Settings, X, Home, Calendar, Video, Code } from 'lucide-react';
import { useState } from 'react';
import { StackedCircularFooter } from '@/components/ui/stacked-circular-footer';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background grid pattern */}
      <AnimatedGridPattern 
        numSquares={40}
        maxOpacity={0.05}
        duration={5}
        repeatDelay={0.8}
        className="fixed inset-0 z-0"
      />
      
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/70 border-b border-border shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="font-semibold text-lg">
              TRACK-IT
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 justify-center">
            <Link to="/">
              <Button variant={location.pathname === '/' ? 'default' : 'ghost'} className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/contests">
              <Button variant={location.pathname === '/contests' ? 'default' : 'ghost'} className="gap-2">
                <Calendar className="h-4 w-4" />
                Contests
              </Button>
            </Link>
            <Link to="/new-hackathons">
              <Button variant={location.pathname === '/new-hackathons' ? 'default' : 'ghost'} className="gap-2">
                <Code className="h-4 w-4" />
                Hackathons
              </Button>
            </Link>
            <Link to="/videos">
              <Button variant={location.pathname === '/videos' ? 'default' : 'ghost'} className="gap-2">
                <Video className="h-4 w-4" />
                Videos
              </Button>
            </Link>
          </nav>
          
          <div className="flex items-center justify-end">
            <ThemeToggle />
            <div className="block md:hidden ml-2">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="container py-3 flex flex-col space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={location.pathname === '/' ? 'default' : 'ghost'} 
                  className="w-full justify-start gap-2"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link to="/contests" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={location.pathname === '/contests' ? 'default' : 'ghost'} 
                  className="w-full justify-start gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Contests
                </Button>
              </Link>
              <Link to="/new-hackathons" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={location.pathname === '/new-hackathons' ? 'default' : 'ghost'} 
                  className="w-full justify-start gap-2"
                >
                  <Code className="h-4 w-4" />
                  Hackathons
                </Button>
              </Link>
              <Link to="/videos" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={location.pathname === '/videos' ? 'default' : 'ghost'} 
                  className="w-full justify-start gap-2"
                >
                  <Video className="h-4 w-4" />
                  Videos
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1 container py-6 md:py-8 relative z-10">
        {children}
      </main>
      
      <StackedCircularFooter />
    </div>
  );
}
