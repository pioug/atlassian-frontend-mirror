import React from 'react';

import { render, screen, within } from '@testing-library/react';

import Banner from '../../banner';

describe('banner', () => {
	it('basic sanity check', () => {
		render(<Banner testId="banner-basic" />);
		const banner = screen.getByTestId('banner-basic');

		expect(banner).toBeInTheDocument();
	});

	describe('props', () => {
		it('should render children prop', () => {
			render(<Banner testId="banner-text">Testing!</Banner>);
			const { getByText } = within(screen.getByTestId('banner-text'));

			expect(getByText('Testing!')).toBeInTheDocument();
		});
	});
});
