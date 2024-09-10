import React from 'react';

import { render, screen } from '@testing-library/react';

import Pagination from '../../index';

describe('Pagination should be found by data-testid', () => {
	const setup = () => {
		const testId = 'testing';

		render(<Pagination pages={[1, 2, 3, 4]} testId={testId} />);

		return {
			testId,
		};
	};

	it('Root element is accessible via data-testid', () => {
		const { testId } = setup();

		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
