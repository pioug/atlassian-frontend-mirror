import React from 'react';

import { axe } from '@af/accessibility-testing';
import { render } from '@atlassian/testing-library';

import Badge from '../../../src';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('badge accessibility', () => {
	describe('basic tests', () => {
		it('Basic badge should not fail basic aXe audit', async () => {
			const { container } = render(<Badge>{123}</Badge>);
			await axe(container);
		});

		it('Primary badge should not fail basic aXe audit', async () => {
			const { container } = render(<Badge appearance="primary">{123}</Badge>);
			await axe(container);
		});

		it('Primary inverted badge should not fail basic aXe audit', async () => {
			const { container } = render(<Badge appearance="primaryInverted">{123}</Badge>);
			await axe(container);
		});

		it('Important badge should not fail basic aXe audit', async () => {
			const { container } = render(<Badge appearance="important">{123}</Badge>);
			await axe(container);
		});

		it('Added badge should not fail basic aXe audit', async () => {
			const { container } = render(<Badge appearance="added">+100</Badge>);
			await axe(container);
		});

		it('Removed badge should not fail basic aXe audit', async () => {
			const { container } = render(<Badge appearance="removed">+100</Badge>);
			await axe(container);
		});
	});

	describe('interaction tests', () => {
		it('Badge with max value should not fail an aXe audit', async () => {
			const { container } = render(
				<Badge appearance="added" max={500}>
					{1000}
				</Badge>,
			);
			await axe(container);
		});

		it('Disabled badge should not fail an aXe audit', async () => {
			const { container } = render(
				<Badge appearance="added" max={false}>
					{1000}
				</Badge>,
			);
			await axe(container);
		});
	});
});
