import {
  extractUrlFromIconJsonLd,
  extractUrlFromLinkJsonLd,
  extractPersonFromJsonLd,
} from '../utils';
import {
  TEST_STRING,
  TEST_ARRAY,
  TEST_URL,
  TEST_LINK,
  TEST_IMAGE,
  TEST_IMAGE_WITH_LINK,
  TEST_OBJECT,
  TEST_NAME,
} from '../__mocks__/jsonld';

describe('extractor.utils', () => {
  afterEach(() => jest.clearAllMocks());

  describe('extractUrlFromLinkJsonLd', () => {
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

  describe('extractPersonFromJsonLd', () => {
    it('throws on raw string', () => {
      expect(() => extractPersonFromJsonLd(TEST_STRING)).toThrow(
        'Link.person needs to be an object',
      );
    });

    it('returns undefined - link with no name', () => {
      const link = { ...(TEST_LINK as any) };
      delete link.name;
      expect(extractPersonFromJsonLd(link)).toBe(undefined);
    });

    it('returns undefined - object with no name', () => {
      const object = { ...TEST_OBJECT };
      delete object.name;
      expect(extractPersonFromJsonLd(object)).toBe(undefined);
    });

    it('returns person with name - link', () => {
      expect(extractPersonFromJsonLd(TEST_LINK)).toEqual({ name: TEST_NAME });
    });

    it('returns person with name - object', () => {
      const object = { ...TEST_OBJECT };
      delete object.icon;
      expect(extractPersonFromJsonLd(object)).toEqual({ name: TEST_NAME });
    });

    it('returns person with name, icon - object', () => {
      expect(extractPersonFromJsonLd(TEST_OBJECT)).toEqual({
        name: TEST_NAME,
        src: TEST_URL,
      });
    });
  });
});
