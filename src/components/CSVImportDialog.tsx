import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CSVImportDialogProps {
  onImportComplete: (contacts: any[]) => void;
}

export const CSVImportDialog = ({ onImportComplete }: CSVImportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const downloadTemplate = () => {
    const csvContent = "nome,telefone,email,segmento,tags\nJoão Silva,5511999999999,joao@email.com,Clientes Quentes,Gosta de Frango;VIP\nMaria Santos,5511888888888,maria@email.com,Novos,Vegetarianos";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'template_contatos.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    toast.success("Template baixado com sucesso!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast.error("Por favor, selecione um arquivo CSV válido");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Selecione um arquivo CSV");
      return;
    }

    setIsUploading(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const contacts = lines.slice(1).map((line, index) => {
        const values = line.split(',');
        const contact: any = { id: `imported_${index}` };
        
        headers.forEach((header, i) => {
          if (header === 'tags' && values[i]) {
            contact[header] = values[i].split(';').map(tag => tag.trim());
          } else {
            contact[header] = values[i]?.trim() || '';
          }
        });
        
        return contact;
      });

      onImportComplete(contacts);
      toast.success(`${contacts.length} contatos importados com sucesso!`);
      setOpen(false);
      setFile(null);
    } catch (error) {
      toast.error("Erro ao processar o arquivo CSV");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Importar Contatos via CSV</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="border-warning/20 bg-warning/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span>Formato do Arquivo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">
                O arquivo CSV deve conter as seguintes colunas:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs">
                nome,telefone,email,segmento,tags
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Tags devem ser separadas por ponto e vírgula (;)
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={downloadTemplate} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Baixar Template CSV
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-file">Selecionar Arquivo CSV</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Arquivo selecionado: {file.name}
              </p>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="min-w-[120px]"
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processando...</span>
                </div>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};