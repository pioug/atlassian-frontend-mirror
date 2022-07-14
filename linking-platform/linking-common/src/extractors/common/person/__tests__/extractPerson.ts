import {
  TEST_LINK,
  TEST_NAME,
  TEST_OBJECT,
  TEST_STRING,
  TEST_URL,
} from '../../__mocks__/jsonld';
import { extractPersonFromJsonLd } from '../extractPerson';

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
