import React from 'react';

import { render, screen } from '@testing-library/react';

import Tag from '../../index';

describe('Tag should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const testId = 'test-id';
		render(<Tag text="hello world" testId={testId} />);
		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
