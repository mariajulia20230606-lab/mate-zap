import { useState } from "react";
import { Wand2, Eye, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const TemplateBuilder = () => {
  const [template, setTemplate] = useState("{Oi|Fala|E aí} {{nome}}, hoje tem {feijoada|baião de dois|torta de frango}! Vem garantir o seu 😋");
  const [previewName, setPreviewName] = useState("João");

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
          <Label htmlFor="template">Template da Mensagem</Label>
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