import React from 'react';

import { render, screen } from '@testing-library/react';

import Tag from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Tag should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const testId = 'test-id';
		render(<Tag text="hello world" testId={testId} />);
		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
