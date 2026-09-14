import React from 'react';

import { render, screen } from '@testing-library/react';

import InlineDialog from '../../inline-dialog';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Inline dialog should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const testId = 'the-inline-dialog';
		render(
			<InlineDialog content={null} testId={testId} isOpen>
				<div id="children" />
			</InlineDialog>,
		);
		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
