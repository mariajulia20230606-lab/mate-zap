import { MessageSquare, Bell, Settings, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import UserMenuButton from "@/components/UserMenuButton";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="flex items-center justify-between p-6 bg-card border-b">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-8 w-8 text-whatsapp" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-whatsapp to-restaurant bg-clip-text text-transparent">
            Conecta+
          </h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Automação WhatsApp Inteligente
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>
          <History className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Histórico</span>
        </Button>
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        <UserMenuButton />
      </div>
    </header>
  );
};