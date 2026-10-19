import React from 'react';

import { renderToStaticMarkup } from 'react-dom/server';

import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { p, table, td, tr } from '@atlaskit/adf-utils/builders';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { screen } from '@atlassian/testing-library/screen';

import { TableProcessorWithContainerStyles } from '../../../../react/nodes/table';
import { withTableCellEdgeProps } from '../../../../react/nodes/table/cached-cell-edges';
import { TableCell } from '../../../../react/nodes/tableCell';
import TableRow from '../../../../react/nodes/tableRow';

const schema = getSchemaBasedOnStage('stage0');
const createNode = () =>
	schema.nodeFromJSON(
		table(...Array.from({ length: 3 }, () => tr(Array.from({ length: 3 }, () => td()(p('cell')))))),
	);
const Wrapper = ({ children }: React.PropsWithChildren) => <>{children}</>;
const renderTable = (node: ReturnType<typeof createNode>, numbered = false, text = 'cell') => (
	<TableProcessorWithContainerStyles
		isNumberColumnEnabled={numbered}
		layout="default"
		rendererAppearance="full-page"
		renderWidth={760}
		smartCardStorage={new Map()}
		tableNode={node}
	>
		{[0, 1, 2].map((row) => (
			<Wrapper key={row}>
				<TableRow>
					{[0, 1, 2].map((column) => (
						<TableCell key={column}>{text}</TableCell>
					))}
				</TableRow>
			</Wrapper>
		))}
	</TableProcessorWithContainerStyles>
);

describe('renderer table performance patch', () => {
	afterEach(() => {
		setupEditorExperiments('test', {}, {}, { disableTestOverrides: true });
		jest.restoreAllMocks();
	});

	it('preserves cell edges when the patch is enabled', () => {
		mockExpEnabled('platform_editor_table_q4_perf_patch');
		setupEditorExperiments('test', { platform_editor_table_q4_loveability: true });
		renderWithIntl(renderTable(createNode()));
		const cells = screen.getAllByRole('cell');
		expect(cells[0]).toHaveAttribute('data-reaches-top', 'true');
		expect(cells[0]).toHaveAttribute('data-reaches-left', 'true');
		expect(cells[8]).toHaveAttribute('data-reaches-bottom', 'true');
		expect(cells[8]).toHaveAttribute('data-reaches-right', 'true');
		for (const edge of ['top', 'bottom', 'left', 'right']) {
			expect(cells[4]).not.toHaveAttribute(`data-reaches-${edge}`);
		}
	});

	it('preserves cell edges when the patch is disabled', () => {
		mockExpDisabled('platform_editor_table_q4_perf_patch');
		setupEditorExperiments('test', { platform_editor_table_q4_loveability: true });
		renderWithIntl(renderTable(createNode()));
		const cells = screen.getAllByRole('cell');
		expect(cells[0]).toHaveAttribute('data-reaches-top', 'true');
		expect(cells[0]).toHaveAttribute('data-reaches-left', 'true');
		expect(cells[8]).toHaveAttribute('data-reaches-bottom', 'true');
		expect(cells[8]).toHaveAttribute('data-reaches-right', 'true');
		for (const edge of ['top', 'bottom', 'left', 'right']) {
			expect(cells[4]).not.toHaveAttribute(`data-reaches-${edge}`);
		}
	});

	it('does not enable rounded edges when the parent experiment is disabled', () => {
		mockExpEnabled('platform_editor_table_q4_perf_patch');
		setupEditorExperiments('test', { platform_editor_table_q4_loveability: false });
		renderWithIntl(renderTable(createNode()));
		expect(screen.getAllByRole('cell')[0]).not.toHaveAttribute('data-reaches-top');
	});

	it('reuses geometry while rendering fresh children', () => {
		mockExpEnabled('platform_editor_table_q4_perf_patch');
		setupEditorExperiments('test', { platform_editor_table_q4_loveability: true });
		const node = createNode();
		const { rerender } = renderWithIntl(renderTable(node));
		const scan = jest.spyOn(node, 'forEach');
		rerender(renderTable(node, false, 'updated'));
		expect(screen.getAllByRole('cell')[4]).toHaveTextContent('updated');
		expect(scan).not.toHaveBeenCalled();
	});

	it('only clones perimeter cells, including on a cold render', () => {
		mockExpEnabled('platform_editor_table_q4_perf_patch');
		setupEditorExperiments('test', { platform_editor_table_q4_loveability: true });
		const clone = jest.spyOn(React, 'cloneElement');
		renderWithIntl(renderTable(createNode()));
		const cellClones = clone.mock.calls.filter(([element]) => element.type === TableCell);
		expect(cellClones).toHaveLength(8);
	});

	it('preserves rendered edges when the number-column prop differs from the node', () => {
		mockExpEnabled('platform_editor_table_q4_perf_patch');
		setupEditorExperiments('test', { platform_editor_table_q4_loveability: true });
		const node = createNode();
		const { rerender } = renderWithIntl(renderTable(node));
		expect(screen.getAllByText('cell')[0]).toHaveAttribute('data-reaches-left', 'true');
		rerender(renderTable(node, true));
		expect(screen.getAllByText('cell')[0]).not.toHaveAttribute('data-reaches-left');
		rerender(renderTable(node));
		expect(screen.getAllByText('cell')[0]).toHaveAttribute('data-reaches-left', 'true');
	});

	it('caches edges for a numbered table using its node attribute', () => {
		mockExpEnabled('platform_editor_table_q4_perf_patch');
		setupEditorExperiments('test', { platform_editor_table_q4_loveability: true });
		const original = createNode();
		const numbered = original.type.create(
			{ ...original.attrs, isNumberColumnEnabled: true },
			original.content,
		);
		const { rerender } = renderWithIntl(renderTable(numbered, true));
		const scan = jest.spyOn(numbered, 'forEach');
		rerender(renderTable(numbered, true, 'updated'));
		expect(scan).not.toHaveBeenCalled();
		expect(screen.getAllByText('updated')[0]).not.toHaveAttribute('data-reaches-left');
		rerender(renderTable(original));
		expect(screen.getAllByText('cell')[0]).toHaveAttribute('data-reaches-left', 'true');
	});

	it('preserves merged-cell SSR edges for ordinary tables with the patch disabled', () => {
		mockExpDisabled('platform_editor_table_q4_perf_patch');
		setupEditorExperiments('test', { platform_editor_table_q4_loveability: true });
		const node = schema.nodeFromJSON(
			table(tr([td({ rowspan: 2 })(p('left')), td()(p('right'))]), tr([td()(p('bottom right'))])),
		);
		const children = (
			<TableProcessorWithContainerStyles
				isNumberColumnEnabled={false}
				layout="default"
				rendererAppearance="full-page"
				renderWidth={760}
				smartCardStorage={new Map()}
				tableNode={node}
			>
				<Wrapper>
					<TableRow>
						<TableCell rowspan={2}>left</TableCell>
						<TableCell>right</TableCell>
					</TableRow>
				</Wrapper>
				<Wrapper>
					<TableRow>
						<TableCell>bottom right</TableCell>
					</TableRow>
				</Wrapper>
			</TableProcessorWithContainerStyles>
		);
		const markup = new DOMParser().parseFromString(renderToStaticMarkup(children), 'text/html');
		const cells = Array.from(markup.querySelectorAll('td'));
		const left = cells.find((cell) => cell.textContent === 'left');
		const bottomRight = cells.find((cell) => cell.textContent === 'bottom right');
		expect(left?.getAttribute('data-reaches-top')).toBe('true');
		expect(left?.getAttribute('data-reaches-bottom')).toBe('true');
		expect(left?.hasAttribute('data-reaches-left')).toBe(true);
		expect(bottomRight?.getAttribute('data-reaches-bottom')).toBe('true');
		expect(bottomRight?.getAttribute('data-reaches-right')).toBe('true');
	});

	it('preserves merged-cell SSR edges for numbered tables with the patch disabled', () => {
		mockExpDisabled('platform_editor_table_q4_perf_patch');
		setupEditorExperiments('test', { platform_editor_table_q4_loveability: true });
		const node = schema.nodeFromJSON(
			table(tr([td({ rowspan: 2 })(p('left')), td()(p('right'))]), tr([td()(p('bottom right'))])),
		);
		const children = (
			<TableProcessorWithContainerStyles
				isNumberColumnEnabled={true}
				layout="default"
				rendererAppearance="full-page"
				renderWidth={760}
				smartCardStorage={new Map()}
				tableNode={node}
			>
				<Wrapper>
					<TableRow>
						<TableCell rowspan={2}>left</TableCell>
						<TableCell>right</TableCell>
					</TableRow>
				</Wrapper>
				<Wrapper>
					<TableRow>
						<TableCell>bottom right</TableCell>
					</TableRow>
				</Wrapper>
			</TableProcessorWithContainerStyles>
		);
		const markup = new DOMParser().parseFromString(renderToStaticMarkup(children), 'text/html');
		const cells = Array.from(markup.querySelectorAll('td'));
		const left = cells.find((cell) => cell.textContent === 'left');
		const bottomRight = cells.find((cell) => cell.textContent === 'bottom right');
		expect(left?.getAttribute('data-reaches-top')).toBe('true');
		expect(left?.getAttribute('data-reaches-bottom')).toBe('true');
		expect(left?.hasAttribute('data-reaches-left')).toBe(false);
		expect(bottomRight?.getAttribute('data-reaches-bottom')).toBe('true');
		expect(bottomRight?.getAttribute('data-reaches-right')).toBe('true');
	});

	it('preserves merged-cell SSR edges for ordinary tables with the patch enabled', () => {
		mockExpEnabled('platform_editor_table_q4_perf_patch');
		setupEditorExperiments('test', { platform_editor_table_q4_loveability: true });
		const node = schema.nodeFromJSON(
			table(tr([td({ rowspan: 2 })(p('left')), td()(p('right'))]), tr([td()(p('bottom right'))])),
		);
		const children = (
			<TableProcessorWithContainerStyles
				isNumberColumnEnabled={false}
				layout="default"
				rendererAppearance="full-page"
				renderWidth={760}
				smartCardStorage={new Map()}
				tableNode={node}
			>
				<Wrapper>
					<TableRow>
						<TableCell rowspan={2}>left</TableCell>
						<TableCell>right</TableCell>
					</TableRow>
				</Wrapper>
				<Wrapper>
					<TableRow>
						<TableCell>bottom right</TableCell>
					</TableRow>
				</Wrapper>
			</TableProcessorWithContainerStyles>
		);
		const markup = new DOMParser().parseFromString(renderToStaticMarkup(children), 'text/html');
		const cells = Array.from(markup.querySelectorAll('td'));
		const left = cells.find((cell) => cell.textContent === 'left');
		const bottomRight = cells.find((cell) => cell.textContent === 'bottom right');
		expect(left?.getAttribute('data-reaches-top')).toBe('true');
		expect(left?.getAttribute('data-reaches-bottom')).toBe('true');
		expect(left?.hasAttribute('data-reaches-left')).toBe(true);
		expect(bottomRight?.getAttribute('data-reaches-bottom')).toBe('true');
		expect(bottomRight?.getAttribute('data-reaches-right')).toBe('true');
	});

	it('preserves merged-cell SSR edges for numbered tables with the patch enabled', () => {
		mockExpEnabled('platform_editor_table_q4_perf_patch');
		setupEditorExperiments('test', { platform_editor_table_q4_loveability: true });
		const node = schema.nodeFromJSON(
			table(tr([td({ rowspan: 2 })(p('left')), td()(p('right'))]), tr([td()(p('bottom right'))])),
		);
		const children = (
			<TableProcessorWithContainerStyles
				isNumberColumnEnabled={true}
				layout="default"
				rendererAppearance="full-page"
				renderWidth={760}
				smartCardStorage={new Map()}
				tableNode={node}
			>
				<Wrapper>
					<TableRow>
						<TableCell rowspan={2}>left</TableCell>
						<TableCell>right</TableCell>
					</TableRow>
				</Wrapper>
				<Wrapper>
					<TableRow>
						<TableCell>bottom right</TableCell>
					</TableRow>
				</Wrapper>
			</TableProcessorWithContainerStyles>
		);
		const markup = new DOMParser().parseFromString(renderToStaticMarkup(children), 'text/html');
		const cells = Array.from(markup.querySelectorAll('td'));
		const left = cells.find((cell) => cell.textContent === 'left');
		const bottomRight = cells.find((cell) => cell.textContent === 'bottom right');
		expect(left?.getAttribute('data-reaches-top')).toBe('true');
		expect(left?.getAttribute('data-reaches-bottom')).toBe('true');
		expect(left?.hasAttribute('data-reaches-left')).toBe(false);
		expect(bottomRight?.getAttribute('data-reaches-bottom')).toBe('true');
		expect(bottomRight?.getAttribute('data-reaches-right')).toBe('true');
	});

	it('clears stale interior edge props instead of preserving a former edge', () => {
		const output = withTableCellEdgeProps(<TableCell reachesLeft>cell</TableCell>);
		const markup = renderToStaticMarkup(
			<table>
				<tbody>
					<tr>{output}</tr>
				</tbody>
			</table>,
		);
		expect(markup).not.toContain('data-reaches-left');
	});

	it('preserves the original children if rendered rows do not match the document', () => {
		mockExpEnabled('platform_editor_table_q4_perf_patch');
		setupEditorExperiments('test', { platform_editor_table_q4_loveability: true });
		const node = schema.nodeFromJSON(table(tr([td()(p('one cell'))])));
		renderWithIntl(renderTable(node));
		expect(screen.getAllByRole('cell')).toHaveLength(9);
		expect(screen.getAllByRole('cell')[0]).not.toHaveAttribute('data-reaches-top');
	});
});
