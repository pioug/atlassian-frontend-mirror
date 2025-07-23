import React from 'react';

import CompositionExample from '../../../../../examples/composition';

beforeEach(() => {
	resetMatchMedia();
});

import { resetMatchMedia, runSuspenseTest } from './_test-utils';

it('should support being suspended', async () => {
	await runSuspenseTest(<CompositionExample />);
});
