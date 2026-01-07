import React from 'react';

import { render, screen } from '@testing-library/react';

import TextArea from '../../text-area';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Textarea should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const testId = 'the-textarea';
		render(
			<label htmlFor="name">
				Name
				<TextArea id="name" value="hello" testId={testId} />
			</label>,
		);

		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
