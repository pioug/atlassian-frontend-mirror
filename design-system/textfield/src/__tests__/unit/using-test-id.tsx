import React from 'react';

import { render, screen } from '@testing-library/react';

import Textfield from '../../index';

describe('Textfield should be found by data-testid', () => {
	test('Using screen.getByTestId()', async () => {
		const testId = 'the-textfield';
		render(<Textfield placeholder="hello" testId={testId} />);

		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
