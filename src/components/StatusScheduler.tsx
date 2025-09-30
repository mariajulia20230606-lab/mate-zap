import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewStatusDialog } from "@/components/NewStatusDialog";
import { 
  Calendar,
  Clock,
  Image,
  Video,
  Repeat,
  Edit3,
  Trash2,
  PlayCircle,
  Pause,
  Play
} from "lucide-react";
import { toast } from "sonner";

export const StatusScheduler = () => {
  const [scheduledStatuses, setScheduledStatuses] = useState([
    {
      id: 1,
      title: "Prato do Dia - Segunda",
      content: "{Aberto|Já abrimos|Hoje tem} prato do dia: Feijoada! 🍲",
      time: "10:30",
      scheduleDate: "2025-10-01",
      repeatType: "weekly",
      days: ["Segunda"],
      type: "text",
      active: true,
      createdAt: "2025-09-29T10:00:00.000Z"
    },
    {
      id: 2,
      title: "Promoção Sexta",
      content: "Sextou! Leve 2 marmitas, pague 1! 🎉",
      time: "10:00",
      scheduleDate: "2025-10-03",
      repeatType: "weekly",
      days: ["Sexta"],
      type: "image",
      mediaUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      active: true,
      createdAt: "2025-09-28T10:00:00.000Z"
    },
  ]);

  const [historyStatuses, setHistoryStatuses] = useState([
    {
      id: 100,
      title: "Status Anterior",
      content: "Este já foi enviado",
      time: "12:00",
      scheduleDate: "2025-09-20",
      repeatType: "none",
      days: [],
      type: "text",
      active: false,
      sentAt: "2025-09-20T12:00:00.000Z",
      createdAt: "2025-09-19T10:00:00.000Z"
    }
  ]);

  const [editingStatus, setEditingStatus] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleCreateStatus = (status: any) => {
    if (editingStatus) {
      setScheduledStatuses(prev => 
        prev.map(s => s.id === status.id ? status : s)
      );
      setEditingStatus(null);
    } else {
      setScheduledStatuses(prev => [...prev, status]);
    }
  };

  const handleEditStatus = (status: any) => {
    setEditingStatus(status);
    setEditDialogOpen(true);
  };

  const handleDeleteStatus = (id: number) => {
    setScheduledStatuses(prev => prev.filter(s => s.id !== id));
    toast.success("Status excluído");
  };

  const handleToggleActive = (id: number) => {
    setScheduledStatuses(prev => 
      prev.map(s => s.id === id ? { ...s, active: !s.active } : s)
    );
    const status = scheduledStatuses.find(s => s.id === id);
    toast.success(status?.active ? "Status pausado" : "Status ativado");
  };

  const activeCount = scheduledStatuses.filter(s => s.active).length;
  const nextStatus = scheduledStatuses
    .filter(s => s.active)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Automação de Status WhatsApp</h3>
          <p className="text-sm text-muted-foreground">
            Agende status automáticos com imagem, vídeo ou texto
          </p>
        </div>
        <NewStatusDialog onCreateStatus={handleCreateStatus} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-whatsapp/10 to-whatsapp/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <PlayCircle className="h-8 w-8 text-whatsapp" />
              <div>
                <div className="text-2xl font-bold">{activeCount}</div>
                <div className="text-sm text-muted-foreground">Status Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-success/10 to-success/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-success" />
              <div>
                <div className="text-2xl font-bold">{nextStatus?.time || "--:--"}</div>
                <div className="text-sm text-muted-foreground">Próximo Envio</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Repeat className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">24h</div>
                <div className="text-sm text-muted-foreground">Duração Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para Agendados e Histórico */}
      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scheduled">Agendados</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-3">
          {scheduledStatuses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum status agendado</p>
              </CardContent>
            </Card>
          ) : (
            scheduledStatuses.map((status) => (
              <Card key={status.id} className={`transition-all ${status.active ? 'ring-2 ring-whatsapp/20' : 'opacity-60'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2 flex-wrap">
                        <h5 className="font-medium">{status.title}</h5>
                        <Badge variant={status.active ? "default" : "secondary"}>
                          {status.active ? "Ativo" : "Pausado"}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          {status.type === "image" ? <Image className="h-4 w-4" /> : 
                           status.type === "video" ? <Video className="h-4 w-4" /> : 
                           <Edit3 className="h-4 w-4" />}
                          <span className="capitalize">{status.type}</span>
                        </div>
                        {status.repeatType !== "none" && (
                          <Badge variant="outline" className="text-xs">
                            <Repeat className="h-3 w-3 mr-1" />
                            {status.repeatType === "daily" ? "Diário" : "Semanal"}
                          </Badge>
                        )}
                      </div>
                      
                      {status.mediaUrl && (
                        <div className="mb-3">
                          {status.type === "image" ? (
                            <img src={status.mediaUrl} alt="" className="h-32 w-auto object-cover rounded" />
                          ) : (
                            <video src={status.mediaUrl} className="h-32 w-auto rounded" controls />
                          )}
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground mb-3 break-words">
                        {status.content}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm flex-wrap gap-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{status.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(status.scheduleDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        {status.days.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Repeat className="h-4 w-4" />
                            <span>{status.days.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 flex-shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleActive(status.id)}
                      >
                        {status.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditStatus(status)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => handleDeleteStatus(status.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-3">
          {historyStatuses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum status no histórico</p>
              </CardContent>
            </Card>
          ) : (
            historyStatuses.map((status) => (
              <Card key={status.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2 flex-wrap">
                        <h5 className="font-medium">{status.title}</h5>
                        <Badge variant="secondary">Enviado</Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          {status.type === "image" ? <Image className="h-4 w-4" /> : 
                           status.type === "video" ? <Video className="h-4 w-4" /> : 
                           <Edit3 className="h-4 w-4" />}
                          <span className="capitalize">{status.type}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 break-words">
                        {status.content}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm flex-wrap gap-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Enviado em {new Date(status.sentAt!).toLocaleDateString('pt-BR')} às {status.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 flex-shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditStatus(status)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Templates Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Prato do Dia",
                template: "{Hoje tem|Prato especial|Cardápio}: {{prato}} 🍽️",
                category: "Diário"
              },
              {
                title: "Horário de Funcionamento", 
                template: "{Aberto|Funcionando|Atendendo} até {{horario}}h!",
                category: "Informativo"
              },
              {
                title: "Promoção",
                template: "{Oferta especial|Imperdível|Só hoje}: {{promocao}} 🎉",
                category: "Promocional"
              },
              {
                title: "Última Chamada",
                template: "Últimas {{quantidade}} marmitas! {Corre|Aproveita|Garante já}!",
                category: "Urgência"
              }
            ].map((template, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{template.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {template.template}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Usar Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de edição */}
      {editingStatus && (
        <NewStatusDialog 
          onCreateStatus={handleCreateStatus}
          editStatus={editingStatus}
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setEditingStatus(null);
          }}
        />
      )}
    </div>
  );
};