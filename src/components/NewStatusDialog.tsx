import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface NewStatusDialogProps {
  onCreateStatus: (status: any) => void;
  editStatus?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const weekDays = [
  { id: "monday", label: "Segunda" },
  { id: "tuesday", label: "Terça" },
  { id: "wednesday", label: "Quarta" },
  { id: "thursday", label: "Quinta" },
  { id: "friday", label: "Sexta" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
];

export const NewStatusDialog = ({ onCreateStatus, editStatus, open, onOpenChange }: NewStatusDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(editStatus?.title || "");
  const [content, setContent] = useState(editStatus?.content || "");
  const [mediaType, setMediaType] = useState(editStatus?.type || "text");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState(editStatus?.mediaUrl || "");
  const [scheduleDate, setScheduleDate] = useState(editStatus?.scheduleDate || "");
  const [scheduleTime, setScheduleTime] = useState(editStatus?.time || "");
  const [repeatType, setRepeatType] = useState(editStatus?.repeatType || "none");
  const [selectedDays, setSelectedDays] = useState<string[]>(editStatus?.days || []);

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setIsOpen(open);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview("");
  };

  const handleDayToggle = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSubmit = () => {
    if (!title || !content) {
      toast.error("Preencha o título e o conteúdo do status");
      return;
    }

    if ((mediaType === "image" || mediaType === "video") && !mediaPreview && !editStatus) {
      toast.error("Anexe uma imagem ou vídeo");
      return;
    }

    if (!scheduleDate || !scheduleTime) {
      toast.error("Defina a data e hora de agendamento");
      return;
    }

    if (repeatType === "weekly" && selectedDays.length === 0) {
      toast.error("Selecione pelo menos um dia da semana");
      return;
    }

    const status = {
      id: editStatus?.id || Date.now(),
      title,
      content,
      type: mediaType,
      mediaUrl: mediaPreview,
      scheduleDate,
      time: scheduleTime,
      repeatType,
      days: selectedDays,
      active: true,
      createdAt: editStatus?.createdAt || new Date().toISOString(),
    };

    onCreateStatus(status);
    handleOpenChange(false);
    
    // Reset form
    setTitle("");
    setContent("");
    setMediaType("text");
    setMediaFile(null);
    setMediaPreview("");
    setScheduleDate("");
    setScheduleTime("");
    setRepeatType("none");
    setSelectedDays([]);
    
    toast.success(editStatus ? "Status atualizado com sucesso!" : "Status agendado com sucesso!");
  };

  return (
    <Dialog open={open !== undefined ? open : isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {!editStatus && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Status
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editStatus ? "Editar Status" : "Novo Status WhatsApp"}</DialogTitle>
          <DialogDescription>
            Agende um status automático com imagem, vídeo ou texto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título do Status</Label>
            <Input
              id="title"
              placeholder="Ex: Prato do Dia - Segunda"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Tipo de Mídia */}
          <div className="space-y-2">
            <Label htmlFor="mediaType">Tipo de Status</Label>
            <Select value={mediaType} onValueChange={setMediaType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Apenas Texto</SelectItem>
                <SelectItem value="image">Imagem com Legenda</SelectItem>
                <SelectItem value="video">Vídeo com Legenda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload de Mídia */}
          {(mediaType === "image" || mediaType === "video") && (
            <div className="space-y-2">
              <Label>Upload de {mediaType === "image" ? "Imagem" : "Vídeo"}</Label>
              {!mediaPreview ? (
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Clique para fazer upload
                  </p>
                  <Input
                    type="file"
                    accept={mediaType === "image" ? "image/*" : "video/*"}
                    onChange={handleMediaChange}
                    className="cursor-pointer"
                  />
                </div>
              ) : (
                <div className="relative">
                  {mediaType === "image" ? (
                    <img src={mediaPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  ) : (
                    <video src={mediaPreview} className="w-full h-48 object-cover rounded-lg" controls />
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveMedia}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Legenda/Conteúdo */}
          <div className="space-y-2">
            <Label htmlFor="content">
              {mediaType === "text" ? "Conteúdo do Status" : "Legenda"}
            </Label>
            <Textarea
              id="content"
              placeholder="Digite o conteúdo... Use {{variavel}} para campos dinâmicos e {opção1|opção2} para variações"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Dica: Use variações {"{Oi|Olá|E aí}"} para humanizar
            </p>
          </div>

          {/* Agendamento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleDate">Data</Label>
              <Input
                id="scheduleDate"
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduleTime">Horário</Label>
              <Input
                id="scheduleTime"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>

          {/* Repetição */}
          <div className="space-y-2">
            <Label htmlFor="repeatType">Repetir</Label>
            <Select value={repeatType} onValueChange={setRepeatType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a frequência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Não repetir</SelectItem>
                <SelectItem value="daily">Diariamente</SelectItem>
                <SelectItem value="weekly">Semanalmente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dias da Semana (apenas para semanal) */}
          {repeatType === "weekly" && (
            <div className="space-y-2">
              <Label>Dias da Semana</Label>
              <div className="grid grid-cols-2 gap-3">
                {weekDays.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.id}
                      checked={selectedDays.includes(day.label)}
                      onCheckedChange={() => handleDayToggle(day.label)}
                    />
                    <label
                      htmlFor={day.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {day.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {editStatus ? "Atualizar" : "Agendar Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
