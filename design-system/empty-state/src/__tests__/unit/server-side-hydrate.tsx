import React from 'react';

import { doesHydrateWithSsr } from '@atlassian/ssr-tests';

import Example from '../../../examples/0-basic';

// Failing in master consistently
// https://atlassian.slack.com/archives/CFJ9DU39U/p1745909559694539
test.skip('should ssr then hydrate correctly', async () => {
	expect(await doesHydrateWithSsr(<Example />)).toBe(true);
});
