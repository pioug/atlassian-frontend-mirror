import { addQueryParam } from '../../url-utils';

describe('url utils', () => {
  describe('addQueryParam', () => {
    it('adds query strings correctly to urls without existing queries', () => {
      const baseUrl = 'https://www.atlassian.com';

      const result = addQueryParam(baseUrl, 'q', 'result');

      expect(result).toEqual(`${baseUrl}?q=result`);
    });

    it('adds new query strings correctly to urls with existing queries', () => {
      const baseUrl = 'https://www.atlassian.com?existing=value';

      const result = addQueryParam(baseUrl, 'q', 'result');

      expect(result).toEqual(`${baseUrl}&q=result`);
    });

    it('adds query strings correctly to relative urls', () => {
      const baseUrl = '/search';

      const result = addQueryParam(baseUrl, 'q', 'result');

      expect(result).toEqual(`${baseUrl}?q=result`);
    });

    it('replaces existing query strings with new query item', () => {
      const baseUrl = 'https://www.atlassian.com?existing=value&q=existing';

      const result = addQueryParam(baseUrl, 'q', 'new');

      expect(result).toEqual(`https://www.atlassian.com?existing=value&q=new`);
    });

    it('handles undefined query values', () => {
      const baseUrl = 'https://www.atlassian.com';

      const result = addQueryParam(baseUrl, 'q', undefined);

      expect(result).toEqual(`${baseUrl}?q=`);
    });

    it('encodes query values', () => {
      const baseUrl = 'https://www.atlassian.com';

      const result = addQueryParam(baseUrl, 'q', '&?/+');

      expect(result).toEqual(`${baseUrl}?q=%26%3F%2F%2B`);
    });

    it('encodes query names', () => {
      const baseUrl = 'https://www.atlassian.com';

      const result = addQueryParam(baseUrl, 'q/', 'value');

      expect(result).toEqual(`${baseUrl}?q%2F=value`);
    });

    it('ignores empty query names', () => {
      const baseUrl = 'https://www.atlassian.com';

      const result = addQueryParam(baseUrl, '', 'value');

      expect(result).toEqual(`${baseUrl}`);
    });

    it('ignores empty url', () => {
      const baseUrl = '';

      const result = addQueryParam(baseUrl, 'q', 'value');

      expect(result).toEqual('');
    });
  });
});
