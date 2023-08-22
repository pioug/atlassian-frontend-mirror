import {
  TEST_ARRAY,
  TEST_LINK,
  TEST_STRING,
  TEST_URL,
} from '../../__mocks__/linkingPlatformJsonldMocks';
import { extractUrlFromLinkJsonLd } from '../extractUrlFromLinkJsonLd';

describe('extractUrlFromLinkJsonLd()', () => {
  it('returns raw string', () => {
    expect(extractUrlFromLinkJsonLd(TEST_STRING)).toBe(TEST_STRING);
  });

  it('returns undefined for empty array', () => {
    expect(extractUrlFromLinkJsonLd([])).toBe(undefined);
  });

  it('returns href of first element of array', () => {
    expect(extractUrlFromLinkJsonLd(TEST_ARRAY)).toBe(TEST_URL);
  });

  it('returns href of passed element', () => {
    expect(extractUrlFromLinkJsonLd(TEST_LINK)).toBe(TEST_URL);
  });
});
