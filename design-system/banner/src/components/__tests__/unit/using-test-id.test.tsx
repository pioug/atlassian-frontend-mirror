import React from 'react';

import { render, screen } from '@testing-library/react';

import Banner from '../../banner';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Banner should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const testId = 'the-banner';
		render(
			<Banner testId="the-banner">
				Your license is about to expire. Please renew your license within the next week.
			</Banner>,
		);

		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
