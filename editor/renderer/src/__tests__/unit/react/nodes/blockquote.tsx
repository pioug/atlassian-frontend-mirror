import React from 'react';

import { render, screen } from '@testing-library/react';

import Blockquote from '../../../../react/nodes/blockquote';

describe('Renderer - React/Nodes/Blockquote', () => {
	it('should wrap content with <blockquote>-tag', () => {
		render(<Blockquote>This is a blockquote</Blockquote>);

		expect(screen.getByText('This is a blockquote').tagName).toBe('BLOCKQUOTE');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<Blockquote>This is a blockquote</Blockquote>);

		await expect(container).toBeAccessible();
	});
});
