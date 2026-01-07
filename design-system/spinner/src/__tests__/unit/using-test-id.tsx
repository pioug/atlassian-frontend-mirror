import React from 'react';

import { render, screen } from '@testing-library/react';

import Spinner from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Spinner should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const testId = 'the-spinner';
		render(<Spinner testId={testId} />);
		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
