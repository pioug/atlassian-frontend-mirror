import React from 'react';

import { render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import WarningIcon from '@atlaskit/icon/core/migration/status-warning--warning';

import Banner from '../../banner';

describe('a11y', () => {
	it('Default banner with icon should not fail an aXe audit', async () => {
		const { container } = render(
			<Banner icon={<WarningIcon label="" color="currentColor" />}>
				Your license is about to expire.
			</Banner>,
		);
		expect(screen.getByRole('alert')).toBeInTheDocument();
		await axe(container);
	});

	it('Warning banner should not fail an aXe audit', async () => {
		const { container } = render(<Banner appearance="warning">Simple warning banner</Banner>);
		await axe(container);
	});

	it('Announcement banner should not fail an aXe audit', async () => {
		const { container } = render(
			<Banner appearance="announcement">Simple announcement banner</Banner>,
		);
		await axe(container);
	});

	it('Error banner should not fail an aXe audit', async () => {
		const { container } = render(<Banner appearance="error">Simple error banner</Banner>);
		await axe(container);
	});
});
