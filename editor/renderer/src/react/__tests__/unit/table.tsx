import React from 'react';
import { render } from '@testing-library/react';
import { TableContainer } from '../../nodes/table';
import { fg } from '@atlaskit/platform-feature-flags';

jest.mock('../../nodes/table', () => ({
	...jest.requireActual('../../nodes/table'),
	isTableResizingEnabled: () => true,
}));

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
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

const appearances = ['full-width', 'full-page', 'comment'];
const renderWidths = [0, 640];
const calculateByCSS = [true, false];
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
			describe.each(calculateByCSS)(
				'where width is calculated by CSS %s',
				(widthCalculatedByCSS) => {
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
						(fg as jest.Mock).mockReturnValue(widthCalculatedByCSS);
						const { container } = render(<Component />);

						if (widthCalculatedByCSS) {
							if (
								appearance === 'full-width' ||
								appearance === 'full-page' ||
								appearance === 'comment'
							) {
								expect(container.firstChild!).toHaveStyle({
									width: 'calc(min(800px, 100cqw - 32px * 2))',
									left: 'calc(min(0px, 800px - min(800px, 100cqw - 32px * 2)) / 2)',
								});
							} else {
								expect(container.firstChild!).toHaveStyle('width: 800px');
							}
						} else {
							if (renderWidth) {
								expect(container.firstChild!).toHaveStyle(`width: ${renderWidth}px`);
							} else {
								expect(container.firstChild!).toHaveStyle('width: 800px');
								if (appearance === 'full-page') {
									expect(container.firstChild!).toHaveStyle('left: -20px');
								}
							}
						}
						expect(container.firstChild!).toHaveAttribute('data-layout', 'custom');
					});
				},
			);
		});
	});
});

describe('Tables without a width attribute', () => {
	describe.each(appearances)('in a %s renderer', (appearance) => {
		describe.each(renderWidths)('where renderWidth is %s', (renderWidth) => {
			describe.each(calculateByCSS)(
				'where width is calculated by CSS %s',
				(widthCalculatedByCSS) => {
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
						(fg as jest.Mock).mockReturnValue(widthCalculatedByCSS);
						const { container } = render(<Component />);

						if (widthCalculatedByCSS) {
							if (appearance === 'full-page') {
								expect(container.firstChild!).toHaveStyle({
									width: 'calc(min(760px, 100cqw - 32px * 2))',
									left: 'calc(min(0px, 760px - min(760px, 100cqw - 32px * 2)) / 2)',
								});
							} else if (appearance === 'full-width') {
								expect(container.firstChild!).toHaveStyle({
									width: 'calc(min(760px, 100cqw - 32px * 2))',
									left: 'calc(min(0px, 760px - min(760px, 100cqw - 32px * 2)) / 2)',
								});
								expect(container.firstChild!).toHaveAttribute('data-layout', 'full-width');
							} else {
								expect(container.firstChild!).toHaveStyle('width: inherit');
							}
						} else {
							if (appearance === 'full-width') {
								if (renderWidth) {
									expect(container.firstChild!).toHaveStyle(`width: ${renderWidth}px`);
								} else {
									expect(container.firstChild!).toHaveStyle('width: 1800px');
								}
								expect(container.firstChild!).toHaveAttribute('data-layout', 'full-width');
							} else if (appearance === 'comment') {
								expect(container.firstChild!).toHaveStyle('width: inherit');
							} else {
								if (renderWidth) {
									expect(container.firstChild!).toHaveStyle(`width: ${renderWidth}px`);
								} else {
									expect(container.firstChild!).toHaveStyle('width: 760px');
								}
							}
						}
					});
				},
			);
		});
	});
});
