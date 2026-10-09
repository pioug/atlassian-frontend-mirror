/**
 * @jest-environment jsdom
 */
import React from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { AIBorder } from '../aiBorder';

describe('AIBorder', () => {
	it('should render with the correct test id', () => {
		render(<AIBorder />);

		expect(screen.getByTestId('media-card-ai-border')).toBeInTheDocument();
	});

	it('should render as a div element', () => {
		render(<AIBorder />);

		const element = screen.getByTestId('media-card-ai-border');
		expect(element.tagName).toBe('DIV');
	});

	it('should have pointer-events set to none', () => {
		render(<AIBorder />);

		const element = screen.getByTestId('media-card-ai-border');
		expect(element).toHaveStyle({ pointerEvents: 'none' });
	});

	it('should be accessible', async () => {
		const { container } = render(<AIBorder />);

		await expect(container).toBeAccessible();
	});
});
