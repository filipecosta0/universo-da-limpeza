# Universo da Limpeza — Atendimento WhatsApp (bot simples)

Bot simples de atendimento via WhatsApp com:
- Mensagem de boas-vindas
- Menu inicial com opções (1 a 4)
- Respostas automáticas objetivas
- Opção de encaminhar para atendimento humano

Inclui também uma **landing page moderna** (responsiva) para conversão, com botão de CTA para WhatsApp.

## Requisitos

- Node.js 18+
- Uma conta configurada no **WhatsApp Cloud API (Meta)**

## Configuração

1) Copie o arquivo `.env.example` para `.env` e preencha os valores.

- `VERIFY_TOKEN`: token usado na verificação do webhook (você define no painel da Meta e também aqui)
- `WHATSAPP_TOKEN`: token de acesso (temporário ou permanente)
- `WHATSAPP_PHONE_NUMBER_ID`: ID do número do WhatsApp na Cloud API

Configuração da landing page (CTA):

- `WHATSAPP_STORE_NUMBER`: número do WhatsApp no formato internacional (padrão: `5575999369458`)
- `WHATSAPP_PREFILL`: mensagem pré-definida (padrão: `Olá! Gostaria de atendimento da Universo da Limpeza.`)

2) Instale dependências

```bash
npm install
```

3) Inicie o servidor

```bash
npm start
```

Durante o desenvolvimento, você pode usar:

```bash
npm run dev
```

## Endpoints

- `GET /` (landing page)
- `GET /config.js` (configuração dinâmica do WhatsApp da landing page)
- `GET /webhook` (verificação do webhook)
- `POST /webhook` (recebe eventos/mensagens)
- `GET /health` (health check)

## Como testar

- Exponha sua porta local com um túnel (ex.: ngrok) e use a URL pública no painel da Meta como callback do webhook.
- Ao enviar uma mensagem para o seu número, o bot responde com boas-vindas + menu.

## Manutenção / Evolução

- Mensagens ficam em `src/bot/templates.js`
- Fluxo/roteamento fica em `src/bot/router.js`
- Estado simples em memória fica em `src/bot/state.js` (para produção, o ideal é trocar por Redis/DB)
