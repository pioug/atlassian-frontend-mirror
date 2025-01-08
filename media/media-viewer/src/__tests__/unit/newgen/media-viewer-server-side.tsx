/* eslint-disable no-console */
import { screen } from '@testing-library/react';

import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

test('should ssr then hydrate correctly', async () => {
	const examplePath = require.resolve('../../../../examples/0-basic-example');
	const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => {});
	const elem = document.createElement('div');
	const { html, styles } = await ssr(examplePath);
	elem.innerHTML = html;
	await hydrateWithAct(examplePath, elem, styles);

	expect(await screen.findByText('Preview Unavailable')).toBeInTheDocument();

	// NOTE: This test has issues with `act()` warnings for an unexpected reason
	const mockCalls = (console.error as jest.Mock).mock.calls.filter(([callText]) => {
		return !callText.includes("It looks like you're using the wrong act()");
	});

	// Logs console errors if they exist to quickly surface errors for debuggin in CI
	if (mockCalls.length) {
		console.warn('Hydration errors:');
		mockCalls.forEach((call) => console.warn(call));
	}

	expect(mockCalls.length).toBe(0);

	cleanup();
	consoleMock.mockRestore();
});
