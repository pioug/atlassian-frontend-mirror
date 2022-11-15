import { JsonLd } from 'json-ld-types';
import { extractIsTrusted } from '../extractIsTrusted';

describe('extractIsTrusted', () => {
  it.each([
    [true, 'confluence-object-provider'],
    [true, 'jira-object-provider'],
    [true, 'miro-object-provider'],
    [false, 'iframely-object-provider'],
    [false, ''],
    [false, null],
    [false, undefined],
  ])('returns %s when key is %s', (expected: boolean, key?: string | null) => {
    const meta = {
      access: 'granted',
      visibility: 'public',
      key,
    } as JsonLd.Meta.BaseMeta;

    expect(extractIsTrusted(meta)).toBe(expected);
  });
});
