import React from 'react';
import { render } from '@testing-library/react';
import Hardbreak from '../../../../react/nodes/hardBreak';

describe('Renderer - React/Nodes/HardBreak', () => {
	it('should render a <br> tag', () => {
		const { container } = render(<Hardbreak />);

		expect(container.querySelectorAll('br')).toHaveLength(1);
	});

	it('should render two <br> tags if last child node is a hardBreak ', () => {
		const { container } = render(<Hardbreak forceNewLine={true} />);

		expect(container.querySelectorAll('br')).toHaveLength(2);
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<Hardbreak />);

		await expect(container).toBeAccessible();
	});
});
