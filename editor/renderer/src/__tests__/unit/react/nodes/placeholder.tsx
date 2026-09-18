import React from 'react';

import { render } from '@testing-library/react';

import Placeholder from '../../../../react/nodes/placeholder';

describe('Renderer - React/Nodes/Placeholder', () => {
	it('should create an empty <span>-tag', () => {
		const { container } = render(<Placeholder text="hi" allowPlaceholderText={false} />);

		expect(container.querySelector('span')).not.toHaveAttribute('data-placeholder');
	});

	it('should not create an empty <span>-tag', () => {
		const { container } = render(<Placeholder text="hi" allowPlaceholderText />);

		expect(container.querySelector('span')).toHaveAttribute('data-placeholder', 'hi');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<Placeholder text="hi" allowPlaceholderText />);

		await expect(container).toBeAccessible();
	});
});
