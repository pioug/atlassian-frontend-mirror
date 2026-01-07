import React from 'react';

import { render, screen } from '@testing-library/react';

import Textfield from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Textfield should be found by data-testid', () => {
	test('Using screen.getByTestId()', async () => {
		const testId = 'the-textfield';
		render(<Textfield placeholder="hello" testId={testId} />);

		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
