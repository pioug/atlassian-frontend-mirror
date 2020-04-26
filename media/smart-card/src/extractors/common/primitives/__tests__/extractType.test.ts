import { extractType } from '../extractType';
import { TEST_OBJECT } from '../../__mocks__/jsonld';

describe('extractors.primitives.type', () => {
  it('returns undefined if not present', () => {
    const object = { ...TEST_OBJECT, '@type': undefined as any };
    expect(extractType(object)).toBe(undefined);
  });

  it('returns raw array', () => {
    const object = { ...TEST_OBJECT };
    object['@type'] = ['Object', 'Image'];
    expect(extractType(object)).toEqual(object['@type']);
  });

  it('returns singular type as array', () => {
    expect(extractType(TEST_OBJECT)).toEqual(['Object']);
  });
});
