import React from 'react';

import { render, screen } from '@testing-library/react';

import { Checkbox } from '../../index';

describe('Checkbox should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const testId = 'the-checkbox';
		const labelTestId = `${testId}--checkbox-label`;
		const checkboxTestId = `${testId}--hidden-checkbox`;

		render(
			<Checkbox
				value="Basic checkbox"
				label="Basic checkbox"
				name="checkbox-basic"
				testId={testId}
			/>,
		);

		const checkbox = screen.getByTestId(checkboxTestId) as HTMLInputElement;
		const label = screen.getByTestId(labelTestId);
		expect(checkbox).not.toBeChecked();
		label.click();
		expect(checkbox).toBeChecked();
	});
});
