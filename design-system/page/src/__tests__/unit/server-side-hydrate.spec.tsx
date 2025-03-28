import React from 'react';

import { doesHydrateWithSsr } from '@atlassian/ssr-tests';

import Example from '../../../examples/00-basic-usage';

test('should ssr then hydrate page correctly', async () => {
	expect(await doesHydrateWithSsr(<Example />)).toBe(true);
});
