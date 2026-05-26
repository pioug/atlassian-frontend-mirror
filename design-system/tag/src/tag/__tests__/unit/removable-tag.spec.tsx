import React from 'react';

import { render, screen } from '@testing-library/react';

import RemovableTag from '../../internal/removable';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<RemovableTag />', () => {
	describe('removal indicator', () => {
		it('should render a remove button', () => {
			render(<RemovableTag text="" testId="tag" />);
			expect(screen.getByTestId('close-button-tag')).toBeInTheDocument();
		});
	});
});
