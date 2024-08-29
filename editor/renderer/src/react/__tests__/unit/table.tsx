import React from 'react';
import { render } from '@testing-library/react';
import { TableContainer } from '../../nodes/table';

jest.mock('../../nodes/table', () => ({
	...jest.requireActual('../../nodes/table'),
	isTableResizingEnabled: () => true,
}));

const prosemirrorTableNode = {
	type: 'table',
	attrs: {
		isNumberColumnEnabled: false,
		layout: 'default',
	},
	content: [
		{
			type: 'table_row',
			content: [
				{
					type: 'table_cell',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: '1',
								},
							],
						},
					],
				},
			],
		},
	],
};

const appearances = ['full-width', 'full-page'];
const renderWidths = [0, 640];
const tableWidth = 800;
const requiredProps = {
	layout: '' as any,
	isNumberColumnEnabled: '' as any,
	smartCardStorage: '' as any,
	allowTableResizing: true,
};

describe('Tables with a width attribute', () => {
	describe.each(appearances)('in a %s renderer', (appearance) => {
		describe.each(renderWidths)('where renderWidth is %s', (renderWidth) => {
			const Component = () => (
				<TableContainer
					tableNode={
						{
							...prosemirrorTableNode,
							attrs: { ...prosemirrorTableNode.attrs, width: tableWidth },
						} as any
					}
					rendererAppearance={appearance as any}
					renderWidth={renderWidth}
					{...requiredProps}
				>
					<tr>
						<td>1</td>
					</tr>
				</TableContainer>
			);

			it('should have the correct styles and layout attribute', () => {
				const { container } = render(<Component />);
				container.innerHTML;
				if (renderWidth) {
					expect(container.firstChild!).toHaveStyle(`width: ${renderWidth}px`);
				} else {
					expect(container.firstChild!).toHaveStyle('width: 800px');
					if (appearance === 'full-page') {
						expect(container.firstChild!).toHaveStyle('left: -20px');
					}
				}
				expect(container.firstChild!).toHaveAttribute('data-layout', 'custom');
			});
		});
	});
});

describe('Tables without a width attribute', () => {
	describe.each(appearances)('in a %s renderer', (appearance) => {
		describe.each(renderWidths)('where renderWidth is %s', (renderWidth) => {
			const Component = () => (
				<TableContainer
					tableNode={prosemirrorTableNode as any}
					rendererAppearance={appearance as any}
					renderWidth={renderWidth}
					{...requiredProps}
				>
					<tr>
						<td>1</td>
					</tr>
				</TableContainer>
			);
			it('should have the correct styles and layout attribute', () => {
				const { container } = render(<Component />);
				container.innerHTML;
				if (appearance === 'full-width') {
					if (renderWidth) {
						expect(container.firstChild!).toHaveStyle(`width: ${renderWidth}px`);
					} else {
						expect(container.firstChild!).toHaveStyle('width: 1800px');
					}
					expect(container.firstChild!).toHaveAttribute('data-layout', 'full-width');
				} else {
					if (renderWidth) {
						expect(container.firstChild!).toHaveStyle(`width: ${renderWidth}px`);
					} else {
						expect(container.firstChild!).toHaveStyle('width: 760px');
					}
				}
			});
		});
	});
});
