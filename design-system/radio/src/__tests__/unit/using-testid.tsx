import React from 'react';

import { render, screen } from '@testing-library/react';

import RadioGroup from '../../radio-group';
import { type OptionsPropType } from '../../types';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Radio should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const options: OptionsPropType = [
			{ name: 'color', value: 'red', label: 'Red', testId: 'red' },
			{ name: 'color', value: 'blue', label: 'Blue', testId: 'blue' },
		];

		render(<RadioGroup options={options} />);

		options.forEach(({ testId }) => {
			const radio = screen.getByTestId(testId + '--radio-input') as HTMLInputElement;
			const label = screen.getByTestId(testId + '--radio-label');
			expect(radio).not.toBeChecked();
			label.click();
			expect(radio).toBeChecked();
		});
	});
});
