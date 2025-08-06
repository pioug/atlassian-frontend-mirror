import React from 'react';

import { toBeSuspendable, toPassStrictMode } from '@af/react-unit-testing';

import CompositionExample from '../../../../../examples/composition';

import { resetMatchMedia } from './_test-utils';

beforeEach(() => {
	resetMatchMedia();
});

// TODO: move to `jestFrameworkSetup.js` in follow up pull request
expect.extend({
	toBeSuspendable,
	toPassStrictMode,
});

it('should support being suspended', async () => {
	await expect(() => <CompositionExample />).toBeSuspendable();
});

it('should be strict mode compliant', async () => {
	await expect(() => <CompositionExample />).toPassStrictMode();
});
