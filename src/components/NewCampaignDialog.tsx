import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Users, Calendar, MessageSquare, Clock, Settings, FileText } from "lucide-react";

interface NewCampaignDialogProps {
  onCreateCampaign: (campaign: any) => void;
  savedTemplates?: Array<{
    id: string;
    name: string;
    content: string;
  }>;
}

export const NewCampaignDialog = ({ onCreateCampaign, savedTemplates = [] }: NewCampaignDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    template: "",
    selectedTemplate: "",
    audience: "",
    scheduledDate: "",
    scheduledTime: "",
    endDate: "",
    endTime: "",
    tags: [] as string[],
    priority: "normal",
    // Configurações de disparo
    messagesPerDay: "50",
    dailyIncrease: "10",
    maxMessagesPerDay: "200",
    restTimeAfter: "20",
    restTimeMinutes: "30"
  });
  const [newTag, setNewTag] = useState("");

  const predefinedTags = [
    "Clientes Quentes", "Clientes Frios", "Frequentes", "Novos", 
    "Gosta de Frango", "Vegetarianos", "Fim de Semana", "VIP"
  ];

  const handleAddTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = savedTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData({ 
        ...formData, 
        selectedTemplate: templateId,
        template: template.content 
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCampaign = {
      title: formData.title,
      status: formData.scheduledDate ? "scheduled" as const : "active" as const,
      audience: formData.audience,
      nextSend: formData.scheduledDate ? `${formData.scheduledDate} ${formData.scheduledTime}` : "Agora",
      messagesSent: 0,
      totalMessages: parseInt(formData.audience.replace(/\D/g, '')) || 100,
      template: formData.template,
      tags: formData.tags,
      priority: formData.priority,
      // Configurações avançadas
      schedule: {
        startDate: formData.scheduledDate,
        startTime: formData.scheduledTime,
        endDate: formData.endDate,
        endTime: formData.endTime
      },
      messaging: {
        messagesPerDay: parseInt(formData.messagesPerDay),
        dailyIncrease: parseInt(formData.dailyIncrease),
        maxMessagesPerDay: parseInt(formData.maxMessagesPerDay),
        restTimeAfter: parseInt(formData.restTimeAfter),
        restTimeMinutes: parseInt(formData.restTimeMinutes)
      }
    };

    onCreateCampaign(newCampaign);
    setOpen(false);
    setFormData({
      title: "",
      template: "",
      selectedTemplate: "",
      audience: "",
      scheduledDate: "",
      scheduledTime: "",
      endDate: "",
      endTime: "",
      tags: [],
      priority: "normal",
      messagesPerDay: "50",
      dailyIncrease: "10",
      maxMessagesPerDay: "200",
      restTimeAfter: "20",
      restTimeMinutes: "30"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Campanha
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>Criar Nova Campanha</span>
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
                placeholder="Ex: Prato do Dia - Terça"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="audience">Audiência Estimada</Label>
              <Input
                id="audience"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                placeholder="Ex: 850 clientes"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Template da Mensagem</Label>
              {savedTemplates.length > 0 && (
                <Select value={formData.selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Usar template salvo" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>{template.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <Textarea
              id="template"
              value={formData.template}
              onChange={(e) => setFormData({ ...formData, template: e.target.value })}
              placeholder="{Oi|Fala|E aí} {{nome}}, {hoje tem|acabou de sair} {feijoada|baião de dois}!"
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use {"{opção1|opção2}"} para variações e {"{{nome}}"} para personalização
            </p>
          </div>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Período da Campanha</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
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
                      <Label htmlFor="start-time">Horário de Início (diário)</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                        placeholder="09:00"
                      />
                      <p className="text-xs text-muted-foreground">
                        Horário que a campanha inicia todos os dias
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="end-date">Data de Término</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">Horário de Término (diário)</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        placeholder="18:00"
                      />
                      <p className="text-xs text-muted-foreground">
                        Horário que a campanha para todos os dias
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configurações de Disparo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="messages-per-day">Disparos por Dia (inicial)</Label>
                    <Input
                      id="messages-per-day"
                      type="number"
                      min="1"
                      value={formData.messagesPerDay}
                      onChange={(e) => setFormData({ ...formData, messagesPerDay: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="daily-increase">Acréscimo Diário</Label>
                    <Input
                      id="daily-increase"
                      type="number"
                      min="0"
                      value={formData.dailyIncrease}
                      onChange={(e) => setFormData({ ...formData, dailyIncrease: e.target.value })}
                      placeholder="10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-messages">Limite Máximo por Dia</Label>
                    <Input
                      id="max-messages"
                      type="number"
                      min="1"
                      value={formData.maxMessagesPerDay}
                      onChange={(e) => setFormData({ ...formData, maxMessagesPerDay: e.target.value })}
                      placeholder="200"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rest-after">Repouso Após X Disparos</Label>
                    <Input
                      id="rest-after"
                      type="number"
                      min="1"
                      value={formData.restTimeAfter}
                      onChange={(e) => setFormData({ ...formData, restTimeAfter: e.target.value })}
                      placeholder="20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rest-minutes">Tempo de Repouso (minutos)</Label>
                    <Input
                      id="rest-minutes"
                      type="number"
                      min="1"
                      value={formData.restTimeMinutes}
                      onChange={(e) => setFormData({ ...formData, restTimeMinutes: e.target.value })}
                      placeholder="30"
                    />
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm space-y-1">
                      <p><strong>Resumo:</strong></p>
                      <p>• Início: {formData.messagesPerDay} disparos/dia</p>
                      <p>• Crescimento: +{formData.dailyIncrease} por dia</p>
                      <p>• Limite: {formData.maxMessagesPerDay} disparos/dia</p>
                      <p>• Pausa: {formData.restTimeMinutes}min a cada {formData.restTimeAfter} envios</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Label>Segmentação (Tags)</Label>
            
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant={formData.tags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => formData.tags.includes(tag) ? handleRemoveTag(tag) : handleAddTag(tag)}
                >
                  <Users className="h-3 w-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>

            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nova tag personalizada"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newTag.trim()) {
                      handleAddTag(newTag.trim());
                      setNewTag("");
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (newTag.trim()) {
                    handleAddTag(newTag.trim());
                    setNewTag("");
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Calendar className="h-4 w-4 mr-2" />
              {formData.scheduledDate ? "Agendar Campanha" : "Criar e Ativar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};