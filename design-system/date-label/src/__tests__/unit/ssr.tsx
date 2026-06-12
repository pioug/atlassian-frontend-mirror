/* eslint-disable no-console */
import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

jest.spyOn(console, 'error').mockImplementation(() => {});

afterEach(() => {
	jest.resetAllMocks();
});

test('should ssr then hydrate example component correctly', async () => {
	const examplePath = require.resolve('../../../examples/0-basic');
	const elem = document.createElement('div');
	const { html, styles } = await ssr(examplePath);
	elem.innerHTML = html;

	await hydrateWithAct(examplePath, elem, styles, true);

	// Assert there's no hydration errors
	const mockCalls = (console.error as jest.Mock).mock.calls;
	expect(mockCalls.length).toBe(0);

	cleanup();
});

test('should ssr then hydrate dropdown trigger example correctly', async () => {
	const examplePath = require.resolve('../../../examples/4-dropdown-trigger');
	const elem = document.createElement('div');
	const { html, styles } = await ssr(examplePath);
	elem.innerHTML = html;

	await hydrateWithAct(examplePath, elem, styles, true);

	// Assert there's no hydration errors
	const mockCalls = (console.error as jest.Mock).mock.calls;
	expect(mockCalls.length).toBe(0);

	cleanup();
});
