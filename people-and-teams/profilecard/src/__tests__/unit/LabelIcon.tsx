import React from 'react';

import { render, screen } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

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

		describe('ptc_a11y_profile_card_text_spacing is on text spacing fix on', () => {
			it('should wrap long details text instead of clipping it', () => {
				passGate('ptc_a11y_profile_card_text_spacing');

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

		describe('ptc_a11y_profile_card_text_spacing is off text spacing fix off', () => {
			it('should clip long details text', () => {
				failGate('ptc_a11y_profile_card_text_spacing');

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
