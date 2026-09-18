import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { Blanket } from '../blanket';
import { blanketClassName } from '../styles';

describe('Styled Blanket', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<Blanket />);
		await expect(container).toBeAccessible();
	});

	it('should render properly with className', () => {
		render(<Blanket />);
		const blanket = screen.getByTestId('media-card-blanket');
		expect(blanket).toBeInTheDocument();
		expect(blanket).toHaveClass(blanketClassName);
	});
});
