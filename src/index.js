const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const { verifyWebhook, handleWebhookEvent } = require('./webhook');

dotenv.config();

const app = express();

app.get('/config.js', (req, res) => {
  const storeNumber = process.env.WHATSAPP_STORE_NUMBER || '5575999369458';
  const prefill =
    process.env.WHATSAPP_PREFILL ||
    'Olá! Gostaria de atendimento da Universo da Limpeza.';

  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.status(200).send(
    `window.__WHATSAPP_STORE_NUMBER__ = ${JSON.stringify(storeNumber)};\n` +
      `window.__WHATSAPP_PREFILL__ = ${JSON.stringify(prefill)};\n`
  );
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/webhook', verifyWebhook);
app.post('/webhook', express.json({ type: 'application/json' }), handleWebhookEvent);

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`WhatsApp bot listening on :${port}`);
});
