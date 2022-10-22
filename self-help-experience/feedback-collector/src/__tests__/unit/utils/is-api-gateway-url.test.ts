import { isApiGatewayUrl } from '../../../utils/is-api-gateway-url';

describe('isApiGatewayUrl', () => {
  it.each`
    url                                                 | expected
    ${'gateway/api'}                                    | ${false}
    ${'/gateway/api'}                                   | ${true}
    ${'https://api-gateway.trellis.coffee/gateway/api'} | ${true}
    ${'https://api-gateway.trello.com/gateway/api'}     | ${true}
  `('$url should return $expected', ({ url, expected }) => {
    expect(isApiGatewayUrl(url)).toBe(expected);
  });
});
