import React from 'react';

import CompositionExample from '../../../../../examples/composition';

import { resetMatchMedia } from './_test-utils';

beforeEach(() => {
	resetMatchMedia();
});

it('should support being suspended', async () => {
	await expect(() => <CompositionExample />).toBeSuspendable();
});

it('should be strict mode compliant', async () => {
	await expect(() => <CompositionExample />).toPassStrictMode();
});
