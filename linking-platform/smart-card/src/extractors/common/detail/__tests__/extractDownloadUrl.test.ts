import { extractDownloadUrl } from '../extractDownloadUrl';
import { TEST_DOCUMENT, TEST_URL } from '../../__mocks__/jsonld';

describe('atlassian.detail.downloadUrl', () => {
  it('returns undefined when no comment count present', () => {
    expect(extractDownloadUrl(TEST_DOCUMENT)).toBe(undefined);
  });

  it('returns number and icon when comment count present', () => {
    expect(
      extractDownloadUrl({
        ...TEST_DOCUMENT,
        'atlassian:downloadUrl': TEST_URL,
      }),
    ).toBe(TEST_URL);
  });
});
