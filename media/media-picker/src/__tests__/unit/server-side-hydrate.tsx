/* eslint-disable no-console */
import { screen } from '@testing-library/react';

import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

test('should ssr then hydrate correctly', async () => {
	const examplePath = require.resolve('../../../examples/1-dropzone.tsx');
	const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => {});
	const elem = document.createElement('div');
	const { html, styles } = await ssr(examplePath);
	elem.innerHTML = html;
	await hydrateWithAct(examplePath, elem, styles);

	expect(await screen.findByText('Media Feature Flags')).toBeInTheDocument();

	// NOTE: This component has serious issues with both Emotion and regular SSR hydration in React 18:
	const hydrationErrors = [
		/There was an error while hydrating\. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering\./,
		/An error occurred during hydration\. The server HTML was replaced with client content in <%s>/,
		/Expected server HTML to contain a matching <%s> in <%s>/,
		/Hydration failed because the initial UI does not match what was rendered on the server/,
		/Expected server HTML to contain a matching.*created by EmotionCssPropInternal/,
		/useLayoutEffect does nothing on the server/,
	];
	const mockCalls = (console.error as jest.Mock).mock.calls.filter((call) => {
		if (hydrationErrors.some((regex) => regex.test(call.toString()))) {
			return false;
		}

		return true;
	});

	// Logs console errors if they exist to quickly surface errors for debuggin in CI
	if (mockCalls.length) {
		console.warn('Hydration errors:');
		mockCalls.forEach((call) => call && console.warn(call.toString()));
	}

	expect(mockCalls.length).toBe(0);

	cleanup();
	consoleMock.mockRestore();
});
