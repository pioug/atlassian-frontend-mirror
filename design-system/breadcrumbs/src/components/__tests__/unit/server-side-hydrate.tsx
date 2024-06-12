import { act, waitFor } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

test('should ssr then hydrate breadcrumbs correctly', async () => {
	const breadcrumbsPath = require.resolve('../../../../examples/0-basic.tsx');
	const consoleMock = jest.spyOn(console, 'error').mockImplementation(__noop);

	const elem = document.createElement('div');
	const { html, styles } = await ssr(breadcrumbsPath);
	elem.innerHTML = html;
	await waitFor(async () => await hydrateWithAct(breadcrumbsPath, elem, styles, true));

	await act(async () => {
		// eslint-disable-next-line no-console
		const mockCalls = (console.error as jest.Mock).mock.calls;
		expect(mockCalls.length).toBe(0);
	});

	cleanup();
	consoleMock.mockRestore();
});
