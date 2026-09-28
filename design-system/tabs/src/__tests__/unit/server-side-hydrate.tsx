import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { doesHydrateWithSsr } from '@atlassian/ssr-tests';

import Example from '../../../examples/00-default-tabs.vr.ap';

const motionGate = 'platform-dst-motion-uplift-tab';

test('should ssr then hydrate legacy tabs correctly when the motion gate is off', async () => {
	failGate(motionGate);
	expect(await doesHydrateWithSsr(<Example />)).toBe(true);
});

test('should ssr then hydrate motion tabs correctly when the motion gate is on', async () => {
	passGate(motionGate);
	expect(await doesHydrateWithSsr(<Example />)).toBe(true);
});

test('should ssr then hydrate motion tabs correctly when reduced motion is preferred', async () => {
	passGate(motionGate);
	const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockImplementation(
		(query: string) =>
			({
				matches: query === '(prefers-reduced-motion: reduce)',
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
		expect(await doesHydrateWithSsr(<Example />)).toBe(true);
	} finally {
		matchMediaSpy.mockRestore();
	}
});
