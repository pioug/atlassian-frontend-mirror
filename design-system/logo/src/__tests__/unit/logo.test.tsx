import React from 'react';

import { render, screen } from '@testing-library/react';

import { AtlassianLogo } from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Logo component', () => {
	it('should be an svg', () => {
		const { container } = render(<AtlassianLogo />);
		// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	describe('when it is unlabelled', () => {
		it('should have a no role', () => {
			const testId = 'no-role';
			render(<AtlassianLogo label="" testId={testId} />);

			const wrapper = screen.getByTestId(`${testId}--wrapper`);
			expect(wrapper).not.toHaveAttribute('role');
		});
	});

	describe('when it is labelled', () => {
		it('should have an img role', () => {
			const label = 'A test label';
			render(<AtlassianLogo label={label} />);
			expect(screen.getByRole('img')).toBeInTheDocument();
		});

		it('should render its label', () => {
			const label = 'A test label';
			render(<AtlassianLogo label={label} />);
			expect(screen.getByRole('img')).toHaveAttribute('aria-label', label);
		});
	});
});
