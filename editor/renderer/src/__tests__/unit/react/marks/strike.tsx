import React from 'react';

import { render, screen } from '@testing-library/react';

import Strike from '../../../../react/marks/strike';

describe('Renderer - React/Marks/Strike', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<Strike dataAttributes={{ 'data-renderer-mark': true }}>Strike this</Strike>,
		);

		await expect(container).toBeAccessible();
	});

	it('should wrap content with <span>-tag', () => {
		render(<Strike dataAttributes={{ 'data-renderer-mark': true }}>Strike this</Strike>);

		expect(screen.getByText('Strike this').tagName).toBe('SPAN');
	});

	it('should output correct html', () => {
		render(<Strike dataAttributes={{ 'data-renderer-mark': true }}>Strike this</Strike>);

		const mark = screen.getByText('Strike this');

		expect(mark).toHaveAttribute('data-renderer-mark', 'true');
		expect(mark).toHaveStyle({ textDecoration: 'line-through' });
	});
});
