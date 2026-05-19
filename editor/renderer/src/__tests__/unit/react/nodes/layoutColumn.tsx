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

	it('renders no data-valign attribute when valign is absent', () => {
		const { container } = render(
			<LayoutColumn width={50}>
				<p>test</p>
			</LayoutColumn>,
		);

		expect(container.firstChild).not.toHaveAttribute('data-valign');
	});

	it.each(['top', 'middle', 'bottom'] as const)(
		'renders data-valign attribute for %s valign',
		(valign) => {
			const { container } = render(
				<LayoutColumn width={50} valign={valign}>
					<p>test</p>
				</LayoutColumn>,
			);

			expect(container.firstChild).toHaveAttribute('data-valign', valign);
		},
	);
});
