import { isApiGatewayUrl } from '../../../utils/is-api-gateway-url';

describe('isApiGatewayUrl', () => {
  it.each`
    url               | expected
    ${'gateway/api'}  | ${false}
    ${'/gateway/api'} | ${true}
  `('$url should return $expected', ({ url, expected }) => {
    expect(isApiGatewayUrl(url)).toBe(expected);
  });
});
