import { token } from '@atlaskit/tokens';
import { safeToken } from '../token';

describe('safeToken', () => {
  it('returns @atlaskit/token token', () => {
    const path = 'color.text';
    const fallback = '#172B4D';
    const expected = token(path, fallback);

    const actual = safeToken(path, fallback);

    expect(actual).toEqual(expected);
  });

  it('does not throw error when token path does not exists', () => {
    expect(() => safeToken('some-path')).not.toThrow();
  });
});
