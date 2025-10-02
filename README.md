# Conecta+ - Plataforma de Automação WhatsApp

## 📋 Visão Geral

Conecta+ é uma plataforma completa para automação de campanhas e status do WhatsApp, permitindo agendamento, segmentação de clientes e gerenciamento de envios em massa.

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Storage**: Supabase Storage (Buckets)
- **Autenticação**: Supabase Auth
- **Real-time**: Supabase Realtime (para atualizações ao vivo)

## 🗄️ Estrutura do Banco de Dados

### Tabelas Necessárias

#### 1. `profiles`
Armazena informações adicionais dos usuários
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  whatsapp_connected BOOLEAN DEFAULT false,
  whatsapp_session_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. `clients`
Lista de clientes/contatos
```sql
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  name TEXT,
  segment TEXT, -- 'hot', 'warm', 'cold'
  last_interaction TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, phone)
);
```

#### 3. `blacklist`
Números bloqueados
```sql
CREATE TABLE public.blacklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, phone)
);
```

#### 4. `campaigns`
Campanhas de mensagens
```sql
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message_text TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT, -- 'image', 'video', 'none'
  segment TEXT, -- 'hot', 'warm', 'cold', 'all'
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'completed', 'failed'
  scheduled_date DATE,
  scheduled_time TIME,
  start_hour INTEGER,
  end_hour INTEGER,
  daily_limit INTEGER,
  daily_increment INTEGER,
  max_daily_limit INTEGER,
  total_sent INTEGER DEFAULT 0,
  total_target INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. `funnel_campaigns`
Campanhas de funil
```sql
CREATE TABLE public.funnel_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  segment TEXT,
  status TEXT DEFAULT 'draft',
  scheduled_date DATE,
  scheduled_time TIME,
  start_hour INTEGER,
  end_hour INTEGER,
  daily_limit INTEGER,
  daily_increment INTEGER,
  max_daily_limit INTEGER,
  total_sent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. `funnel_messages`
Mensagens do funil
```sql
CREATE TABLE public.funnel_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_campaign_id UUID REFERENCES public.funnel_campaigns(id) ON DELETE CASCADE,
  sequence_order INTEGER NOT NULL,
  message_text TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT,
  delay_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 7. `scheduled_statuses`
Status agendados
```sql
CREATE TABLE public.scheduled_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  caption TEXT,
  media_url TEXT,
  media_type TEXT, -- 'image', 'video', 'text'
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  repeat_type TEXT, -- 'none', 'daily', 'weekly'
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 8. `message_history`
Histórico de mensagens enviadas
```sql
CREATE TABLE public.message_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  funnel_campaign_id UUID REFERENCES public.funnel_campaigns(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'campaign', 'funnel', 'status'
  recipient_phone TEXT NOT NULL,
  message_text TEXT,
  media_url TEXT,
  status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  whatsapp_message_id TEXT
);
```

#### 9. `status_history`
Histórico de status enviados
```sql
CREATE TABLE public.status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_status_id UUID REFERENCES public.scheduled_statuses(id) ON DELETE SET NULL,
  caption TEXT,
  media_url TEXT,
  media_type TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views_count INTEGER DEFAULT 0
);
```

### Row Level Security (RLS)

Todas as tabelas devem ter RLS habilitado com políticas que garantam:
- Usuários só podem acessar seus próprios dados
- SELECT, INSERT, UPDATE, DELETE apenas para registros onde `user_id = auth.uid()`

Exemplo de políticas RLS:
```sql
-- Habilitar RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Política de SELECT
CREATE POLICY "Users can view their own campaigns"
  ON public.campaigns FOR SELECT
  USING (auth.uid() = user_id);

-- Política de INSERT
CREATE POLICY "Users can create their own campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política de UPDATE
CREATE POLICY "Users can update their own campaigns"
  ON public.campaigns FOR UPDATE
  USING (auth.uid() = user_id);

-- Política de DELETE
CREATE POLICY "Users can delete their own campaigns"
  ON public.campaigns FOR DELETE
  USING (auth.uid() = user_id);
```

## 📦 Storage Buckets

### 1. `campaign-media`
Armazena mídias de campanhas (fotos/vídeos)
- Público: Não
- Tamanho máximo: 50MB por arquivo
- Tipos permitidos: image/*, video/*

### 2. `status-media`
Armazena mídias de status
- Público: Não
- Tamanho máximo: 50MB por arquivo
- Tipos permitidos: image/*, video/*

### 3. `profile-photos`
Fotos de perfil dos usuários
- Público: Sim
- Tamanho máximo: 5MB por arquivo
- Tipos permitidos: image/*

### Políticas de Storage

```sql
-- Política para upload de mídia de campanha
CREATE POLICY "Users can upload their campaign media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'campaign-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para visualizar mídia de campanha
CREATE POLICY "Users can view their campaign media"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'campaign-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## ⚙️ Edge Functions

### 1. `whatsapp-qr`
Gera QR Code para conexão WhatsApp
- **Trigger**: Manual (usuário clica em conectar)
- **Autenticação**: Não requerida
- **Função**: Gera sessão WhatsApp Web

### 2. `text-reviewer`
Revisa textos usando IA
- **Trigger**: Manual
- **Autenticação**: Requerida
- **Função**: Melhora textos de campanhas usando OpenAI

### 3. `send-campaign` (A criar)
Processa e envia campanhas
- **Trigger**: Agendamento ou manual
- **Autenticação**: Requerida
- **Função**: 
  - Busca clientes do segmento
  - Verifica blacklist
  - Respeita limites diários e horários
  - Envia mensagens via WhatsApp API
  - Registra no histórico

### 4. `send-status` (A criar)
Processa e envia status
- **Trigger**: Agendamento
- **Autenticação**: Requerida
- **Função**:
  - Envia status no horário programado
  - Processa repetições (diário/semanal)
  - Registra no histórico

### 5. `schedule-processor` (A criar)
Processador de agendamentos (CRON)
- **Trigger**: A cada minuto via Supabase CRON
- **Autenticação**: Service Role
- **Função**:
  - Verifica campanhas/status pendentes
  - Invoca funções de envio apropriadas
  - Gerencia incrementos diários
  - Atualiza status de envios

### 6. `delete-campaign-messages` (A criar)
Deleta mensagens de uma campanha
- **Trigger**: Manual (usuário clica no histórico)
- **Autenticação**: Requerida
- **Função**:
  - Deleta mensagens no WhatsApp (se API permitir)
  - Remove do histórico local

## 🔄 Fluxo de Interação entre Páginas

### 1. **Página Principal (Dashboard)**
- Exibe métricas gerais
- Acesso rápido a todas funcionalidades
- Tabs: Campanhas, Status WhatsApp, Funil

### 2. **Tab Campanhas**
- Lista campanhas ativas/agendadas
- Botão "Nova Campanha" → Abre dialog
- Cards de campanha com ações (editar, pausar, deletar)
- Filtros por segmento e status

### 3. **Tab Status WhatsApp**
- Botão "Novo Status" → Abre dialog de criação
- Lista de status agendados
- Histórico de status enviados

### 4. **Tab Funil**
- Botão "Criar Campanha de Funil" → Abre dialog
- Adicionar múltiplas mensagens em sequência
- Definir intervalos entre mensagens
- Configurar limites e horários

### 5. **Página Histórico (/history)**
- Tabs: Todos, Campanhas, Status
- Busca por título
- Cards com detalhes de envio
- Botão "Ver Detalhes" → Modal com informações completas
- Botão "Apagar Mensagens" → Deleta mensagens enviadas

### 6. **Configurações de Usuário**
- Conectar WhatsApp (QR Code)
- Upload de foto de perfil
- Gerenciar segmentos de clientes
- Importar CSV de contatos
- Blacklist

## 🚀 Execução na Nuvem (Automação)

### Requisitos para Execução Autônoma

#### 1. **Supabase CRON Jobs**
Configure um CRON job para executar a cada minuto:

```sql
-- Habilitar extensão pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Agendar processador de envios
SELECT cron.schedule(
  'process-scheduled-sends',
  '* * * * *', -- A cada minuto
  $$
  SELECT net.http_post(
    url := 'https://brzaxcbgydiipaszcadc.supabase.co/functions/v1/schedule-processor',
    headers := '{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb
  );
  $$
);
```

#### 2. **Gerenciamento de Estado**
- Campanhas/status são marcados como "sending" durante processamento
- Contadores diários são atualizados a cada envio
- Incrementos automáticos aplicados diariamente

#### 3. **Tratamento de Falhas**
- Retry automático para mensagens falhas (max 3 tentativas)
- Logs detalhados em tabela `error_logs`
- Notificações por email em caso de falhas críticas

#### 4. **Escalabilidade**
- Edge Functions escalam automaticamente
- Pool de conexões do PostgreSQL configurado
- Rate limiting para WhatsApp API

#### 5. **Monitoramento**
- Dashboard de logs no Supabase
- Métricas de envio em tempo real
- Alertas para campanhas com baixa taxa de sucesso

## 🔐 Segurança

1. **Autenticação**: Supabase Auth com email/senha
2. **RLS**: Todas as tabelas protegidas por Row Level Security
3. **Storage**: Acesso restrito por usuário
4. **Edge Functions**: Tokens JWT validados
5. **Rate Limiting**: Proteção contra abuso
6. **Secrets**: Chaves API armazenadas em Supabase Secrets

## 📊 Métricas e Analytics

- Total de mensagens enviadas
- Taxa de entrega
- Segmentação de clientes (quente/morno/frio)
- Campanhas mais efetivas
- Horários de maior engajamento

## 🛠️ Como Configurar

### 1. Criar Projeto Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Anote as credenciais (URL e Keys)

### 2. Executar Migrations
Execute os scripts SQL na ordem:
1. Criar tabelas
2. Habilitar RLS
3. Criar políticas
4. Criar buckets
5. Configurar CRON

### 3. Deploy Edge Functions
```bash
supabase functions deploy whatsapp-qr
supabase functions deploy text-reviewer
supabase functions deploy send-campaign
supabase functions deploy send-status
supabase functions deploy schedule-processor
supabase functions deploy delete-campaign-messages
```

### 4. Configurar Secrets
```bash
supabase secrets set OPENAI_API_KEY=your_key
supabase secrets set WHATSAPP_API_TOKEN=your_token
supabase secrets set WHATSAPP_PHONE_NUMBER_ID=your_id
```

### 5. Deploy Frontend
```bash
npm install
npm run build
# Deploy para Vercel, Netlify ou Supabase Hosting
```

## 📝 Roadmap

- [ ] Implementar todas as tabelas do banco
- [ ] Criar buckets de storage
- [ ] Desenvolver Edge Functions de envio
- [ ] Configurar CRON jobs
- [ ] Implementar analytics detalhado
- [ ] Adicionar suporte a templates
- [ ] Integração com múltiplos números WhatsApp
- [ ] Dashboard administrativo
- [ ] Exportação de relatórios

## 🤝 Suporte

Para dúvidas ou problemas:
- Documentação do Supabase: https://supabase.com/docs
- Documentação do WhatsApp Business API: https://developers.facebook.com/docs/whatsapp

## 💻 Development

### Como editar este código?

**Use Lovable**

Visite o [Lovable Project](https://lovable.dev/projects/726c2468-629a-4177-baba-07693bd774dd) e comece a fazer prompts.

**Use sua IDE preferida**

```sh
# Clonar o repositório
git clone <YOUR_GIT_URL>

# Navegar para o diretório
cd <YOUR_PROJECT_NAME>

# Instalar dependências
npm i

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🚀 Deploy

Abra [Lovable](https://lovable.dev/projects/726c2468-629a-4177-baba-07693bd774dd) e clique em Share → Publish.

## 🌐 Domínio Customizado

Para conectar um domínio, navegue até Project > Settings > Domains e clique em Connect Domain.

Leia mais: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

**Conecta+** - Automação inteligente para seu WhatsApp Business 🚀
