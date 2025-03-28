import React from 'react';

import { hydrateWithSsr } from '@atlassian/ssr-tests';

import Example from '../../../examples/0-basic';

test('should ssr then hydrate correctly', async () => {
	const { passed, collatedErrors } = await hydrateWithSsr(<Example />);

	expect(passed).toBe(false);
	expect(collatedErrors).toEqual([
		expect.stringContaining('Warning: useLayoutEffect does nothing on the server'),
	]);
});
