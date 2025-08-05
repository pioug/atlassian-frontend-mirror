import React from 'react';

import { toBeSuspendable } from '@af/react-unit-testing';

import CompositionExample from '../../../../../examples/composition';

import { resetMatchMedia } from './_test-utils';

beforeEach(() => {
	resetMatchMedia();
});

// TODO: move to `jestFrameworkSetup.js` in follow up pull request
expect.extend({
	toBeSuspendable,
});

it('should support being suspended', async () => {
	await expect(() => <CompositionExample />).toBeSuspendable();
});
