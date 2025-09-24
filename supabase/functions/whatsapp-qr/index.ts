import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppSession {
  sessionId: string;
  qrCode?: string;
  status: 'waiting' | 'connected' | 'disconnected' | 'error';
  phone?: string;
  lastActivity: string;
}

// In-memory storage for sessions (in production, use a database)
const sessions = new Map<string, WhatsAppSession>();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    switch (req.method) {
      case 'POST':
        if (path === 'start-session') {
          return await startWhatsAppSession(req);
        } else if (path === 'scan-qr') {
          return await handleQRScan(req);
        }
        break;
        
      case 'GET':
        if (path === 'status') {
          return await getSessionStatus(req);
        }
        break;
        
      case 'DELETE':
        if (path === 'disconnect') {
          return await disconnectSession(req);
        }
        break;
    }
    
    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in whatsapp-qr function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function startWhatsAppSession(req: Request) {
  const sessionId = crypto.randomUUID();
  
  // Generate a mock QR code for demonstration
  // In a real implementation, you would integrate with whatsapp-web.js
  const qrCode = generateMockQRCode();
  
  const session: WhatsAppSession = {
    sessionId,
    qrCode,
    status: 'waiting',
    lastActivity: new Date().toISOString(),
  };
  
  sessions.set(sessionId, session);
  
  console.log(`Started WhatsApp session: ${sessionId}`);
  
  return new Response(JSON.stringify({
    sessionId,
    qrCode,
    status: 'waiting',
    message: 'Session started. Please scan the QR code with WhatsApp.'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleQRScan(req: Request) {
  const { sessionId } = await req.json();
  
  if (!sessionId || !sessions.has(sessionId)) {
    return new Response(JSON.stringify({ error: 'Invalid session ID' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const session = sessions.get(sessionId)!;
  
  // Simulate QR code scanning process
  // In real implementation, this would handle the actual WhatsApp Web connection
  session.status = 'connected';
  session.phone = '+55 11 99999-9999'; // Mock phone number
  session.lastActivity = new Date().toISOString();
  session.qrCode = undefined; // Clear QR code after connection
  
  console.log(`QR code scanned for session: ${sessionId}`);
  
  return new Response(JSON.stringify({
    sessionId,
    status: 'connected',
    phone: session.phone,
    message: 'WhatsApp connected successfully!'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getSessionStatus(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId');
  
  if (!sessionId || !sessions.has(sessionId)) {
    return new Response(JSON.stringify({ error: 'Session not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const session = sessions.get(sessionId)!;
  
  return new Response(JSON.stringify(session), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function disconnectSession(req: Request) {
  const { sessionId } = await req.json();
  
  if (!sessionId || !sessions.has(sessionId)) {
    return new Response(JSON.stringify({ error: 'Session not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  sessions.delete(sessionId);
  
  console.log(`Disconnected WhatsApp session: ${sessionId}`);
  
  return new Response(JSON.stringify({
    message: 'Session disconnected successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function generateMockQRCode(): string {
  // Generate a mock QR code data URL for demonstration
  // In real implementation, this would be the actual WhatsApp QR code
  const qrData = `1@${crypto.randomUUID()}@${Date.now()}`;
  
  // This is a simplified QR code representation
  // In production, you would generate an actual QR code image
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <rect x="20" y="20" width="160" height="160" fill="black"/>
      <rect x="40" y="40" width="120" height="120" fill="white"/>
      <text x="100" y="105" text-anchor="middle" font-family="Arial" font-size="12" fill="black">QR Code</text>
      <text x="100" y="125" text-anchor="middle" font-family="Arial" font-size="8" fill="black">${qrData.substring(0, 20)}...</text>
    </svg>
  `)}`;
}