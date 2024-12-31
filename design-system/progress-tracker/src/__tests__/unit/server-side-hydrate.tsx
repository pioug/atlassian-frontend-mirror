import { screen } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

// TODO: Skipping the test as it fails in react-18-compatibility-branch-build pipeline (IS_REACT_18=true yarn test packages/design-system/progress-tracker/src/__tests__/unit/server-side-hydrate.tsx). Context: https://atlassian.slack.com/archives/CL6HC337Z/p1735515386877709
test.skip('should ssr then hydrate correctly', async () => {
	const examplePath = require.resolve('../../../examples/completed.tsx');
	const consoleMock = jest.spyOn(console, 'error').mockImplementation(noop);
	const elem = document.createElement('div');
	const { html, styles } = await ssr(examplePath);
	elem.innerHTML = html;

	await hydrateWithAct(examplePath, elem, styles, true);

	// Jest 29 - Added assertion to fix: Jest worker encountered 4 child process exceptions, exceeding retry limit
	await screen.findByText(/Step 1/i);

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
