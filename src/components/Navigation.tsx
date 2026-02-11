import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logo from "@/assets/logo-miprojet-new.png";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = () => {
    const email = user?.email || '';
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt="MIPROJET logo" 
              className="h-10 w-auto max-w-[120px] object-contain rounded-lg" 
            />
            <span className="font-bold text-xl text-foreground hidden sm:inline">MIPROJET</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors text-sm">
              {t('nav.home')}
            </Link>
            <Link to="/projects" className="text-foreground hover:text-primary transition-colors text-sm">
              {t('nav.projects')}
            </Link>
            <Link to="/services" className="text-foreground hover:text-primary transition-colors text-sm">
              {t('nav.services')}
            </Link>
            <Link to="/how-it-works" className="text-foreground hover:text-primary transition-colors text-sm">
              {t('nav.howItWorks')}
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors text-sm">
              {t('nav.about')}
            </Link>
            <Link to="/opportunities" className="text-primary font-medium hover:text-primary/80 transition-colors text-sm">
              Opportunités
            </Link>
            <Link to="/subscription" className="text-accent font-medium hover:text-accent/80 transition-colors text-sm flex items-center gap-1">
              <span className="text-xs">👑</span> Espace Membre
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors text-sm">
              {t('nav.contact')}
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            <LanguageSelector />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {isAdmin ? 'Administrateur' : 'Membre'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t('nav.dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        {t('nav.admin')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm">{t('nav.login')}</Button>
              </Link>
            )}
            
            <Link to="/submit-project">
              <Button variant="default" size="sm">{t('nav.submitProject')}</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSelector />
            <button
              className="text-foreground p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-3 border-t border-border">
            <Link
              to="/"
              className="block text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/projects"
              className="block text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.projects')}
            </Link>
            <Link
              to="/services"
              className="block text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.services')}
            </Link>
            <Link
              to="/how-it-works"
              className="block text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.howItWorks')}
            </Link>
            <Link
              to="/about"
              className="block text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.about')}
            </Link>
            <Link
              to="/opportunities"
              className="block text-primary font-medium hover:text-primary/80 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              🎯 Opportunités
            </Link>
            <Link
              to="/subscription"
              className="block text-accent font-medium hover:text-accent/80 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              👑 Espace Membre
            </Link>
            <Link
              to="/contact"
              className="block text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.contact')}
            </Link>
            
            <div className="space-y-2 pt-4 border-t border-border">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t('nav.dashboard')}
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        {t('nav.admin')}
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">{t('nav.login')}</Button>
                </Link>
              )}
              <Link to="/submit-project" onClick={() => setIsMenuOpen(false)}>
                <Button variant="default" className="w-full">{t('nav.submitProject')}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
