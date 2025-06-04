import React from 'react';

import { doesHydrateWithSsr } from '@atlassian/ssr-tests';

describe('Server side hydration', () => {
	test('should ssr then hydrate correctly', async () => {
		const Example = require(`../../../examples/0-basic`).default;
		expect(await doesHydrateWithSsr(<Example />)).toBe(true);
	});
});
