import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Smartphone, CheckCircle, XCircle, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WhatsAppSession {
  sessionId: string;
  qrCode?: string;
  status: 'waiting' | 'connected' | 'disconnected' | 'error';
  phone?: string;
  lastActivity: string;
}

const WhatsAppQRScanner = () => {
  const [session, setSession] = useState<WhatsAppSession | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startSession = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-qr/start-session', {
        method: 'POST',
      });

      if (error) throw error;

      setSession(data);
      toast({
        title: "Sessão iniciada",
        description: "Escaneie o QR code com seu WhatsApp para conectar.",
      });

      // Start polling for session status
      startStatusPolling(data.sessionId);
      
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Erro",
        description: "Falha ao iniciar sessão do WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateQRScan = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-qr/scan-qr', {
        method: 'POST',
        body: { sessionId: session.sessionId },
      });

      if (error) throw error;

      setSession(data);
      toast({
        title: "WhatsApp conectado!",
        description: `Conectado com sucesso: ${data.phone}`,
      });
      
    } catch (error) {
      console.error('Error scanning QR:', error);
      toast({
        title: "Erro",
        description: "Falha ao conectar WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    if (!session) return;
    
    try {
      await supabase.functions.invoke('whatsapp-qr/disconnect', {
        method: 'DELETE',
        body: { sessionId: session.sessionId },
      });

      setSession(null);
      toast({
        title: "Desconectado",
        description: "Sessão do WhatsApp encerrada.",
      });
      
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Erro",
        description: "Falha ao desconectar.",
        variant: "destructive",
      });
    }
  };

  const startStatusPolling = (sessionId: string) => {
    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke(`whatsapp-qr/status?sessionId=${sessionId}`, {
          method: 'GET',
        });

        if (error) throw error;

        setSession(data);
        
        if (data.status === 'connected') {
          clearInterval(interval);
          toast({
            title: "WhatsApp conectado!",
            description: `Conectado com sucesso: ${data.phone}`,
          });
        }
      } catch (error) {
        console.error('Error polling status:', error);
        clearInterval(interval);
      }
    }, 3000);

    // Clear interval after 5 minutes to avoid indefinite polling
    setTimeout(() => clearInterval(interval), 300000);
  };

  const getStatusBadge = () => {
    if (!session) return null;

    const statusConfig = {
      waiting: { label: 'Aguardando', variant: 'secondary' as const, icon: QrCode },
      connected: { label: 'Conectado', variant: 'default' as const, icon: CheckCircle },
      disconnected: { label: 'Desconectado', variant: 'outline' as const, icon: XCircle },
      error: { label: 'Erro', variant: 'destructive' as const, icon: XCircle },
    };

    const config = statusConfig[session.status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Smartphone className="h-5 w-5" />
            WhatsApp Scanner
          </CardTitle>
          <CardDescription>
            Conecte seu WhatsApp Web escaneando o QR code
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!session ? (
            <Button 
              onClick={startSession} 
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Sessão WhatsApp
            </Button>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status:</span>
                {getStatusBadge()}
              </div>

              {session.qrCode && session.status === 'waiting' && (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <img 
                      src={session.qrCode} 
                      alt="WhatsApp QR Code" 
                      className="w-48 h-48 border rounded-lg"
                    />
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Abra o WhatsApp no seu celular</p>
                    <p>Vá em Menu → WhatsApp Web</p>
                    <p>Escaneie este código QR</p>
                  </div>

                  <Button 
                    onClick={simulateQRScan} 
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simular Scan (Demo)
                  </Button>
                </div>
              )}

              {session.status === 'connected' && session.phone && (
                <div className="space-y-3">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-800 dark:text-green-200">
                      WhatsApp Conectado!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      {session.phone}
                    </p>
                  </div>

                  <Button 
                    onClick={disconnect}
                    variant="destructive"
                    className="w-full"
                  >
                    Desconectar
                  </Button>
                </div>
              )}

              {session.sessionId && (
                <div className="text-xs text-muted-foreground text-center">
                  Sessão: {session.sessionId.substring(0, 8)}...
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppQRScanner;