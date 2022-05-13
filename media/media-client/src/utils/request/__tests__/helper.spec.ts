import { createUrl } from '../helpers';

describe('helpers', () => {
  test.each([[null], [undefined]])(
    '(%s) params should be stripped out',
    (replaceFileId) => {
      const url = 'http://fake.com';
      const params = {
        collection: 'MediaServicesSample',
        occurrenceKey: 'a18b1b92',
        replaceFileId,
      };
      const result = createUrl(url, {
        params,
      });
      expect(result).toBe(
        `${url}/?collection=${params.collection}&occurrenceKey=${params.occurrenceKey}`,
      );
    },
  );

  test.each([[0], [false], ['test'], ['']])(
    '(%s) params should not be stripped out',
    (replaceFileId) => {
      const url = 'http://fake.com';
      const params = {
        collection: 'MediaServicesSample',
        occurrenceKey: 'a18b1b92',
        replaceFileId,
      };
      const result = createUrl(url, {
        params,
      });
      expect(result).toBe(
        `${url}/?collection=${params.collection}&occurrenceKey=${params.occurrenceKey}&replaceFileId=${params.replaceFileId}`,
      );
    },
  );
});
