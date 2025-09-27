import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShieldX, Plus, X, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface BlacklistDialogProps {
  onAddToBlacklist: (contacts: string[]) => void;
  currentBlacklist?: string[];
}

export const BlacklistDialog = ({ onAddToBlacklist, currentBlacklist = [] }: BlacklistDialogProps) => {
  const [open, setOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumbers.trim()) {
      toast.error("Digite pelo menos um número");
      return;
    }

    // Parse phone numbers from textarea
    const numbers = phoneNumbers
      .split(/[\n,;]+/)
      .map(num => num.trim().replace(/\D/g, ''))
      .filter(num => num.length >= 10);

    if (numbers.length === 0) {
      toast.error("Nenhum número válido encontrado");
      return;
    }

    onAddToBlacklist(numbers);
    toast.success(`${numbers.length} número(s) adicionado(s) à blacklist`);
    
    setOpen(false);
    setPhoneNumbers("");
    setReason("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPhoneNumbers(content);
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ShieldX className="h-4 w-4 mr-2" />
          Gerenciar Blacklist
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShieldX className="h-5 w-5 text-destructive" />
            <span>Gerenciar Lista de Bloqueios</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {currentBlacklist.length > 0 && (
            <div className="space-y-2">
              <Label>Números Bloqueados Atualmente ({currentBlacklist.length})</Label>
              <div className="max-h-32 overflow-y-auto border rounded-lg p-3 bg-muted/30">
                <div className="flex flex-wrap gap-1">
                  {currentBlacklist.slice(0, 20).map((number, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {number}
                    </Badge>
                  ))}
                  {currentBlacklist.length > 20 && (
                    <Badge variant="outline" className="text-xs">
                      +{currentBlacklist.length - 20} mais...
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone-numbers">Adicionar Números à Blacklist</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept=".txt,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" type="button" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Importar Arquivo
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>
              <Textarea
                id="phone-numbers"
                value={phoneNumbers}
                onChange={(e) => setPhoneNumbers(e.target.value)}
                placeholder="Digite os números um por linha ou separados por vírgula:&#10;11999887766&#10;11988776655&#10;ou&#10;11999887766, 11988776655"
                rows={6}
                className="font-mono"
                required
              />
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: 11999887766, (11) 99988-7766, +55 11 99988-7766
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo do Bloqueio (opcional)</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Solicitou descadastro, número inválido, etc."
              />
            </div>

            <div className="bg-muted/50 border border-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <ShieldX className="h-4 w-4 text-destructive" />
                <span>Sobre a Blacklist</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                <li>• Números na blacklist não receberão campanhas</li>
                <li>• Útil para números que solicitaram descadastro</li>
                <li>• Inclui também números inválidos ou com problema</li>
                <li>• A blacklist é aplicada automaticamente em todas as campanhas</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="destructive">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar à Blacklist
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};