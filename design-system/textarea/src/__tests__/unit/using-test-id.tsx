import React from 'react';

import { render, screen } from '@testing-library/react';

import TextArea from '../../text-area';

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
