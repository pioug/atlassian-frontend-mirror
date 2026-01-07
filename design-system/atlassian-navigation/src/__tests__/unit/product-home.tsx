import React from 'react';

import { render, screen } from '@testing-library/react';

import { CustomProductHome, ProductHome } from '../../../src';

const testId = 'product-home';
const logoTestId = `${testId}-logo`;
const containerTestId = `${testId}-container`;

/**
 * Gets the var from the logo's parent.
 *
 * It is set on the logo's parent instead of the logo so it can be shared
 * easily with the icon as well.
 */
const getLogoMaxWidthCSSVar = () =>
	screen.getByTestId(containerTestId)?.style.getPropertyValue('--logo-max-width');

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<ProductHome />', () => {
	const icon = jest.fn(() => null);
	const logo = jest.fn(() => null);

	describe('logoMaxWidth', () => {
		it('should set CSS variable with the provided value', () => {
			render(<ProductHome icon={icon} logo={logo} testId={testId} logoMaxWidth={100} />);
			expect(getLogoMaxWidthCSSVar()).toBe('100px');
		});

		it('should be 260px by default', () => {
			render(<ProductHome icon={icon} logo={logo} testId={testId} />);
			expect(getLogoMaxWidthCSSVar()).toBe('260px');
		});
	});

	it('should apply the provided aria-label', () => {
		render(
			<ProductHome
				icon={icon}
				logo={logo}
				testId={testId}
				logoMaxWidth={100}
				aria-label="My product's home"
				href="#"
			/>,
		);
		const link = screen.getByRole('link', { name: "My product's home" });
		expect(link).toHaveAttribute('aria-label', "My product's home");
	});
});

describe('<CustomProductHome />', () => {
	const iconUrl = 'fake-icon.png';
	const logoUrl = 'fake-logo.png';

	describe('logoMaxWidth', () => {
		it('should set max-width with the provided value', () => {
			render(
				<CustomProductHome
					iconUrl={iconUrl}
					iconAlt=""
					logoUrl={logoUrl}
					logoAlt=""
					testId={testId}
					logoMaxWidth={100}
				/>,
			);
			const logoElement = screen.getByTestId(logoTestId);
			expect(logoElement).toHaveStyle({ maxWidth: '100px' });
		});

		it('should be 260px by default', () => {
			render(
				<CustomProductHome
					iconUrl={iconUrl}
					iconAlt=""
					logoUrl={logoUrl}
					logoAlt=""
					testId={testId}
				/>,
			);
			const logoElement = screen.getByTestId(logoTestId);
			expect(logoElement).toHaveStyle({ maxWidth: '260px' });
		});
	});
});
