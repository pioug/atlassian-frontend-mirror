import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { Spotlight, SpotlightManager, SpotlightTarget, SpotlightTransition } from '../../index';

function renderSpotlight() {
	render(
		<SpotlightManager>
			<SpotlightTarget name="target">
				<button type="button">Target</button>
			</SpotlightTarget>
			<SpotlightTransition>
				<Spotlight
					actions={[{ text: 'Got it' }]}
					heading="Heading"
					target="target"
					testId="spotlight"
				>
					Body
				</Spotlight>
			</SpotlightTransition>
		</SpotlightManager>,
	);
}

function getCardLevel(): string | null {
	// eslint-disable-next-line testing-library/no-node-access -- The level is only exposed as a data attribute on the card.
	return (
		screen.getByText('Body').closest('[data-ds--level]')?.getAttribute('data-ds--level') ?? null
	);
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Spotlight layering', () => {
	it('flag OFF - the spotlight card is on layer level 1', () => {
		failGate('platform-dst-top-layer');
		renderSpotlight();
		expect(getCardLevel()).toBe('1');
	});

	it('flag ON - the spotlight does not use layering', () => {
		passGate('platform-dst-top-layer');
		renderSpotlight();
		expect(getCardLevel()).toBe('0');
	});
});
