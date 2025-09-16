import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricsCard } from "@/components/MetricsCard";
import { CampaignCard } from "@/components/CampaignCard";
import { TemplateBuilder } from "@/components/TemplateBuilder";
import { StatusScheduler } from "@/components/StatusScheduler";
import { 
  MessageSquare, 
  Users, 
  Send, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Calendar,
  Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const campaigns = [
    {
      title: "Prato do Dia - Clientes Quentes",
      status: "active" as const,
      audience: "850 clientes",
      nextSend: "14:00 hoje",
      messagesSent: 234,
      totalMessages: 850,
      template: "{Oi|Fala} {{nome}}, hoje tem feijoada completa!"
    },
    {
      title: "Promoção Fim de Semana",
      status: "scheduled" as const,
      audience: "1.2k clientes",
      nextSend: "Sex 18:00",
      messagesSent: 0,
      totalMessages: 1200,
      template: "{{nome}}, que tal um almoço especial no fim de semana?"
    },
    {
      title: "Recuperação de Clientes Frios",
      status: "paused" as const,
      audience: "500 clientes",
      messagesSent: 150,
      totalMessages: 500,
      template: "Sentimos sua falta, {{nome}}! Volta logo 😊"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="p-6 space-y-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Mensagens Enviadas Hoje"
            value="1,234"
            description="De 4.200 clientes"
            icon={Send}
            trend="+12%"
          />
          <MetricsCard
            title="Taxa de Resposta"
            value="28%"
            description="Últimos 7 dias"
            icon={MessageSquare}
            trend="+5%"
          />
          <MetricsCard
            title="Clientes Ativos"
            value="3,854"
            description="Responderam recentemente"
            icon={Users}
            trend="+8%"
          />
          <MetricsCard
            title="Campanhas Ativas"
            value="3"
            description="2 agendadas"
            icon={TrendingUp}
          />
        </div>

        {/* Tabs Principal */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="status">Status WhatsApp</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status do Sistema */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Status do Sistema</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-whatsapp rounded-full animate-pulse"></div>
                    <span className="text-sm text-whatsapp font-medium">WhatsApp Conectado</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <MetricsCard
                    title="Próximo Envio"
                    value="14:00"
                    description="Prato do dia"
                    icon={Clock}
                    className="bg-success"
                  />
                  <MetricsCard
                    title="Fila de Envio"
                    value="234"
                    description="Mensagens pendentes"
                    icon={AlertTriangle}
                    className="bg-warning"
                  />
                </div>
              </div>

              {/* Atividade Recente */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Atividade Recente</h2>
                <div className="space-y-3">
                  {[
                    { time: "13:45", action: "Enviado para 234 clientes", type: "Prato do dia" },
                    { time: "12:30", action: "Nova campanha criada", type: "Promoção weekend" },
                    { time: "11:15", action: "125 respostas recebidas", type: "Engajamento" },
                    { time: "10:00", action: "Sistema iniciado", type: "Status" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-card rounded-lg border">
                      <div className="text-xs text-muted-foreground w-12">{activity.time}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">{activity.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Campanhas Ativas</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Campanha
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {campaigns.map((campaign, index) => (
                <CampaignCard key={index} {...campaign} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Editor de Templates</h2>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Teste
              </Button>
            </div>
            
            <TemplateBuilder />
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <StatusScheduler />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Gestão de Contatos</h2>
              <div className="flex space-x-2">
                <Button variant="outline">Importar CSV</Button>
                <Button>Segmentar Clientes</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <MetricsCard
                title="Total de Contatos"
                value="4,200"
                description="Base completa"
                icon={Users}
                className="bg-gradient-to-br from-primary/10 to-primary/5"
              />
              <MetricsCard
                title="Clientes Quentes"
                value="1,850"
                description="Ativos últimos 15 dias"
                icon={TrendingUp}
                className="bg-gradient-to-br from-whatsapp/10 to-whatsapp/5"
              />
              <MetricsCard
                title="Blacklist"
                value="47"
                description="Contatos bloqueados"
                icon={AlertTriangle}
                className="bg-gradient-to-br from-destructive/10 to-destructive/5"
              />
            </div>

            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Segmentação Inteligente</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Gosta de Frango", count: "892", color: "bg-secondary" },
                  { label: "Pedidos Frequentes", count: "654", color: "bg-success" },
                  { label: "Novos Clientes", count: "234", color: "bg-warning" },
                  { label: "Fim de Semana", count: "1.2k", color: "bg-primary/20" },
                  { label: "Promocionais", count: "987", color: "bg-whatsapp/20" },
                  { label: "VIPs", count: "156", color: "bg-restaurant/20" }
                ].map((segment, index) => (
                  <div key={index} className={`p-4 rounded-lg ${segment.color}`}>
                    <div className="font-semibold">{segment.label}</div>
                    <div className="text-2xl font-bold">{segment.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
