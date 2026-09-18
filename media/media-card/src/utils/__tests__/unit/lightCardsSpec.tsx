import React from 'react';

import { IntlProvider } from 'react-intl';

import { render, screen } from '@atlassian/testing-library';

import { CardError } from '../../lightCards/cardError';
import { CardLoading } from '../../lightCards/cardLoading';
import { getDimensionsWithDefault } from '../../lightCards/getDimensionsWithDefault';

// `CardLoading` renders `LoadingBar`, which localises its aria-label via `useIntl`.
const renderWithIntl = (ui: React.ReactElement) =>
	render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('<CardLoading />', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(<CardLoading />);
		await expect(container).toBeAccessible();
	});

	it('should render loading indicator', () => {
		renderWithIntl(<CardLoading />);
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
