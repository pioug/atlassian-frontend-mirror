import React from 'react';
import { render } from '@testing-library/react';
import LayoutColumn from '../../../../react/nodes/layoutColumn';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Nodes/LayoutColumn', () => {
	it('should wrap content with div-tag', () => {
		const { container } = render(
			<LayoutColumn>
				<p>test</p>
			</LayoutColumn>,
		);

		expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
	});
});
