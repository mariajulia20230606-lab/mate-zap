import { useState } from "react";
import { Wand2, Eye, Save, Upload, X, Image, Video, FileText, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const TemplateBuilder = () => {
  const [template, setTemplate] = useState("{Oi|Fala|E aí} {{nome}}, hoje tem {feijoada|baião de dois|torta de frango}! Vem garantir o seu 😋");
  const [previewName, setPreviewName] = useState("João");
  const [isReviewing, setIsReviewing] = useState(false);
  const [attachments, setAttachments] = useState<Array<{
    id: string;
    type: 'image' | 'video';
    file: File;
    caption: string;
    preview: string;
  }>>([]);

  const generatePreview = () => {
    let preview = template;
    
    // Replace name variable
    preview = preview.replace(/{{nome}}/g, previewName);
    
    // Replace spintext variations (choose first option for preview)
    preview = preview.replace(/{([^}]+)}/g, (match, options) => {
      const choices = options.split('|');
      return choices[0];
    });
    
    return preview;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newAttachment = {
            id: Date.now().toString() + Math.random(),
            type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
            file,
            caption: '',
            preview: e.target?.result as string
          };
          setAttachments(prev => [...prev, newAttachment]);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Apenas imagens e vídeos são suportados");
      }
    });
  };

  const updateAttachmentCaption = (id: string, caption: string) => {
    setAttachments(prev => prev.map(att => 
      att.id === id ? { ...att, caption } : att
    ));
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleAIReview = async () => {
    if (!template.trim()) {
      toast.error("Digite um texto para revisar");
      return;
    }

    setIsReviewing(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-reviewer', {
        body: { text: template }
      });

      if (error) throw error;

      if (data?.reviewedText) {
        setTemplate(data.reviewedText);
        toast.success("Texto revisado pela AI!");
      }
    } catch (error) {
      console.error('Error reviewing text:', error);
      toast.error("Erro ao revisar texto");
    } finally {
      setIsReviewing(false);
    }
  };

  const spintextExamples = [
    "{Oi|Olá|E aí|Fala} - Variações de cumprimento",
    "{{nome}} - Nome do cliente", 
    "{delicioso|saboroso|especial} - Adjetivos",
    "{hoje|neste momento|agora} - Tempo",
    "{garante|pega|reserva} o seu - Ação"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wand2 className="h-5 w-5" />
          <span>Editor de Templates com Spintext</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="template">Template da Mensagem</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAIReview}
              disabled={isReviewing || !template.trim()}
              className="flex items-center space-x-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isReviewing ? "Revisando..." : "Revisar com AI"}</span>
            </Button>
          </div>
          <Textarea
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="Digite sua mensagem aqui..."
            className="min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preview-name">Nome para Preview</Label>
            <Input
              id="preview-name"
              value={previewName}
              onChange={(e) => setPreviewName(e.target.value)}
              placeholder="Nome do cliente"
            />
          </div>
          <div className="space-y-2">
            <Label>Preview da Mensagem</Label>
            <div className="p-3 bg-whatsapp/10 rounded-lg border border-whatsapp/20">
              <p className="text-sm">{generatePreview()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Anexos (Imagens e Vídeos)</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" type="button" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar Arquivo
                  </span>
                </Button>
              </Label>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-3">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {attachment.type === 'image' ? (
                        <Image className="h-4 w-4 text-primary" />
                      ) : (
                        <Video className="h-4 w-4 text-primary" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        {attachment.type === 'image' ? 'Imagem' : 'Vídeo'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {attachment.file.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`caption-${attachment.id}`}>Legenda</Label>
                      <Textarea
                        id={`caption-${attachment.id}`}
                        value={attachment.caption}
                        onChange={(e) => updateAttachmentCaption(attachment.id, e.target.value)}
                        placeholder="Digite a legenda do arquivo..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="border rounded overflow-hidden bg-muted/50">
                        {attachment.type === 'image' ? (
                          <img 
                            src={attachment.preview} 
                            alt="Preview" 
                            className="w-full h-24 object-cover"
                          />
                        ) : (
                          <video 
                            src={attachment.preview} 
                            className="w-full h-24 object-cover"
                            controls={false}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Exemplos de Spintext</Label>
          <div className="grid grid-cols-1 gap-2">
            {spintextExamples.map((example, index) => (
              <div key={index} className="p-2 bg-muted rounded text-sm font-mono">
                {example}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Testar Preview
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Salvar Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};