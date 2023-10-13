import {
  breakoutInlineScriptContext,
  createBreakoutInlineScript,
} from '../../breakout-ssr';

function waitForTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

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

  it('should not break inline SSR script when inserting comment element', async () => {
    const mockWindow = {
      addEventListener: jest.fn(),
    };

    // Setup
    ((mockWindow) => {
      // @ts-ignore expected unused. Used to override window object in the eval below
      const window = mockWindow;

      document.body.innerHTML = `
<div class="ak-renderer-wrapper">
  <script data-breakout-script-id="111"></script>
  <div class="ak-renderer-document" data-node-type="mediaSingle" width="100"></div>
</div>
`;
      // eslint-disable-next-line no-eval
      eval(createBreakoutInlineScript(111));
    })(mockWindow);

    document.querySelector('.ak-renderer-document')!.innerHTML = `
<!-- comment element should not break the page -->
<div class="pm-table-container" data-mode="custom" style="width:100px"></div>
`;

    await waitForTick();

    // Unregister mutation observer on page load
    expect(mockWindow.addEventListener).toHaveBeenCalledWith(
      'load',
      expect.any(Function),
    );
    // Set some width
    expect(
      (document.querySelector('.pm-table-container') as HTMLElement).style
        .width,
    ).toBeTruthy();
  });
});
