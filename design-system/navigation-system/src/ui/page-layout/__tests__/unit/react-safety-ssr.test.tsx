import React from 'react';

import { doesHydrateWithSsr, doesRenderWithSsr } from '@atlassian/ssr-tests';
import { resetMatchMedia } from '@atlassian/test-utils';

import CompositionExample from '../../../../../examples/composition';

beforeEach(() => {
	resetMatchMedia();
});

/**
 * The SSR safety tests are placed in a separate file to avoid conflicts with other tests.
 * For example, running in the same test suite as tests with `toPassStrictMode()` will cause the following error:
 * "Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."
 *
 * This appears to be because:
 * - `toPassStrictMode` test uses `jest.isolateModulesAsync` with `createRoot`
 * - `doesHydrateWithSsr` test uses `hydrateRoot`
 *
 * There might be a better solution for this, but placing them in separate test modules is a simple workaround
 * for now.
 *
 * Alternative solutions that also appear to "fix" the issue, but are not ideal:
 * - Removing `jest.isolateModulesAsync` from `toPassStrictMode` test
 * - Moving `const { render } = require('./harness');` out of the isolated callback in `toPassStrictMode`, and importing it in the module
 * - Using `hydrateRoot` in `toPassStrictMode` test instead of `createRoot`
 */

it('should be able to be server side rendered (SSR)', async () => {
	expect(await doesRenderWithSsr(<CompositionExample />)).toBe(true);
});

it('should be able to be hydrated after server side rendered (SSR)', async () => {
	expect(await doesHydrateWithSsr(<CompositionExample />)).toBe(true);
});
