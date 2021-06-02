import { asMock } from '@atlaskit/media-test-helpers';
import { fetchBlob } from '../../src/utils';

describe('utils', () => {
  describe('fetchBlob', () => {
    const setup = (blob: Blob) => ({
      fetch: asMock(fetch).mockReturnValue(
        Promise.resolve({ blob: () => blob }),
      ),
    });

    it('should resolve with fetched Blob given url', () => {
      const blob = new Blob();
      const url = 'http://some-url';
      const { fetch } = setup(blob);

      return fetchBlob(url).then((actualBlob) => {
        expect(fetch).toBeCalledWith(url);
        expect(actualBlob).toEqual(blob);
      });
    });

    it('should resolve original blob given blob', () => {
      const blob = new Blob();

      return fetchBlob(blob).then((actualBlob) => {
        expect(actualBlob).toEqual(blob);
      });
    });
  });
});
