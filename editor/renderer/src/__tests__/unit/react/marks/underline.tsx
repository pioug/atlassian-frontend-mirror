import React from 'react';
import { render, screen } from '@testing-library/react';
import Underline from '../../../../react/marks/underline';

describe('Renderer - React/Marks/Underline', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<Underline dataAttributes={{ 'data-renderer-mark': true }}>This is underlined</Underline>,
		);

		await expect(container).toBeAccessible();
	});

	it('should wrap content with <u>-tag', () => {
		render(
			<Underline dataAttributes={{ 'data-renderer-mark': true }}>This is underlined</Underline>,
		);

		expect(screen.getByText('This is underlined').tagName).toBe('U');
	});

	it('should output correct html', () => {
		const { container } = render(
			<Underline dataAttributes={{ 'data-renderer-mark': true }}>This is underlined</Underline>,
		);

		expect(container.querySelector('u')?.outerHTML).toEqual(
			'<u data-renderer-mark="true">This is underlined</u>',
		);
	});
});
