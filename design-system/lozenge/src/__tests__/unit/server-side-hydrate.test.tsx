import React from 'react';

import { doesHydrateWithSsr } from '@atlassian/ssr-tests';

describe.each(['0-basic', '0-basic-compiled'])('variant=%p', (exampleName) => {
	test('should ssr then hydrate correctly', async () => {
		const Example = require(`../../../examples/${exampleName}`).default;
		expect(await doesHydrateWithSsr(<Example />)).toBe(true);
	});
});
