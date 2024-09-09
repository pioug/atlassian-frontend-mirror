import { act } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

declare var global: any;

jest.spyOn(global.console, 'error').mockImplementation(__noop);

afterEach(() => {
	jest.resetAllMocks();
});

test('should ssr then hydrate example component correctly', async () => {
	const examplePath = require.resolve('../../../examples/02-all-icons.tsx');
	const consoleMock = jest.spyOn(console, 'error').mockImplementation(__noop);
	const elem = document.createElement('div');
	const { html, styles } = await ssr(examplePath);
	elem.innerHTML = html;
	await hydrateWithAct(examplePath, elem, styles, true);
	await act(async () => {
		// eslint-disable-next-line no-console
		const mockCalls = (console.error as jest.Mock).mock.calls;
		expect(mockCalls.length).toBe(0);
		cleanup();
		consoleMock.mockRestore();
	});
});
