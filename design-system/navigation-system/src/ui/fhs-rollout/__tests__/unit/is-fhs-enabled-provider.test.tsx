import React from 'react';

import { render } from '@testing-library/react';

import { IsFhsEnabledProvider } from '../../is-fhs-enabled-provider';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('IsFhsEnabledProvider', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should throw an error when two providers are nested', () => {
		// Mock console.error to avoid error output in test console
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

		expect(() => {
			render(
				<IsFhsEnabledProvider value={true}>
					<IsFhsEnabledProvider value={false} />
				</IsFhsEnabledProvider>,
			);
		}).toThrow('A custom value for IsFhsEnabledContext has already been provided');

		// Restore console.error
		consoleSpy.mockRestore();
	});
});
