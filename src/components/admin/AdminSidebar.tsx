import { Link } from "react-router-dom";
import { 
  LayoutDashboard, Users, FolderKanban, Settings, 
  FileText, BarChart3, Shield, Home, Newspaper,
  Receipt, CreditCard, HelpCircle, BookOpen, Crown, Briefcase
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminSidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "projects", label: "Projets", icon: FolderKanban },
  { id: "users", label: "Utilisateurs", icon: Users },
  { id: "requests", label: "Demandes de services", icon: FileText },
  { id: "evaluations", label: "Évaluations", icon: BarChart3 },
  { id: "opportunities", label: "Opportunités", icon: Briefcase },
  { id: "subscriptions", label: "Abonnements", icon: Crown },
  { id: "referrals", label: "Parrainages", icon: Users },
  { id: "news", label: "Actualités", icon: Newspaper },
  { id: "invoices", label: "Factures", icon: Receipt },
  { id: "payments", label: "Paiements", icon: CreditCard },
  { id: "database", label: "Base de données", icon: Shield },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "settings", label: "Paramètres", icon: Settings },
];

export const AdminSidebar = ({ isOpen, activeTab, onTabChange }: AdminSidebarProps) => {
  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mb-4"
        >
          <Home className="h-5 w-5" />
          <span>Retour au site</span>
        </Link>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>
      
      {/* Guide Admin - Positionné en bas mais ne cache pas le menu */}
      <div className="p-4 border-t border-border bg-card">
        <button
          onClick={() => onTabChange('admin-guide')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            activeTab === 'admin-guide'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="font-medium text-sm">Guide Admin</span>
        </button>
      </div>
    </aside>
  );
};
