import { breakoutInlineScriptContext } from '../../breakout-ssr';

describe('Breakout SSR', () => {
  it('should create working context for inline script', () => {
    const inlineScript = `(() => {
        ${breakoutInlineScriptContext};
        return breakoutConsts.calcBreakoutWidth("full-width", 1000);
      })();`;

    // eslint-disable-next-line no-eval
    expect(() => eval(inlineScript)).not.toThrow();

    // eslint-disable-next-line no-eval
    expect(eval(inlineScript)).toBe('904px');
  });
});
