/* eslint-disable no-console */
import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

jest.spyOn(console, 'error').mockImplementation(() => {});

afterEach(() => {
	jest.resetAllMocks();
});

test('should ssr then hydrate popover example correctly', async () => {
	const examplePath = require.resolve('../../examples/01-basic-popover');
	const elem = document.createElement('div');
	const { html, styles } = await ssr(examplePath);
	elem.innerHTML = html;

	await hydrateWithAct(examplePath, elem, styles, true);

	// Filter out known React warnings about the native `popover` attribute and
	// `onToggle` event handler, which React does not fully support in SSR yet.
	// These are expected and will resolve when React adds native popover support.
	const mockCalls = (console.error as jest.Mock).mock.calls.filter((call: unknown[]) => {
		const msg = call.map(String).join(' ');
		return !msg.includes('popover') && !msg.includes('onToggle');
	});
	expect(mockCalls.length).toBe(0);

	cleanup();
});

test('should ssr then hydrate dialog example correctly', async () => {
	const examplePath = require.resolve('../../examples/04-basic-dialog');
	const elem = document.createElement('div');
	const { html, styles } = await ssr(examplePath);
	elem.innerHTML = html;

	await hydrateWithAct(examplePath, elem, styles, true);

	// Filter out known React warnings about the native `<dialog>` element,
	// which React does not fully support in SSR yet (similar to `popover`).
	const mockCalls = (console.error as jest.Mock).mock.calls.filter((call: unknown[]) => {
		const msg = call.map(String).join(' ');
		return !msg.includes('dialog');
	});
	expect(mockCalls.length).toBe(0);

	cleanup();
});
