import React from 'react';

import { render, screen } from '@testing-library/react';

import ListItem from '../../../../react/nodes/listItem';

describe('Renderer - React/Nodes/ListItem', () => {
	const renderInList = () =>
		render(
			<ul>
				<ListItem>This is a list item</ListItem>
			</ul>,
		);

	it('should wrap content with <li>-tag', () => {
		renderInList();

		expect(screen.getByRole('listitem').tagName).toBe('LI');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderInList();

		await expect(container).toBeAccessible();
	});
});
