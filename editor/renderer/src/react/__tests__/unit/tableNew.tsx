import React from 'react';
import { render, screen } from '@testing-library/react';
import { TableContainer } from '../../nodes/table';
import { ffTest } from '@atlassian/feature-flags-test-utils';

jest.mock('../../nodes/table', () => ({
	...jest.requireActual('../../nodes/tableNew'),
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

const appearances = ['full-width', 'full-page', 'comment'];
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

				if (appearance === 'full-width' || appearance === 'full-page' || appearance === 'comment') {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					expect(container.firstChild!).toHaveStyle({
						width: 'calc(min(800px, 100cqw - 32px * 2))',
						left: 'calc(min(0px, 800px - min(800px, 100cqw - 32px * 2)) / 2)',
					});
				} else {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					expect(container.firstChild!).toHaveStyle('width: 800px');
				}
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

				if (appearance === 'full-page') {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					expect(container.firstChild!).toHaveStyle({
						width: 'calc(min(760px, 100cqw - 32px * 2))',
						left: 'calc(min(0px, 760px - min(760px, 100cqw - 32px * 2)) / 2)',
					});
				} else if (appearance === 'full-width') {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					expect(container.firstChild!).toHaveStyle({
						width: 'calc(min(760px, 100cqw - 32px * 2))',
						left: 'calc(min(0px, 760px - min(760px, 100cqw - 32px * 2)) / 2)',
					});
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					expect(container.firstChild!).toHaveAttribute('data-layout', 'full-width');
				} else {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					expect(container.firstChild!).toHaveStyle('width: inherit');
				}
			});
		});
	});
});

describe('Table isPresentational prop', () => {
	const Component = ({ isPresentational = false }) => (
		<TableContainer
			tableNode={prosemirrorTableNode as any}
			rendererAppearance="full-page"
			renderWidth={640}
			isPresentational={isPresentational}
			{...requiredProps}
		>
			<tr>
				<td>1</td>
			</tr>
		</TableContainer>
	);

	ffTest(
		'platform_renderer_isPresentational',
		() => {
			render(<Component isPresentational />);
			const table = screen.getByTestId('renderer-table');
			expect(table).toHaveAttribute('role', 'presentation');
		},
		() => {
			render(<Component />);
			const table = screen.getByTestId('renderer-table');
			expect(table).not.toHaveAttribute('role', 'presentation');
		},
	);
});
