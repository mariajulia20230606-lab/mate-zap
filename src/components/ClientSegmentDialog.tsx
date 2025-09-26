import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Users, Filter, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface ClientSegmentDialogProps {
  onCreateSegment: (segment: any) => void;
}

export const ClientSegmentDialog = ({ onCreateSegment }: ClientSegmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [segmentData, setSegmentData] = useState({
    name: "",
    description: "",
    criteria: {
      lastOrderDays: "",
      minOrders: "",
      tags: [] as string[],
      preferredItems: [] as string[],
      orderValue: "",
      orderValueOperator: "gte"
    }
  });

  const availableTags = [
    "Gosta de Frango", "Vegetarianos", "Pedidos Frequentes", 
    "Novos Clientes", "VIPs", "Fim de Semana", "Promocionais"
  ];

  const preferredItems = [
    "Feijoada", "Baião de Dois", "Torta de Frango", "Lasanha", 
    "Hambúrguer", "Pizza", "Saladas", "Sobremesas"
  ];

  const handleTagToggle = (tag: string) => {
    const newTags = segmentData.criteria.tags.includes(tag)
      ? segmentData.criteria.tags.filter(t => t !== tag)
      : [...segmentData.criteria.tags, tag];
    
    setSegmentData({
      ...segmentData,
      criteria: { ...segmentData.criteria, tags: newTags }
    });
  };

  const handleItemToggle = (item: string) => {
    const newItems = segmentData.criteria.preferredItems.includes(item)
      ? segmentData.criteria.preferredItems.filter(i => i !== item)
      : [...segmentData.criteria.preferredItems, item];
    
    setSegmentData({
      ...segmentData,
      criteria: { ...segmentData.criteria, preferredItems: newItems }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!segmentData.name.trim()) {
      toast.error("Nome do segmento é obrigatório");
      return;
    }

    const segment = {
      id: Date.now().toString(),
      name: segmentData.name,
      description: segmentData.description,
      criteria: segmentData.criteria,
      estimatedSize: Math.floor(Math.random() * 500) + 100, // Simulado
      createdAt: new Date().toISOString()
    };

    onCreateSegment(segment);
    toast.success(`Segmento "${segment.name}" criado com sucesso!`);
    
    setOpen(false);
    setSegmentData({
      name: "",
      description: "",
      criteria: {
        lastOrderDays: "",
        minOrders: "",
        tags: [],
        preferredItems: [],
        orderValue: "",
        orderValueOperator: "gte"
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Filter className="h-4 w-4 mr-2" />
          Segmentar Clientes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Criar Segmento de Clientes</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="segment-name">Nome do Segmento</Label>
              <Input
                id="segment-name"
                value={segmentData.name}
                onChange={(e) => setSegmentData({ ...segmentData, name: e.target.value })}
                placeholder="Ex: Clientes Premium"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="segment-description">Descrição</Label>
              <Input
                id="segment-description"
                value={segmentData.description}
                onChange={(e) => setSegmentData({ ...segmentData, description: e.target.value })}
                placeholder="Descrição do segmento"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="last-order">Último Pedido (dias)</Label>
              <Input
                id="last-order"
                type="number"
                value={segmentData.criteria.lastOrderDays}
                onChange={(e) => setSegmentData({
                  ...segmentData,
                  criteria: { ...segmentData.criteria, lastOrderDays: e.target.value }
                })}
                placeholder="Ex: 30"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="min-orders">Mínimo de Pedidos</Label>
              <Input
                id="min-orders"
                type="number"
                value={segmentData.criteria.minOrders}
                onChange={(e) => setSegmentData({
                  ...segmentData,
                  criteria: { ...segmentData.criteria, minOrders: e.target.value }
                })}
                placeholder="Ex: 5"
              />
            </div>

            <div className="space-y-2">
              <Label>Valor do Pedido</Label>
              <div className="flex space-x-2">
                <Select 
                  value={segmentData.criteria.orderValueOperator} 
                  onValueChange={(value) => setSegmentData({
                    ...segmentData,
                    criteria: { ...segmentData.criteria, orderValueOperator: value }
                  })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gte">≥</SelectItem>
                    <SelectItem value="lte">≤</SelectItem>
                    <SelectItem value="eq">=</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={segmentData.criteria.orderValue}
                  onChange={(e) => setSegmentData({
                    ...segmentData,
                    criteria: { ...segmentData.criteria, orderValue: e.target.value }
                  })}
                  placeholder="R$ 50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Tags Comportamentais</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={segmentData.criteria.tags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <Label 
                    htmlFor={`tag-${tag}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Itens Preferidos</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {preferredItems.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`item-${item}`}
                    checked={segmentData.criteria.preferredItems.includes(item)}
                    onCheckedChange={() => handleItemToggle(item)}
                  />
                  <Label 
                    htmlFor={`item-${item}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {(segmentData.criteria.tags.length > 0 || segmentData.criteria.preferredItems.length > 0) && (
            <div className="space-y-2">
              <Label>Critérios Selecionados:</Label>
              <div className="flex flex-wrap gap-1">
                {segmentData.criteria.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    Tag: {tag}
                  </Badge>
                ))}
                {segmentData.criteria.preferredItems.map((item) => (
                  <Badge key={item} variant="outline" className="text-xs">
                    Item: {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Criar Segmento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};