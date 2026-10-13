import React from 'react';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { doesHydrateWithSsr } from '@atlassian/ssr-tests';

import Example from '../../../examples/0-stateful.vr.ap';

test('should ssr then hydrate correctly', async () => {
	passGate('platform_design_system_toggle_motion');
	expect(await doesHydrateWithSsr(<Example />)).toBe(true);
});
