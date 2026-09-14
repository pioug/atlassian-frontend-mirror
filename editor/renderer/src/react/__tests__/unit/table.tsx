/* eslint-disable @atlaskit/ui-styling-standard/no-classname-prop, react/jsx-props-no-spreading */
import React from 'react';
// eslint-disable-next-line @atlassian/testing-library/prefer-atlassian-testing-library -- pre-existing usage
import { render, screen } from '@testing-library/react';
import { TableContainer } from '../../nodes/table';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

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

describe('Tables inside nested renderers (e.g. Include Page macro)', () => {
	const tableNodeWithWidth = {
		...prosemirrorTableNode,
		attrs: { ...prosemirrorTableNode.attrs, width: tableWidth },
	} as any;

	const NestedRendererTable = () => (
		<div className="ak-renderer-document">
			<div className="extension-wrapper">
				<div className="ak-renderer-document">
					<TableContainer
						tableNode={tableNodeWithWidth}
						rendererAppearance="full-width"
						renderWidth={640}
						{...requiredProps}
					>
						<tr>
							<td>1</td>
						</tr>
					</TableContainer>
				</div>
			</div>
		</div>
	);

	const TopLevelTable = () => (
		<div className="ak-renderer-document">
			<TableContainer
				tableNode={tableNodeWithWidth}
				rendererAppearance="full-width"
				renderWidth={640}
				{...requiredProps}
			>
				<tr>
					<td>1</td>
				</tr>
			</TableContainer>
		</div>
	);

	const NestedRendererTableInsideTableCell = () => (
		<div className="ak-renderer-document">
			<table>
				<tbody>
					<tr>
						<td>
							<div className="extension-wrapper">
								<div className="ak-renderer-document">
									<TableContainer
										tableNode={tableNodeWithWidth}
										rendererAppearance="full-width"
										renderWidth={640}
										{...requiredProps}
									>
										<tr>
											<td>1</td>
										</tr>
									</TableContainer>
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);

	const NestedRendererNativeNestedTable = () => (
		<div className="ak-renderer-document">
			<div className="extension-wrapper">
				<div className="ak-renderer-document">
					<TableContainer
						tableNode={tableNodeWithWidth}
						rendererAppearance="full-width"
						renderWidth={640}
						isInsideOfTable
						{...requiredProps}
					>
						<tr>
							<td>1</td>
						</tr>
					</TableContainer>
				</div>
			</div>
		</div>
	);

	it('when feature gate platform_nested_table_style_override is ON, applies !important styles only in nested renderer', () => {
		passGate('platform_nested_table_style_override');

		// Feature gate enabled: should apply !important inline styles in nested renderer
		const { unmount } = render(<NestedRendererTable />);
		const tableContainer = screen.getByTestId('table-container');
		expect(tableContainer.style.getPropertyPriority('width')).toBe('important');
		expect(tableContainer.style.getPropertyValue('max-width')).toBe('100%');
		expect(tableContainer.style.getPropertyPriority('max-width')).toBe('important');
		unmount();

		// Feature gate enabled: should NOT apply !important in top-level renderer
		const { unmount: unmountTopLevel } = render(<TopLevelTable />);
		const topLevelContainer = screen.getByTestId('table-container');
		expect(topLevelContainer.style.getPropertyPriority('width')).not.toBe('important');
		expect(topLevelContainer.style.getPropertyPriority('max-width')).not.toBe('important');
		unmountTopLevel();

		// Feature gate enabled: should NOT apply !important when nested renderer content is inside a table cell
		const { unmount: unmountTableCell } = render(<NestedRendererTableInsideTableCell />);
		const tableCellContainer = screen.getByTestId('table-container');
		expect(tableCellContainer.style.getPropertyPriority('width')).not.toBe('important');
		expect(tableCellContainer.style.getPropertyPriority('max-width')).not.toBe('important');
		unmountTableCell();

		// Feature gate enabled: should NOT apply !important to native nested tables
		render(<NestedRendererNativeNestedTable />);
		const nestedTableContainer = screen.getByTestId('table-container');
		expect(nestedTableContainer.style.getPropertyPriority('width')).not.toBe('important');
		expect(nestedTableContainer.style.getPropertyPriority('max-width')).not.toBe('important');
	});

	it('when feature gate platform_nested_table_style_override is OFF, does not apply !important even in nested renderer', () => {
		failGate('platform_nested_table_style_override');

		// Feature gate disabled: should NOT apply !important even in nested renderer
		render(<NestedRendererTable />);
		const tableContainer = screen.getByTestId('table-container');
		expect(tableContainer.style.getPropertyPriority('width')).not.toBe('important');
		expect(tableContainer.style.getPropertyPriority('max-width')).not.toBe('important');
	});

	describe('with platform_nested_table_style_override_2', () => {
		// A NON-resized table in a nested renderer takes a default layout cap
		// (760px/1800px in `default`, or a `cqw` length in full-page/full-width)
		// from the outer renderer's width context, which does not match the macro
		// box. The gate-2 fix promotes width:100% for these. Explicitly resized
		// tables (with attrs.width) are excluded and keep their author-chosen width
		// (PGXT-10226).
		const tableNodeWithoutWidth = prosemirrorTableNode as any;

		const NestedRendererTableNoWidth = () => (
			<div className="ak-renderer-document">
				<div className="extension-wrapper">
					<div className="ak-renderer-document">
						<TableContainer
							tableNode={tableNodeWithoutWidth}
							rendererAppearance="full-width"
							renderWidth={640}
							{...requiredProps}
						>
							<tr>
								<td>1</td>
							</tr>
						</TableContainer>
					</div>
				</div>
			</div>
		);

		// Reproduces the actual PGXT-10421 case: an Excerpt macro renders its body
		// in a nested renderer with a `default` appearance, so the table computes a
		// fixed pixel width (e.g. 1800px), NOT a cqw length. The fix must still
		// normalise this to 100%.
		const NestedRendererTableDefaultAppearance = () => (
			<div className="ak-renderer-document">
				<div className="extension-wrapper">
					<div className="ak-renderer-document">
						<TableContainer
							tableNode={tableNodeWithoutWidth}
							rendererAppearance={'default' as any}
							renderWidth={640}
							{...requiredProps}
						>
							<tr>
								<td>1</td>
							</tr>
						</TableContainer>
					</div>
				</div>
			</div>
		);

		it('promotes width:100% for a table in a nested renderer (no width attr)', () => {
			passGate('platform_nested_table_style_override');
			passGate('platform_nested_table_style_override_2');

			render(<NestedRendererTableNoWidth />);
			const tableContainer = screen.getByTestId('table-container');
			expect(tableContainer.style.getPropertyValue('width')).toBe('100%');
			expect(tableContainer.style.getPropertyPriority('width')).toBe('important');
			expect(tableContainer.style.getPropertyValue('left')).toBe('0px');
			expect(tableContainer.style.getPropertyPriority('left')).toBe('important');
			expect(tableContainer.style.getPropertyValue('max-width')).toBe('100%');
			expect(tableContainer.style.getPropertyPriority('max-width')).toBe('important');
		});

		it('promotes width:100% for a fixed-pixel width in a default-appearance nested renderer (PGXT-10421 repro)', () => {
			passGate('platform_nested_table_style_override');
			passGate('platform_nested_table_style_override_2');

			render(<NestedRendererTableDefaultAppearance />);
			const tableContainer = screen.getByTestId('table-container');
			// Without the fix this container would carry a fixed px width (e.g.
			// 1800px) that ignores the macro box; the fix normalises it to 100%.
			expect(tableContainer.style.getPropertyValue('width')).toBe('100%');
			expect(tableContainer.style.getPropertyPriority('width')).toBe('important');
		});

		it('preserves an explicitly resized table width (does NOT force 100%) so PGXT-10226 is not regressed', () => {
			passGate('platform_nested_table_style_override');
			// Note: platform_nested_table_style_override_2 is intentionally NOT forced.
			// For an explicitly resized table the gate-2 condition short-circuits on
			// `!isExplicitlyResized` before the gate is read, so it is never called on
			// this path (forcing it would fail the "unused forced gate" harness check).
			// The resized width must be promoted verbatim regardless of gate-2.

			// tableNodeWithWidth has attrs.width set (author-resized). The resized
			// width/position must be promoted verbatim, not overwritten with 100%.
			render(<NestedRendererTable />);
			const tableContainer = screen.getByTestId('table-container');
			expect(tableContainer.style.getPropertyValue('width')).not.toBe('100%');
			expect(tableContainer.style.getPropertyPriority('width')).toBe('important');
		});

		it('when gate-2 is OFF, a non-resized table keeps the gate-1 computed width (not 100%)', () => {
			passGate('platform_nested_table_style_override');
			failGate('platform_nested_table_style_override_2');

			// Non-resized table so the gate-2 condition is evaluated (and here OFF),
			// falling through to the gate-1 behaviour of promoting the computed width.
			render(<NestedRendererTableNoWidth />);
			const tableContainer = screen.getByTestId('table-container');
			expect(tableContainer.style.getPropertyValue('width')).not.toBe('100%');
			expect(tableContainer.style.getPropertyPriority('width')).toBe('important');
		});

		it('still does not apply !important inside a table cell context (PGXT-10294)', () => {
			passGate('platform_nested_table_style_override');
			// Note: platform_nested_table_style_override_2 is intentionally not forced
			// here. The table-cell context short-circuits in applyNestedRendererTableFix
			// before the gate-2 branch is reached, so the gate is never read on this path.

			render(<NestedRendererTableInsideTableCell />);
			const tableContainer = screen.getByTestId('table-container');
			expect(tableContainer.style.getPropertyPriority('width')).not.toBe('important');
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

	it('when feature gate platform_renderer_isPresentational is ON, table with isPresentational has role presentation', () => {
		passGate('platform_renderer_isPresentational');
		render(<Component isPresentational />);
		const table = screen.getByTestId('renderer-table');
		expect(table).toHaveAttribute('role', 'presentation');
	});

	it('when feature gate platform_renderer_isPresentational is OFF, table does not have role presentation', () => {
		failGate('platform_renderer_isPresentational');
		render(<Component />);
		const table = screen.getByTestId('renderer-table');
		expect(table).not.toHaveAttribute('role', 'presentation');
	});
});
