import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  Radio, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  ArrowLeft,
  Eye,
  Users,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HistoryItem {
  id: string;
  type: "campaign" | "status";
  title: string;
  date: string;
  time: string;
  status: "completed" | "failed" | "partial";
  messagesSent: number;
  totalMessages: number;
  audience: string;
}

const History = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dados mockados de histórico
  const historyData: HistoryItem[] = [
    {
      id: "1",
      type: "campaign",
      title: "Prato do Dia - Clientes Quentes",
      date: "2025-10-01",
      time: "14:00",
      status: "completed",
      messagesSent: 850,
      totalMessages: 850,
      audience: "850 clientes"
    },
    {
      id: "2",
      type: "status",
      title: "Promoção Especial",
      date: "2025-10-01",
      time: "10:30",
      status: "completed",
      messagesSent: 1,
      totalMessages: 1,
      audience: "Todos os contatos"
    },
    {
      id: "3",
      type: "campaign",
      title: "Recuperação de Clientes Frios",
      date: "2025-09-30",
      time: "16:00",
      status: "partial",
      messagesSent: 350,
      totalMessages: 500,
      audience: "500 clientes"
    },
    {
      id: "4",
      type: "status",
      title: "Cardápio da Semana",
      date: "2025-09-29",
      time: "09:00",
      status: "completed",
      messagesSent: 1,
      totalMessages: 1,
      audience: "Todos os contatos"
    },
    {
      id: "5",
      type: "campaign",
      title: "Promoção Fim de Semana",
      date: "2025-09-28",
      time: "18:00",
      status: "failed",
      messagesSent: 0,
      totalMessages: 1200,
      audience: "1.2k clientes"
    }
  ];

  const filteredHistory = historyData.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const campaignHistory = filteredHistory.filter(item => item.type === "campaign");
  const statusHistory = filteredHistory.filter(item => item.type === "status");

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Concluído", variant: "default" as const, icon: CheckCircle },
      failed: { label: "Falhou", variant: "destructive" as const, icon: XCircle },
      partial: { label: "Parcial", variant: "secondary" as const, icon: Clock }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const handleDeleteMessages = (itemId: string, itemTitle: string) => {
    // TODO: Implementar a lógica de deletar mensagens via Edge Function
    // Por enquanto, apenas mostra um toast de sucesso
    toast.success(`Mensagens da campanha "${itemTitle}" foram removidas do histórico`);
  };

  const HistoryCard = ({ item }: { item: HistoryItem }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {item.type === "campaign" ? (
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            ) : (
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Radio className="h-5 w-5 text-secondary" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          </div>
          {getStatusBadge(item.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Audiência</p>
            <p className="text-lg font-semibold flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{item.audience}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
            <p className="text-lg font-semibold">{item.messagesSent}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
            <p className="text-lg font-semibold">
              {((item.messagesSent / item.totalMessages) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Apagar Mensagens
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá remover todas as mensagens enviadas desta {item.type === "campaign" ? "campanha" : "status"} do histórico.
                  {item.type === "campaign" && " As mensagens já enviadas no WhatsApp não serão deletadas."}
                  <br /><br />
                  <strong>Campanha: {item.title}</strong>
                  <br />
                  Mensagens enviadas: {item.messagesSent}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteMessages(item.id, item.title)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Apagar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Histórico de Envios</h1>
              <p className="text-muted-foreground">Visualize todas as campanhas e status enviados</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar no histórico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              Todos ({filteredHistory.length})
            </TabsTrigger>
            <TabsTrigger value="campaigns">
              Campanhas ({campaignHistory.length})
            </TabsTrigger>
            <TabsTrigger value="status">
              Status ({statusHistory.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {filteredHistory.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhum registro encontrado</p>
                </CardContent>
              </Card>
            ) : (
              filteredHistory.map(item => <HistoryCard key={item.id} item={item} />)
            )}
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4 mt-6">
            {campaignHistory.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhuma campanha encontrada</p>
                </CardContent>
              </Card>
            ) : (
              campaignHistory.map(item => <HistoryCard key={item.id} item={item} />)
            )}
          </TabsContent>

          <TabsContent value="status" className="space-y-4 mt-6">
            {statusHistory.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhum status encontrado</p>
                </CardContent>
              </Card>
            ) : (
              statusHistory.map(item => <HistoryCard key={item.id} item={item} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default History;
