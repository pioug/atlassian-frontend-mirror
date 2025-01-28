import { breakoutInlineScriptContext, createBreakoutInlineScript } from '../../breakout-ssr';

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
		expect(mockWindow.addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
		// Set some width
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		expect((document.querySelector('.pm-table-container') as HTMLElement).style.width).toBeTruthy();
	});

	it('should not execute inline ssr script when __RENDERER_BYPASS_BREAKOUT_SSR__', async () => {
		const mockWindow = {
			addEventListener: jest.fn(),
			__RENDERER_BYPASS_BREAKOUT_SSR__: true,
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
		expect(mockWindow.addEventListener).not.toHaveBeenCalledWith('load', expect.any(Function));
	});

	// FIX-IT: Red Master - https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pipelines/results/966651/steps/%7B80f5ea3d-12b6-4a38-9ea4-1d905e177b89%7D#line=7-65461
	it.skip('should clear visibility and overflowX after setting the correct width', async () => {
		const mockWindow = {
			addEventListener: jest.fn(),
		};

		// Setup
		await (async (mockWindow) => {
			// @ts-ignore expected unused. Used to override window object in the eval below
			const window = mockWindow;

			document.body.innerHTML = `
		<div class="ak-renderer-wrapper" style="visibility: hidden; overflow-x: hidden">
		<script data-breakout-script-id="111"></script>
		<div class="ak-renderer-document" data-node-type="mediaSingle" width="100"></div>
		</div>
		`;

			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const renderer = document.querySelector('.ak-renderer-wrapper') as HTMLElement;

			expect(renderer.style.visibility).toEqual('hidden');
			expect(renderer.style.overflowX).toEqual('hidden');

			// eslint-disable-next-line no-eval
			eval(createBreakoutInlineScript(111));

			document.querySelector('.ak-renderer-document')!.innerHTML = `
<!-- comment element should not break the page -->
<div class="pm-table-container" data-mode="custom" style="width:100px"></div>
`;

			await waitForTick();

			// Set some width
			expect(renderer.style.visibility).toEqual('');
			expect(renderer.style.overflowX).toEqual('');
		})(mockWindow);
	});
});
