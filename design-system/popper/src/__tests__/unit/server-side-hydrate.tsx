import { act } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

// skipping this test as it does not work with jsdom.reconfigure. Need to rewrite this test.
// https://hello.jira.atlassian.cloud/browse/UTEST-2000
test.skip('should ssr then hydrate correctly', async () => {
	const examplePath = require.resolve('../../../examples/00-basic-positioning.tsx');
	const consoleMock = jest.spyOn(console, 'error').mockImplementation(noop);
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
