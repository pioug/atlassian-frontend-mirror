import { screen } from '@testing-library/react';

import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

describe('SSR - Resourced Task Item', () => {
	const examplePath = require.resolve('../../../../examples/04-resourced-task-item');

	beforeEach(() => {
		jest.spyOn(global.console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		// Clean-up SSR Emotion styles
		cleanup();
		// Reset mock data
		jest.clearAllMocks();
	});

	test('rendering and hydration are ok', async () => {
		const elem = document.createElement('div');
		const { html, styles } = await ssr(examplePath);

		elem.innerHTML = html;
		await hydrateWithAct(examplePath, elem, styles);

		// Jest 29 - Added assertion to fix: Jest worker encountered 4 child process exceptions, exceeding retry limit
		await screen.findAllByRole('checkbox');

		// No other errors from e.g. hydrate (allow SSR warnings about useLayoutEffect)
		// eslint-disable-next-line no-console
		const mockCalls = (console.error as jest.Mock).mock.calls;
		const actualErrors = mockCalls.filter(
			([message]) => !message.includes('useLayoutEffect does nothing on the server'),
		);
		expect(actualErrors).toHaveLength(0);
	});
});
