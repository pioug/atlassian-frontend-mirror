import React from 'react';

import { resetMatchMedia } from '@atlassian/test-utils';

import CompositionExample from '../../../../../examples/composition';

beforeEach(() => {
	resetMatchMedia();
});

it('should support being suspended', async () => {
	await expect(() => <CompositionExample />).toBeSuspendable();
});

it('should be strict mode compliant', async () => {
	await expect(() => <CompositionExample />).toPassStrictMode();
});
