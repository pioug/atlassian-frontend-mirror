export const isApiGatewayUrl = (url: string) =>
  [
    '/gateway/api',
    'https://api-gateway.trellis.coffee/gateway/api',
    'https://api-gateway.trello.com/gateway/api',
  ].includes(url);
