import { breakpointSize } from '../..';

describe('breakpointSize', () => {
  const sizes = {
    small: 173,
    large: 300,
    xlarge: Infinity,
  };

  it('should return right breakpoint name based on passed width', () => {
    expect(breakpointSize(200, sizes)).toBe('large');
  });

  it('should use default sizes object', () => {
    expect(breakpointSize('175px')).toBe('medium');
  });

  it('should return the first key as default value', () => {
    expect(breakpointSize(100, sizes)).toBe('small');
  });

  it('should work with css pixel values', () => {
    expect(breakpointSize('175px', sizes)).toBe('large');
    expect(breakpointSize('500px', sizes)).toBe('xlarge');
  });
});
