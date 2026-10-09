import React from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { default as Tag } from '../../internal/removable';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Tag should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const testId = 'test-id';
		render(<Tag text="hello world" testId={testId} />);
		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
