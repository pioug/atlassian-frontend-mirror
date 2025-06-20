import React from 'react';

import { render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import { BadgeContainer } from '../../badge-container';
import { List } from '../../list';

describe('BadgeContainer', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<List>
				<BadgeContainer id="test-badge-id" badge={() => <div>100</div>}>
					Badge children
				</BadgeContainer>
			</List>,
		);

		await axe(container);
	});

	it('should display children', () => {
		render(
			<BadgeContainer id="test-badge-id" badge={() => <div>100</div>}>
				Badge children
			</BadgeContainer>,
		);

		expect(screen.getByText('Badge children')).toBeVisible();
	});

	it('should display badge', () => {
		render(
			<BadgeContainer id="test-badge-id" badge={() => <div>100</div>}>
				Badge children
			</BadgeContainer>,
		);

		expect(screen.getByText('100')).toBeVisible();
	});

	it('should use listitem role by default', () => {
		render(
			<BadgeContainer id="test-badge-id" badge={() => <div>100</div>}>
				Badge children
			</BadgeContainer>,
		);

		expect(screen.getByRole('listitem')).toBeVisible();
	});

	it('should not use listitem role when set to false', () => {
		render(
			<BadgeContainer id="test-badge-id" badge={() => <div>100</div>} isListItem={false}>
				Badge children
			</BadgeContainer>,
		);

		expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
	});
});
