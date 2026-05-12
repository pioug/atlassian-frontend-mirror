import React from 'react';
import { render, screen } from '@atlassian/testing-library';

import { CardLoading } from '../../lightCards/cardLoading';
import { CardError } from '../../lightCards/cardError';
import { getDimensionsWithDefault } from '../../lightCards/getDimensionsWithDefault';

describe('<CardLoading />', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<CardLoading />);
		await expect(container).toBeAccessible();
	});

	it('should render spinner', () => {
		render(<CardLoading />);
		expect(screen.getByTestId('media-card-loading')).toBeInTheDocument();
	});

	describe('getDimensionsWithDefault()', () => {
		it('should use default ones when no dimensions provided', () => {
			expect(getDimensionsWithDefault()).toEqual({
				width: '100%',
				height: '100%',
			});
		});

		it('should use pixel units for provided dimensions', () => {
			expect(getDimensionsWithDefault({ width: 50, height: 50 })).toEqual({
				width: '50px',
				height: '50px',
			});
		});
	});
});

describe('<CardError />', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<CardError />);
		await expect(container).toBeAccessible();
	});

	it('should render the right icon based on the itemType', () => {
		render(<CardError />);
		expect(screen.getByLabelText('Error')).toBeInTheDocument();
	});

	describe('getDimensionsWithDefault()', () => {
		it('should use default ones when no dimensions provided', () => {
			expect(getDimensionsWithDefault()).toEqual({
				width: '100%',
				height: '100%',
			});
		});

		it('should use pixel units for provided dimensions', () => {
			expect(getDimensionsWithDefault({ width: 50, height: 50 })).toEqual({
				width: '50px',
				height: '50px',
			});
		});
	});
});
