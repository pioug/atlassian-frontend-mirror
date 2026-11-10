import React from 'react';

import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags/setBooleanFeatureFlagResolver';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { Modal } from '../../index';

const HEADING = 'Experience your new tools';

const renderModal = () =>
	render(
		<Modal heading={HEADING} actions={[{ onClick: () => {}, text: 'Switch' }]}>
			<p>Body</p>
		</Modal>,
	);

describe('platform_dst-modal_title_phase2', () => {
	afterEach(() => {
		setBooleanFeatureFlagResolver(() => false);
	});

	it('names the dialog by its heading when the flag is off', () => {
		setBooleanFeatureFlagResolver(() => false);
		renderModal();
		const heading = screen.getByRole('heading', { level: 1, name: HEADING });
		expect(screen.getByRole('dialog', { name: HEADING })).toHaveAttribute(
			'aria-labelledby',
			heading.id,
		);
	});

	it('names the dialog through ModalTitle when the flag is on', () => {
		setBooleanFeatureFlagResolver((flag) => flag === 'platform_dst-modal_title_phase2');
		renderModal();
		const heading = screen.getByRole('heading', { level: 1, name: HEADING });
		// ModalTitle puts the title id on an inner span, not on the h1 itself.
		expect(screen.getByRole('dialog', { name: HEADING })).not.toHaveAttribute(
			'aria-labelledby',
			heading.id,
		);
		expect(heading).toHaveTextContent(HEADING);
	});
});
