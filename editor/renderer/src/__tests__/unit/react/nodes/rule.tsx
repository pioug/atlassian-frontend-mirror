import React from 'react';

import { render } from '@testing-library/react';

import Rule from '../../../../react/nodes/rule';

describe('Renderer - React/Nodes/Rule', () => {
	it('should create a <hr>-tag', () => {
		const { container } = render(<Rule />);

		expect(container.querySelector('hr')).toBeInTheDocument();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<Rule />);

		await expect(container).toBeAccessible();
	});
});
