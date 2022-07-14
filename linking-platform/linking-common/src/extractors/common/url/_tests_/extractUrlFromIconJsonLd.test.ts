import { extractUrlFromIconJsonLd } from '../extractUrlFromIconJsonLd';
import {
  TEST_IMAGE_WITH_LINK,
  TEST_IMAGE,
  TEST_URL,
  TEST_LINK,
  TEST_STRING,
} from '../../__mocks__/jsonld';

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
