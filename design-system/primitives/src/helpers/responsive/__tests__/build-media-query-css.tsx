import {
  UNSAFE_buildAboveMediaQueryCSS,
  UNSAFE_buildBelowMediaQueryCSS,
} from '../index';

describe('media-helper', () => {
  describe('UNSAFE_buildAboveMediaQueryCSS', () => {
    it('builds a map of breakpoints and css({}) outputs', () => {
      expect(UNSAFE_buildAboveMediaQueryCSS({ display: 'none' })).toEqual({
        xxs: expect.objectContaining({
          name: expect.any(String),
          styles: '@media (min-width: 0px){display:none;}',
        }),
        xs: expect.objectContaining({
          name: expect.any(String),
          styles: '@media (min-width: 480px){display:none;}',
        }),
        sm: expect.objectContaining({
          name: expect.any(String),
          styles: '@media (min-width: 768px){display:none;}',
        }),
        md: expect.objectContaining({
          name: expect.any(String),
          styles: '@media (min-width: 1024px){display:none;}',
        }),
        lg: expect.objectContaining({
          name: expect.any(String),
          styles: '@media (min-width: 1440px){display:none;}',
        }),
        xl: expect.objectContaining({
          name: expect.any(String),
          styles: '@media (min-width: 1768px){display:none;}',
        }),
        xxl: expect.objectContaining({
          name: expect.any(String),
          styles: '@media (min-width: 2160px){display:none;}',
        }),
      });
    });

    it('works with a functional value', () => {
      const output = UNSAFE_buildAboveMediaQueryCSS(breakpoint => ({
        content: `"${breakpoint}"`,
      }));

      // Just a small sample size
      expect(output.xs).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          styles: '@media (min-width: 480px){content:"xs";}',
        }),
      );

      expect(output.xl).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          styles: '@media (min-width: 1768px){content:"xl";}',
        }),
      );
    });
  });

  describe('UNSAFE_buildBelowMediaQueryCSS', () => {
    it('builds a map of breakpoints and css({}) outputs', () => {
      expect(UNSAFE_buildBelowMediaQueryCSS({ display: 'none' })).toEqual({
        xs: expect.objectContaining({
          name: expect.any(String),
          styles: '@media (max-width: 479.98px){display:none;}',
        }),
        sm: expect.objectContaining({
          name: expect.any(String),
          styles: '@media (max-width: 767.98px){display:none;}',
        }),
        md: expect.objectContaining({
          name: expect.any(String),
          styles: '@media (max-width: 1023.98px){display:none;}',
        }),
        lg: expect.objectContaining({
          name: expect.any(String),
          styles: '@media (max-width: 1439.98px){display:none;}',
        }),
        xl: expect.objectContaining({
          name: expect.any(String),
          styles: '@media (max-width: 1767.98px){display:none;}',
        }),
        xxl: expect.objectContaining({
          name: expect.any(String),
          styles: '@media (max-width: 2159.98px){display:none;}',
        }),
      });
    });

    it('works with a functional value', () => {
      const output = UNSAFE_buildBelowMediaQueryCSS(breakpoint => ({
        content: `"${breakpoint}"`,
      }));

      // Just a small sample size
      expect(output.xs).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          styles: '@media (max-width: 479.98px){content:"xs";}',
        }),
      );

      expect(output.xl).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          styles: '@media (max-width: 1767.98px){content:"xl";}',
        }),
      );
    });
  });
});
