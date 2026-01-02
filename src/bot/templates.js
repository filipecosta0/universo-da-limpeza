function normalizeSpaces(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function welcomeMessage() {
  return normalizeSpaces(`Olá! Seja bem-vindo(a) à *Universo da Limpeza*.
Somos uma loja de produtos de limpeza com atendimento rápido e prático pelo WhatsApp.

Digite uma opção para continuar:`);
}

function mainMenu() {
  return normalizeSpaces(`*Menu – Universo da Limpeza*
1) Ver catálogo de produtos
2) Consultar preços e promoções
3) Fazer um pedido
4) Falar com um atendente

Responda com o número da opção.`);
}

function catalogMessage() {
  return normalizeSpaces(`*Catálogo – Universo da Limpeza*

- Água sanitária
- Desinfetante
- Detergente
- Sabão em pó
- Limpador multiuso
- Esponjas e panos

Se quiser, diga o produto que você procura (ex: "desinfetante") ou digite *menu* para voltar.`);
}

function pricingMessage() {
  return normalizeSpaces(`*Preços e promoções*

Para eu te passar valores certinhos, me diga:
- Produto (nome)
- Quantidade

Exemplo: "Detergente 3 unidades".
Ou digite *menu* para voltar.`);
}

function orderStartMessage() {
  return normalizeSpaces(`*Fazer um pedido*

Me envie:
- Produtos e quantidades
- Bairro/Cidade (para calcular entrega)

Exemplo: "2 desinfetantes + 1 sabão em pó, bairro Centro".
Ou digite *menu* para voltar.`);
}

function handoffMessage(humanContact) {
  const contactLine = humanContact ? `\nContato: *${humanContact}*` : '';
  return normalizeSpaces(`Certo! Vou te encaminhar para um atendente humano.${contactLine}

Enquanto isso, se quiser, deixe:
- Seu nome
- O que você precisa

Assim a gente agiliza seu atendimento.`);
}

function unknownOptionMessage() {
  return normalizeSpaces(`Não entendi essa opção.

Por favor, responda com:
1, 2, 3 ou 4

Ou digite *menu* para ver as opções.`);
}

module.exports = {
  welcomeMessage,
  mainMenu,
  catalogMessage,
  pricingMessage,
  orderStartMessage,
  handoffMessage,
  unknownOptionMessage
};
