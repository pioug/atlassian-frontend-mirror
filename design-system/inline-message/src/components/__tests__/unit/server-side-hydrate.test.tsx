import React from 'react';

import { hydrateWithSsr } from '@atlassian/ssr-tests';

import Example from '../../../../examples/01-basic';

test('should ssr then hydrate correctly', async () => {
	const { passed, collatedErrors } = await hydrateWithSsr(<Example />);
	expect(passed).toBe(false);
	expect(collatedErrors).toEqual([
		expect.stringMatching(/Warning: useLayoutEffect does nothing on the server/),
		expect.stringMatching(/Warning: useLayoutEffect does nothing on the server/),
		expect.stringMatching(/Warning: useLayoutEffect does nothing on the server/),
		expect.stringMatching(/Warning: useLayoutEffect does nothing on the server/),
	]);
});
