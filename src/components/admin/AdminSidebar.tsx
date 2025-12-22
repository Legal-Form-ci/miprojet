import { Link } from "react-router-dom";
import { 
  LayoutDashboard, Users, FolderKanban, DollarSign, Settings, 
  FileText, MessageSquare, BarChart3, Shield, Globe, Home
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "projects", label: "Projets", icon: FolderKanban },
  { id: "users", label: "Utilisateurs", icon: Users },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "analytics", label: "Analytiques", icon: BarChart3 },
  { id: "security", label: "Sécurité", icon: Shield },
  { id: "settings", label: "Paramètres", icon: Settings },
];

export const AdminSidebar = ({ isOpen, activeTab, onTabChange }: AdminSidebarProps) => {
  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border overflow-y-auto">
      <div className="p-4">
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
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <div className="bg-gradient-primary rounded-lg p-4 text-primary-foreground">
          <p className="font-semibold mb-1">Besoin d'aide ?</p>
          <p className="text-sm opacity-90 mb-3">Consultez la documentation</p>
          <Link 
            to="/guide" 
            className="inline-block bg-primary-foreground/20 hover:bg-primary-foreground/30 px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Documentation
          </Link>
        </div>
      </div>
    </aside>
  );
};
