import React from 'react';

import { doesHydrateWithSsr } from '@atlassian/ssr-tests';

import Example from '../../../examples/controlled-expanded-state';

test('should ssr then hydrate table-tree correctly', async () => {
	expect(await doesHydrateWithSsr(<Example />)).toBe(true);
});
