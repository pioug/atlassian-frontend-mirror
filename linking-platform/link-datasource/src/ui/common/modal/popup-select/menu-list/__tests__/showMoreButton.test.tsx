import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import ShowMoreButton from '../showMoreButton';

const mockOnClick = jest.fn();

describe('ShowMoreButton', () => {
	const setup = (filterLabel?: string) =>
		render(
			<IntlProvider locale="en">
				<ShowMoreButton
					onShowMore={mockOnClick}
					filterName={'test-filter'}
					filterLabel={filterLabel}
				/>
			</IntlProvider>,
		);

	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	it('should render with descriptive aria-label when feature flag is enabled and filterLabel exists', async () => {
		const { findByRole } = setup('Test Filter');
		const button = await findByRole('button');

		expect(button).toHaveAttribute('aria-label', 'Show more Test Filter');
	});

	it('should render with generic aria-label when feature flag is enabled and filterLabel does not exist', async () => {
		const { findByRole } = setup();
		const button = await findByRole('button');

		expect(button).toHaveAttribute('aria-label', 'Show more');
	});
});
