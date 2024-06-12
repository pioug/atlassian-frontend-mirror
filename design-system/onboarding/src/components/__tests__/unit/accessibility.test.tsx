import React from 'react';

import { render } from '@testing-library/react';
import Lorem from 'react-lorem-component';

import { axe } from '@af/accessibility-testing';

import welcomeImage from '../../../../examples/assets/this-is-new-jira.png';
import { ModalTransition } from '../../../../src';
import { Modal, Spotlight, SpotlightCard } from '../../index';

// Basic test
it('SpotlightCard should pass basic axe audit', async () => {
	const { container } = render(<SpotlightCard>This is a basic spotlight card</SpotlightCard>);
	await axe(container);
});

it('BasicSpotlight should pass basic axe audit', async () => {
	const { container } = render(
		<Spotlight
			actions={[{ text: 'Got it' }]}
			dialogPlacement="bottom right"
			heading="Red"
			target="red"
			key="red"
		>
			<Lorem count={1} />
		</Spotlight>,
	);
	await axe(container);
});

it('BenefitsModal should pass basic axe audit', async () => {
	const { container } = render(
		<ModalTransition>
			<Modal
				actions={[
					{
						text: 'Get started',
					},
					{ text: 'Remind me later' },
				]}
				heading="Experience the new Jira"
				image={welcomeImage}
				key="welcome"
			>
				<p>
					Check out our restructured interface and a bold, colorful design that reflects the
					vibrance of your team. Try it out early and get a chance to influence how we build the
					next generation of Atlassian.
				</p>
			</Modal>
		</ModalTransition>,
	);
	await axe(container);
});
