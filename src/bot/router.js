const {
  welcomeMessage,
  mainMenu,
  catalogMessage,
  pricingMessage,
  orderStartMessage,
  handoffMessage,
  unknownOptionMessage
} = require('./templates');

const { getUserState, setUserState } = require('./state');
const { sendTextMessage } = require('./whatsapp');

function normalizeIncoming(text) {
  return String(text || '').trim();
}

function isMenuCommand(t) {
  const v = t.toLowerCase();
  return v === 'menu' || v === 'voltar' || v === 'início' || v === 'inicio';
}

function isHumanCommand(t) {
  const v = t.toLowerCase();
  return v.includes('atendente') || v === 'humano' || v === 'falar com atendente' || v === '4';
}

async function reply(to, message) {
  await sendTextMessage({ to, body: message });
}

async function processIncomingText({ from, text }) {
  const incoming = normalizeIncoming(text);
  const state = getUserState(from);

  if (isMenuCommand(incoming)) {
    setUserState(from, { stage: 'MENU' });
    await reply(from, mainMenu());
    return;
  }

  if (state.stage === 'NEW') {
    setUserState(from, { stage: 'MENU' });
    await reply(from, welcomeMessage());
    await reply(from, mainMenu());
    return;
  }

  if (state.stage === 'HUMAN') {
    return;
  }

  if (isHumanCommand(incoming)) {
    setUserState(from, { stage: 'HUMAN' });
    await reply(from, handoffMessage(process.env.HUMAN_CONTACT));
    return;
  }

  if (incoming === '1') {
    setUserState(from, { stage: 'CATALOG' });
    await reply(from, catalogMessage());
    return;
  }

  if (incoming === '2') {
    setUserState(from, { stage: 'PRICING' });
    await reply(from, pricingMessage());
    return;
  }

  if (incoming === '3') {
    setUserState(from, { stage: 'ORDER' });
    await reply(from, orderStartMessage());
    return;
  }

  await reply(from, unknownOptionMessage());
  await reply(from, mainMenu());
}

module.exports = {
  processIncomingText
};
