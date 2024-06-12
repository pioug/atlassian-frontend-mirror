import React from 'react';

import { render } from '@testing-library/react';

import Page from '../../index';

describe('<Page />', () => {
	it('page should accept navigation as a property', () => {
		const testId = 'navigation';
		const Navigation = () => <span data-testid={testId}>Navigation</span>;
		const { queryByTestId } = render(<Page navigation={<Navigation />} />);
		expect(queryByTestId(testId)).toBeInTheDocument();
	});

	it('should set aria-hidden to true when banner is not visible', () => {
		const Banner = () => <div>Banner</div>;
		const { getByTestId } = render(<Page banner={<Banner />} isBannerOpen={false} testId="page" />);

		expect(getByTestId('page--banner-container')).toHaveAttribute('aria-hidden', 'true');
	});

	it('should set aria-hidden to false when banner is visible', () => {
		const Banner = () => <div>Banner</div>;
		const { getByTestId } = render(<Page banner={<Banner />} isBannerOpen testId="page" />);

		expect(getByTestId('page--banner-container')).toHaveAttribute('aria-hidden', 'false');
	});
});
