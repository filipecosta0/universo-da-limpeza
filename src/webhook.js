const { processIncomingText } = require('./bot/router');

function verifyWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (!mode || !token) {
    return res.sendStatus(400);
  }

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

async function handleWebhookEvent(req, res) {
  const body = req.body;

  if (body?.object !== 'whatsapp_business_account') {
    return res.sendStatus(404);
  }

  try {
    const changes = body.entry?.flatMap((e) => e.changes || []) || [];

    for (const change of changes) {
      const value = change?.value;
      const messages = value?.messages || [];

      for (const msg of messages) {
        const from = msg?.from;
        const text = msg?.text?.body;

        if (!from || !text) continue;

        await processIncomingText({ from, text });
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error('Webhook processing error:', err);
    return res.sendStatus(500);
  }
}

module.exports = {
  verifyWebhook,
  handleWebhookEvent
};
