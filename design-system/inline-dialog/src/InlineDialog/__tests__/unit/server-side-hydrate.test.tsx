import noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

// FIXME: jest 29 upgrade - expect(received).toBe(expected) // Object.is equality
test.skip('should ssr then hydrate correctly', async () => {
	const examplePath = require.resolve('../../../../examples/01-default.tsx');
	const consoleMock = jest.spyOn(console, 'error').mockImplementation(noop);
	const elem = document.createElement('div');
	const { html, styles } = await ssr(examplePath);
	elem.innerHTML = html;
	hydrateWithAct(examplePath, elem, styles);

	// eslint-disable-next-line no-console
	const mockCalls = (console.error as jest.Mock).mock.calls;

	// Logs console errors if they exist to quickly surface errors for debuggin in CI
	if (mockCalls.length) {
		console.warn('Hydration errors:');
		mockCalls.forEach((call) => console.warn(call));
	}

	expect(mockCalls.length).toBe(0);

	cleanup();
	consoleMock.mockRestore();
});
