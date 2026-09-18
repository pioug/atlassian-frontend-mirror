import React from 'react';

import { render, screen } from '@testing-library/react';

import Doc from '../../../../react/nodes/doc';

describe('Renderer - React/Nodes/Doc', () => {
	it('should wrap content with <div>-tag', () => {
		render(<Doc>This is an empty document</Doc>);

		expect(screen.getByText('This is an empty document').tagName).toBe('DIV');
	});

	it('should output correct html', () => {
		const { container } = render(<Doc>This is an empty document</Doc>);

		expect(container.textContent).toEqual('This is an empty document');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<Doc>This is an empty document</Doc>);

		await expect(container).toBeAccessible();
	});
});
