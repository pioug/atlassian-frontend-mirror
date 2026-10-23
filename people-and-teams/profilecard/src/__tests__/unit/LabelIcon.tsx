import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils/test-runner';

import { default as IconLabel } from '../../components/Icon/IconLabel';

describe('Profilecard', () => {
	describe('IconLabel', () => {
		it('should render no label when not children are present', () => {
			render(<IconLabel />);
			expect(screen.queryByText(/./)).not.toBeInTheDocument();
		});

		it('should render LabelIcon without icon when icon property is not set', () => {
			render(<IconLabel>Labeltext</IconLabel>);
			expect(screen.getByText('Labeltext')).toBeVisible();
			expect(screen.queryByRole('img')).not.toBeInTheDocument();
		});

		it('should render LabelIcon without icon when icon property is an unavailable icon', () => {
			render(<IconLabel icon="foobar">Labeltext</IconLabel>);
			expect(screen.getByText('Labeltext')).toBeVisible();
			expect(screen.queryByRole('img')).not.toBeInTheDocument();
		});

		describe('should render LabelIcon with valid icons', () => {
			const validIcons = ['location', 'time', 'email'];

			validIcons.forEach((label, index) => {
				it(`should render LabelIcon for ${label}`, () => {
					render(<IconLabel icon={label}>Labeltext</IconLabel>);
					expect(screen.getByText('Labeltext')).toBeVisible();
					expect(screen.getByRole('img')).toBeVisible();
					expect(screen.getByRole('img')).toHaveAttribute('aria-label', validIcons[index]);
				});
			});
		});

		ffTest.on('ptc_a11y_profile_card_text_spacing', 'text spacing fix on', () => {
			it('should wrap long details text instead of clipping it', () => {
				render(
					<dl>
						<IconLabel icon="email" isDescriptionListItem>
							Labeltext
						</IconLabel>
					</dl>,
				);
				expect(screen.getByText('Labeltext')).toHaveCompiledCss('overflow-wrap', 'anywhere');
				expect(screen.getByText('Labeltext')).toHaveCompiledCss('overflow-x', 'visible');
			});
		});

		ffTest.off('ptc_a11y_profile_card_text_spacing', 'text spacing fix off', () => {
			it('should clip long details text', () => {
				render(
					<dl>
						<IconLabel icon="email" isDescriptionListItem>
							Labeltext
						</IconLabel>
					</dl>,
				);
				expect(screen.getByText('Labeltext')).toHaveCompiledCss('overflow-x', 'hidden');
			});
		});

		it('should capture and report a11y violations', async () => {
			const { container } = render(<IconLabel icon="location">Labeltext</IconLabel>);
			await expect(container).toBeAccessible();
		});
	});
});
