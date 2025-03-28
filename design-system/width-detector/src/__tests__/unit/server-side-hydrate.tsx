import React from 'react';

import { hydrateWithSsr } from '@atlassian/ssr-tests';

import Example from '../../../examples/0-basic';

// This package either needs to be fixed or removed.
test.skip('FAILS SSR HYDRATION', async () => {
	const { passed, collatedErrors } = await hydrateWithSsr(<Example />);

	expect(passed).toBe(false);
	expect(collatedErrors).toEqual([
		expect.stringContaining('Warning: Text content did not match. Server: "1" Client: "2"'),
		expect.stringContaining(
			'Warning: An error occurred during hydration. The server HTML was replaced with client content in <div>.',
		),
	]);
});
