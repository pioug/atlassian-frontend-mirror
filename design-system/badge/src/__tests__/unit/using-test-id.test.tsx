import React from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import Badge from '../../badge';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Badge should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const testId = 'the-badge';
		render(
			<Badge appearance="added" max={99} testId={testId}>
				3000
			</Badge>,
		);

		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
