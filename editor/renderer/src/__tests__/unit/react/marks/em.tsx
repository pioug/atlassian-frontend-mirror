import React from 'react';
import { render, screen } from '@testing-library/react';
import Em from '../../../../react/marks/em';

describe('Renderer - React/Marks/Em', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<Em dataAttributes={{ 'data-renderer-mark': true }}>This is italic</Em>,
		);

		await expect(container).toBeAccessible();
	});

	it('should wrap content with <em>-tag', () => {
		render(<Em dataAttributes={{ 'data-renderer-mark': true }}>This is italic</Em>);

		expect(screen.getByText('This is italic').tagName).toBe('EM');
	});

	it('should output correct html', () => {
		const { container } = render(
			<Em dataAttributes={{ 'data-renderer-mark': true }}>This is italic</Em>,
		);

		expect(container.querySelector('em')?.outerHTML).toEqual(
			'<em data-renderer-mark="true">This is italic</em>',
		);
	});
});
