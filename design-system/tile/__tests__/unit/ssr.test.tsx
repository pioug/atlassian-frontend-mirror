/* eslint-disable no-console */
import { screen } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

jest.spyOn(console, 'error').mockImplementation(__noop);

afterEach(() => {
	jest.resetAllMocks();
});

test('should ssr then hydrate example component correctly', async () => {
	const examplePath = require.resolve('../../examples/basic');
	const elem = document.createElement('div');
	const { html, styles } = await ssr(examplePath);
	elem.innerHTML = html;

	await hydrateWithAct(examplePath, elem, styles, true);

	// Wait for our actual component to render following hydration
	await screen.findAllByTestId('tile');

	// Assert there's no hydration errors
	const mockCalls = (console.error as jest.Mock).mock.calls;
	expect(mockCalls.length).toBe(0);

	cleanup();
});
