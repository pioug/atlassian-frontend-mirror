import {
  UNSAFE_buildAboveMediaQueryCSS,
  UNSAFE_buildBelowMediaQueryCSS,
} from '../../build-media-query-css';

describe('UNSAFE_buildAboveMediaQueryCSS', () => {
  it('builds a map of breakpoints and css({}) outputs', () => {
    expect(UNSAFE_buildAboveMediaQueryCSS({ display: 'none' })).toEqual({
      xxs: expect.objectContaining({
        name: expect.any(String),
        styles: '@media all{display:none;}',
      }),
      xs: expect.objectContaining({
        name: expect.any(String),
        styles: '@media (min-width: 30rem){display:none;}',
      }),
      sm: expect.objectContaining({
        name: expect.any(String),
        styles: '@media (min-width: 48rem){display:none;}',
      }),
      md: expect.objectContaining({
        name: expect.any(String),
        styles: '@media (min-width: 64rem){display:none;}',
      }),
      lg: expect.objectContaining({
        name: expect.any(String),
        styles: '@media (min-width: 90rem){display:none;}',
      }),
      xl: expect.objectContaining({
        name: expect.any(String),
        styles: '@media (min-width: 110rem){display:none;}',
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
        styles: '@media (min-width: 30rem){content:"xs";}',
      }),
    );

    expect(output.xl).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        styles: '@media (min-width: 110rem){content:"xl";}',
      }),
    );
  });
});

describe('UNSAFE_buildBelowMediaQueryCSS', () => {
  it('builds a map of breakpoints and css({}) outputs', () => {
    expect(UNSAFE_buildBelowMediaQueryCSS({ display: 'none' })).toEqual({
      xs: expect.objectContaining({
        name: expect.any(String),
        styles: '@media not all and (min-width: 30rem){display:none;}',
      }),
      sm: expect.objectContaining({
        name: expect.any(String),
        styles: '@media not all and (min-width: 48rem){display:none;}',
      }),
      md: expect.objectContaining({
        name: expect.any(String),
        styles: '@media not all and (min-width: 64rem){display:none;}',
      }),
      lg: expect.objectContaining({
        name: expect.any(String),
        styles: '@media not all and (min-width: 90rem){display:none;}',
      }),
      xl: expect.objectContaining({
        name: expect.any(String),
        styles: '@media not all and (min-width: 110rem){display:none;}',
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
        styles: '@media not all and (min-width: 30rem){content:"xs";}',
      }),
    );

    expect(output.xl).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        styles: '@media not all and (min-width: 110rem){content:"xl";}',
      }),
    );
  });
});
