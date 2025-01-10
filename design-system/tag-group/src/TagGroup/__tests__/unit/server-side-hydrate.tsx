import { screen } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

test('should ssr then hydrate correctly', async () => {
	const examplePath = require.resolve('../../../../examples/0-basic.tsx');
	const consoleMock = jest.spyOn(console, 'error').mockImplementation(noop);
	const elem = document.createElement('div');
	const { html, styles } = await ssr(examplePath);
	elem.innerHTML = html;
	await hydrateWithAct(examplePath, elem, styles);

	// Jest 29 - Added assertion to fix: Jest worker encountered 4 child process exceptions, exceeding retry limit
	await screen.findAllByRole('button');

	// useLayoutEffect gets called in running the example,
	// but doesn't get properly replaced with useEffect in SSR
	// as the ssr() function still defines `window` and `document`
	const useLayoutHydrationError = /useLayoutEffect does nothing on the server/;

	// eslint-disable-next-line no-console
	const mockCalls = (console.error as jest.Mock).mock.calls.filter(
		(message) => !useLayoutHydrationError.test(message),
	);

	// Logs console errors if they exist to quickly surface errors for debugging in CI
	if (mockCalls.length) {
		console.warn('Hydration errors:');
		mockCalls.forEach((call) => console.warn(call));
	}

	expect(mockCalls.length).toBe(0);

	cleanup();
	consoleMock.mockRestore();
});
