import React from 'react';

import { doesHydrateWithSsr } from '@atlassian/ssr-tests';

import Example from '../../../examples/curves';
import UseMotionExample from '../../../examples/use-motion-custom';

test('should ssr then hydrate correctly', async () => {
	expect(await doesHydrateWithSsr(<Example />)).toBe(true);
});

test('useMotion should ssr then hydrate correctly', async () => {
	expect(await doesHydrateWithSsr(<UseMotionExample />)).toBe(true);
});

test('useMotion should ssr then hydrate correctly when reduced motion is preferred', async () => {
	// On the server `window` is undefined, so `isReducedMotion()` returns `false` and the
	// server always renders the animating markup. On a client that prefers reduced motion
	// `isReducedMotion()` returns `true` and animation styles are skipped. This test guards
	// against that server/client divergence causing a hydration mismatch.
	const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockImplementation(
		(query: string) =>
			({
				matches: query.includes('prefers-reduced-motion'),
				media: query,
				onchange: null,
				addListener: jest.fn(),
				removeListener: jest.fn(),
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			}) as unknown as MediaQueryList,
	);

	try {
		expect(await doesHydrateWithSsr(<UseMotionExample />)).toBe(true);
	} finally {
		matchMediaSpy.mockRestore();
	}
});
