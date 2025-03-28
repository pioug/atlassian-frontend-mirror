import React from 'react';

import { doesHydrateWithSsr } from '@atlassian/ssr-tests';

import Example from '../../../examples/00-default-tabs';

test('should ssr then hydrate tabs correctly', async () => {
	expect(await doesHydrateWithSsr(<Example />)).toBe(true);
});
