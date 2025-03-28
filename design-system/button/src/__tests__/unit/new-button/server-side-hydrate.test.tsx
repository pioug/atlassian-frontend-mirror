import React from 'react';

import { doesHydrateWithSsr } from '@atlassian/ssr-tests';

import ButtonExample from '../../../../examples/05-button';
import IconButtonExample from '../../../../examples/07-icon-button';

test('should ssr then hydrate correctly', async () => {
	expect(await doesHydrateWithSsr(<ButtonExample />)).toBe(true);
});

test('should ssr then hydrate correctly', async () => {
	expect(await doesHydrateWithSsr(<IconButtonExample />)).toBe(true);
});
