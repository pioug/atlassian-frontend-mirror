import React from 'react';

import { render, screen } from '@testing-library/react';

import BulletList from '../../../../react/nodes/bulletList';

describe('Renderer - React/Nodes/BulletList', () => {
	const content = <li>This is a bullet list</li>;

	it('should wrap content with <ul>-tag', () => {
		render(<BulletList>{content}</BulletList>);

		expect(screen.getByRole('list').tagName).toBe('UL');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<BulletList>{content}</BulletList>);

		await expect(container).toBeAccessible();
	});
});
