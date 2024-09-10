import React from 'react';

import { render, screen } from '@testing-library/react';

import Spinner from '../../index';

describe('Spinner should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const testId = 'the-spinner';
		render(<Spinner testId={testId} />);
		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
