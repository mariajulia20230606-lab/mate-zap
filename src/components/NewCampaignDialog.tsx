import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Users, Calendar, MessageSquare } from "lucide-react";

interface NewCampaignDialogProps {
  onCreateCampaign: (campaign: any) => void;
}

export const NewCampaignDialog = ({ onCreateCampaign }: NewCampaignDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    template: "",
    audience: "",
    scheduledDate: "",
    scheduledTime: "",
    tags: [] as string[],
    priority: "normal"
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
      priority: formData.priority
    };

    onCreateCampaign(newCampaign);
    setOpen(false);
    setFormData({
      title: "",
      template: "",
      audience: "",
      scheduledDate: "",
      scheduledTime: "",
      tags: [],
      priority: "normal"
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

          <div className="space-y-2">
            <Label htmlFor="template">Template da Mensagem</Label>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data (opcional)</Label>
              <Input
                id="date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Horário (opcional)</Label>
              <Input
                id="time"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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