import React from 'react';

import { hydrateWithSsr } from '@atlassian/ssr-tests/ssr-tests';

import Example from '../../../examples/0-basic';

test('hydrates without errors', async () => {
	const { passed, collatedErrors } = await hydrateWithSsr(<Example />);

	expect(passed).toBe(true);
	expect(collatedErrors).toEqual([]);
});
