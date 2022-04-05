import { JsonLd } from 'json-ld-types';
import { expectToEqual } from '@atlaskit/media-test-helpers';
import {
  extractUrlFromLinkJsonLd,
  extractPlatformIsSupported,
  extractPreview,
} from '../extractors';
import {
  TEST_STRING,
  TEST_ARRAY,
  TEST_URL,
  TEST_LINK,
  TEST_BASE_DATA,
  TEST_OBJECT,
} from './__mocks__/jsonld';

describe('extractor', () => {
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

  describe('extractPlatformIsSupported()', () => {
    it('returns supported when no preview present', () => {
      expect(extractPlatformIsSupported(undefined)).toBe(false);
    });

    it('returns supported when string is passed', () => {
      const data = { ...TEST_BASE_DATA };
      data.preview = TEST_LINK;
      expect(extractPlatformIsSupported(data)).toBe(true);
    });

    it('returns supported - object present', () => {
      const data = { ...TEST_BASE_DATA };
      data.preview = TEST_OBJECT;
      expect(extractPlatformIsSupported(data)).toEqual(true);
    });

    it('returns supported - object present, platform supported', () => {
      const data = { ...TEST_BASE_DATA };
      data.preview = {
        ...TEST_OBJECT,
        'atlassian:supportedPlatforms': ['web'],
      };
      expect(extractPlatformIsSupported(data, 'web')).toEqual(true);
    });

    it('returns supported - object present, platform not supported', () => {
      const data = { ...TEST_BASE_DATA };
      data.preview = {
        ...TEST_OBJECT,
        'atlassian:supportedPlatforms': ['mobile'],
      };
      expect(extractPlatformIsSupported(data, 'mobile')).toEqual(true);
    });
  });

  describe('extractPreview()', () => {
    it('returns raw string as src - link', () => {
      const data: JsonLd.Data.BaseData = { ...TEST_BASE_DATA };
      data.preview = {
        ...(TEST_LINK as JsonLd.Primitives.LinkModel),
        'atlassian:aspectRatio': 0.72,
      };
      expectToEqual(extractPreview(data), { src: TEST_URL, aspectRatio: 0.72 });
    });

    it('returns raw url as src - object', () => {
      const data = { ...TEST_BASE_DATA };
      data.preview = {
        ...TEST_OBJECT,
        'atlassian:aspectRatio': 0.72,
      };
      expectToEqual(extractPreview(data), { src: TEST_URL, aspectRatio: 0.72 });
    });

    it('returns raw HTML as content - object', () => {
      const data = { ...TEST_BASE_DATA };
      data.preview = TEST_OBJECT;
      data.preview.content = TEST_STRING;
      delete data.preview.url;
      expect(extractPreview(data)).toEqual({ content: TEST_STRING });
    });
  });
});
