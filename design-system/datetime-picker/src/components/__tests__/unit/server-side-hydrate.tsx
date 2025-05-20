import React from 'react';

import { doesHydrateWithSsr } from '@atlassian/ssr-tests';

import Example from '../../../../examples/00-basic';

// TODO: Fix flaky test. Seems like `react-select` is generating inconsistent ids across server and client
test.skip('should ssr then hydrate correctly', async () => {
	expect(await doesHydrateWithSsr(<Example />)).toBe(true);
});
