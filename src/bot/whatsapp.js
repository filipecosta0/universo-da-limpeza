const https = require('https');

function postJson(url, payload, headers) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(payload), 'utf8');
    const u = new URL(url);

    const req = https.request(
      {
        method: 'POST',
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
          ...headers
        }
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            return resolve({ status: res.statusCode, body });
          }
          return reject(new Error(`WhatsApp API error ${res.statusCode}: ${body}`));
        });
      }
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function sendTextMessage({ to, body }) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.WHATSAPP_API_VERSION || 'v19.0';

  if (!token || !phoneNumberId) {
    throw new Error('Missing WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID in environment.');
  }

  const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: {
      preview_url: false,
      body
    }
  };

  await postJson(url, payload, {
    Authorization: `Bearer ${token}`
  });
}

module.exports = {
  sendTextMessage
};
