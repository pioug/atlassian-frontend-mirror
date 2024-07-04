import { screen, waitFor } from '@testing-library/react';

import { cleanup, hydrate, ssr } from '@atlaskit/ssr/emotion';

jest.spyOn(global.console, 'error').mockImplementation(() => {});

const examplePath = require.resolve('../../../examples/01-feedback-form.tsx');

afterEach(() => {
	// Check cleanup
	cleanup();
	// reset mocks
	jest.resetAllMocks();
});

test('should ssr then hydrate feedback-collector correctly', async () => {
	const elem = document.createElement('div');
	const { html, styles } = await ssr(examplePath);

	elem.innerHTML = html;
	hydrate(examplePath, elem, styles);

	// Jest 29 - Added assertion to fix: Jest worker encountered 4 child process exceptions, exceeding retry limit
	await waitFor(() => screen.getByRole('button'));

	// No other errors from e.g. hydrate
	// eslint-disable-next-line no-console
	const mockCalls = (console.error as jest.Mock).mock.calls;
	expect(mockCalls.length).toBe(0);
});
