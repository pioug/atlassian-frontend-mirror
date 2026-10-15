import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { IsFhsEnabledProvider } from '../../is-fhs-enabled-provider';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('IsFhsEnabledProvider', () => {
	it.each([[true], [false]])('should render its children when value is %s', (value) => {
		render(
			<IsFhsEnabledProvider value={value}>
				<div data-testid="child" />
			</IsFhsEnabledProvider>,
		);

		expect(screen.getByTestId('child')).toBeInTheDocument();
	});

	it('should not throw when two providers are nested', () => {
		expect(() => {
			render(
				<IsFhsEnabledProvider value={true}>
					<IsFhsEnabledProvider value={false} />
				</IsFhsEnabledProvider>,
			);
		}).not.toThrow();
	});
});
