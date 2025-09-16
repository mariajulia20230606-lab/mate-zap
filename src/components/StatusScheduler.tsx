import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  Image,
  Video,
  Repeat,
  Plus,
  Edit3,
  Trash2,
  PlayCircle
} from "lucide-react";

export const StatusScheduler = () => {
  const [scheduledStatuses, setScheduledStatuses] = useState([
    {
      id: 1,
      title: "Prato do Dia - Segunda",
      content: "{Aberto|Já abrimos|Hoje tem} prato do dia: Feijoada! 🍲",
      time: "10:30",
      days: ["Segunda"],
      type: "text",
      active: true
    },
    {
      id: 2,
      title: "Promoção Sexta",
      content: "Sextou! Leve 2 marmitas, pague 1! 🎉",
      time: "10:00",
      days: ["Sexta"],
      type: "image",
      active: true
    },
    {
      id: 3,
      title: "Última Chamada",
      content: "Últimas {{quantidade}} marmitas! Fecha às {{horario}}.",
      time: "13:00",
      days: ["Sábado", "Domingo"],
      type: "text",
      active: false
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Automação de Status WhatsApp</h3>
          <p className="text-sm text-muted-foreground">
            Agende status automáticos que aparecem para todos os seus contatos
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Status
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-whatsapp/10 to-whatsapp/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <PlayCircle className="h-8 w-8 text-whatsapp" />
              <div>
                <div className="text-2xl font-bold">2</div>
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
                <div className="text-2xl font-bold">10:30</div>
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

      {/* Status List */}
      <div className="space-y-4">
        <h4 className="font-medium">Status Programados</h4>
        <div className="space-y-3">
          {scheduledStatuses.map((status) => (
            <Card key={status.id} className={`transition-all ${status.active ? 'ring-2 ring-whatsapp/20' : 'opacity-60'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
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
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 max-w-2xl">
                      {status.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{status.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{status.days.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

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
    </div>
  );
};