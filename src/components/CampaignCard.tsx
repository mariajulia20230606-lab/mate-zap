import { Play, Pause, Edit, Trash2, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CampaignCardProps {
  title: string;
  status: "active" | "paused" | "scheduled";
  audience: string;
  nextSend?: string;
  messagesSent: number;
  totalMessages: number;
  template: string;
}

export const CampaignCard = ({
  title,
  status,
  audience,
  nextSend,
  messagesSent,
  totalMessages,
  template
}: CampaignCardProps) => {
  const statusColors = {
    active: "bg-whatsapp text-white",
    paused: "bg-warning text-foreground",
    scheduled: "bg-secondary text-secondary-foreground"
  };

  const statusLabels = {
    active: "Ativa",
    paused: "Pausada", 
    scheduled: "Agendada"
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge className={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{audience}</span>
          </div>
          {nextSend && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{nextSend}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span>{messagesSent}/{totalMessages}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(messagesSent / totalMessages) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg text-sm">
          <strong>Template:</strong> {template}
        </div>

        <div className="flex justify-between">
          <div className="flex space-x-2">
            {status === "active" ? (
              <Button size="sm" variant="outline">
                <Pause className="h-4 w-4 mr-1" />
                Pausar
              </Button>
            ) : (
              <Button size="sm" variant="default">
                <Play className="h-4 w-4 mr-1" />
                Ativar
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </div>
          <Button size="sm" variant="ghost" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};