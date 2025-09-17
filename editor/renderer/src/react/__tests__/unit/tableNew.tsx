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

				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const styleAttr = (container.firstChild as HTMLElement).getAttribute('style') || '';
				if (appearance === 'full-page') {
					expect(styleAttr).toContain('width: calc(min(800px, 100cqw');
					expect(styleAttr).toContain('left: calc(min(0px, 760px - min(800px, 100cqw');
				} else if (appearance === 'full-width' || appearance === 'comment') {
					// width attribute present → min(800px, 100cqw) in full-width/comment
					expect(styleAttr).toContain('width: calc(min(800px, 100cqw');
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

				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const styleAttr = (container.firstChild as HTMLElement).getAttribute('style') || '';
				if (appearance === 'full-page') {
					// full-page uses fixed 760px line length in left calculation
					expect(styleAttr).toContain('width: calc(min(760px, 100cqw');
					expect(styleAttr).toContain('left: calc(min(0px, 760px - min(760px, 100cqw');
				} else if (appearance === 'full-width') {
					// full-width without width attribute → min(1800px, 100cqw)
					expect(styleAttr).toContain('width: calc(min(1800px, 100cqw');
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					expect(container.firstChild!).toHaveAttribute('data-layout', 'full-width');
				} else {
					// comment appearance without width attribute inherits
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
