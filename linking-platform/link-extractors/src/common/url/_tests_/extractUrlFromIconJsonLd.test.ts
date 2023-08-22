import {
  TEST_IMAGE,
  TEST_IMAGE_WITH_LINK,
  TEST_LINK,
  TEST_STRING,
  TEST_URL,
} from '../../__mocks__/linkingPlatformJsonldMocks';
import { extractUrlFromIconJsonLd } from '../extractUrlFromIconJsonLd';

describe('extractUrlFromIconJsonLd', () => {
  it('returns raw string', () => {
    expect(extractUrlFromIconJsonLd(TEST_STRING)).toBe(TEST_STRING);
  });

  it('returns href of link', () => {
    expect(extractUrlFromIconJsonLd(TEST_LINK)).toBe(TEST_URL);
  });

  it('returns href of image', () => {
    expect(extractUrlFromIconJsonLd(TEST_IMAGE)).toBe(TEST_URL);
  });

  it('returns href of image - nested link', () => {
    expect(extractUrlFromIconJsonLd(TEST_IMAGE_WITH_LINK)).toBe(TEST_URL);
  });
});
