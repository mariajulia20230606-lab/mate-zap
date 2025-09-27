import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, MessageSquare, Calendar, ArrowDown, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FunnelMessage {
  id: string;
  template: string;
  delayDays: number;
  order: number;
}

interface FunnelCampaignDialogProps {
  onCreateCampaign: (campaign: any) => void;
  savedTemplates?: Array<{
    id: string;
    name: string;
    content: string;
  }>;
}

export const FunnelCampaignDialog = ({ onCreateCampaign, savedTemplates = [] }: FunnelCampaignDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    audience: "",
    scheduledDate: "",
    scheduledTime: "",
    endDate: "",
    endTime: "",
  });

  const [funnelMessages, setFunnelMessages] = useState<FunnelMessage[]>([
    {
      id: "1",
      template: "",
      delayDays: 0,
      order: 1
    }
  ]);

  const addFunnelMessage = () => {
    if (funnelMessages.length >= 4) {
      toast.error("Máximo de 4 mensagens no funil");
      return;
    }

    const newMessage: FunnelMessage = {
      id: Date.now().toString(),
      template: "",
      delayDays: 1,
      order: funnelMessages.length + 1
    };

    setFunnelMessages([...funnelMessages, newMessage]);
  };

  const removeFunnelMessage = (id: string) => {
    if (funnelMessages.length <= 1) {
      toast.error("Deve ter pelo menos uma mensagem");
      return;
    }

    setFunnelMessages(funnelMessages.filter(msg => msg.id !== id));
  };

  const updateFunnelMessage = (id: string, field: keyof FunnelMessage, value: string | number) => {
    setFunnelMessages(funnelMessages.map(msg => 
      msg.id === id ? { ...msg, [field]: value } : msg
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Nome da campanha é obrigatório");
      return;
    }

    if (funnelMessages.some(msg => !msg.template.trim())) {
      toast.error("Todas as mensagens do funil devem ter conteúdo");
      return;
    }

    const newCampaign = {
      title: formData.title,
      type: "funnel",
      status: formData.scheduledDate ? "scheduled" as const : "active" as const,
      audience: formData.audience,
      nextSend: formData.scheduledDate ? `${formData.scheduledDate} ${formData.scheduledTime}` : "Agora",
      messagesSent: 0,
      totalMessages: parseInt(formData.audience.replace(/\D/g, '')) || 100,
      funnel: funnelMessages,
      schedule: {
        startDate: formData.scheduledDate,
        startTime: formData.scheduledTime,
        endDate: formData.endDate,
        endTime: formData.endTime
      }
    };

    onCreateCampaign(newCampaign);
    toast.success("Campanha de funil criada com sucesso!");
    setOpen(false);
    
    // Reset form
    setFormData({
      title: "",
      audience: "",
      scheduledDate: "",
      scheduledTime: "",
      endDate: "",
      endTime: "",
    });
    setFunnelMessages([{
      id: "1",
      template: "",
      delayDays: 0,
      order: 1
    }]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Campanha Funil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>Criar Campanha de Funil</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nome da Campanha</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Campanha de Boas Vindas"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="audience">Audiência Estimada</Label>
              <Input
                id="audience"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                placeholder="Ex: 500 clientes"
                required
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Período da Campanha</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Data de Início</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Data de Término</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Mensagens do Funil</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFunnelMessage}
                  disabled={funnelMessages.length >= 4}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Mensagem
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {funnelMessages.map((message, index) => (
                <div key={message.id}>
                  <Card className="border-dashed">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <h4 className="font-medium">
                            {index === 0 ? "Primeira Mensagem (Imediata)" : `Mensagem ${index + 1}`}
                          </h4>
                        </div>
                        {funnelMessages.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFunnelMessage(message.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {index > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Aguardar (dias)</Label>
                            <Input
                              type="number"
                              min="1"
                              value={message.delayDays}
                              onChange={(e) => updateFunnelMessage(message.id, 'delayDays', parseInt(e.target.value) || 1)}
                              placeholder="1"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label>Template da Mensagem</Label>
                        <Textarea
                          value={message.template}
                          onChange={(e) => updateFunnelMessage(message.id, 'template', e.target.value)}
                          placeholder="{Oi|Olá} {{nome}}, seja bem-vindo(a)!"
                          rows={3}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Use {"{opção1|opção2}"} para variações e {"{{nome}}"} para personalização
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {index < funnelMessages.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowDown className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Calendar className="h-4 w-4 mr-2" />
              {formData.scheduledDate ? "Agendar Funil" : "Criar e Ativar Funil"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};