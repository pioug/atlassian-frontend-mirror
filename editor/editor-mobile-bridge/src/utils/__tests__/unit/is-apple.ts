import { isApple } from '../../is-apple';

describe('isApple', () => {
  it('should be true if webkit is true', function () {
    expect(isApple(({ webkit: true } as unknown) as Window)).toBe(true);
  });

  it('should be false if webkit is false', function () {
    expect(isApple(({ webkit: false } as unknown) as Window)).toBe(false);
  });

  it('should be false if webkit is not defined', function () {
    expect(isApple({} as Window)).toBe(false);
  });
});
