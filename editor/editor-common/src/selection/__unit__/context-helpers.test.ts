import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { NodeSelection, EditorState } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	...jest.requireActual<any>('@atlaskit/platform-feature-flags'),
	fg: jest.fn().mockReturnValue(true),
}));

import { getLocalIdsFromSelection } from '../getLocalIdsFromSelection';

const createEditorState = (doc: any) =>
	EditorState.create({
		doc,
		schema: defaultSchema,
	});

describe('getLocalIdsFromSelection', () => {
	describe('NodeSelection', () => {
		it('should return all descendant localIds when a table is NodeSelected', () => {
			const { table, tableRow, tableCell, paragraph } = defaultSchema.nodes;

			const doc = defaultSchema.nodes.doc.create(
				{},
				table.create({ localId: 'table-1' }, [
					tableRow.create({ localId: 'row-1' }, [
						tableCell.create({ localId: 'cell-1' }, [
							paragraph.create({ localId: 'p-1' }, [defaultSchema.text('Hello')]),
						]),
						tableCell.create({ localId: 'cell-2' }, [
							paragraph.create({ localId: 'p-2' }, [defaultSchema.text('World')]),
						]),
					]),
				]),
			);

			const state = createEditorState(doc);
			// Position 0 is before the doc content, position 1 is the start of the table
			const tablePos = 0;
			const selection = NodeSelection.create(state.doc, tablePos);

			const result = getLocalIdsFromSelection(selection);

			expect(result).toEqual(['table-1', 'row-1', 'cell-1', 'p-1', 'cell-2', 'p-2']);
		});

		it('should return all descendant localIds when a table with multiple rows is NodeSelected', () => {
			const { table, tableRow, tableCell, paragraph } = defaultSchema.nodes;

			const doc = defaultSchema.nodes.doc.create(
				{},
				table.create({ localId: 'table-1' }, [
					tableRow.create({ localId: 'row-1' }, [
						tableCell.create({ localId: 'cell-1' }, [
							paragraph.create({ localId: 'p-1' }, [defaultSchema.text('A')]),
						]),
						tableCell.create({ localId: 'cell-2' }, [
							paragraph.create({ localId: 'p-2' }, [defaultSchema.text('B')]),
						]),
					]),
					tableRow.create({ localId: 'row-2' }, [
						tableCell.create({ localId: 'cell-3' }, [
							paragraph.create({ localId: 'p-3' }, [defaultSchema.text('C')]),
						]),
						tableCell.create({ localId: 'cell-4' }, [
							paragraph.create({ localId: 'p-4' }, [defaultSchema.text('D')]),
						]),
					]),
				]),
			);

			const state = createEditorState(doc);
			const selection = NodeSelection.create(state.doc, 0);

			const result = getLocalIdsFromSelection(selection);

			expect(result).toEqual([
				'table-1',
				'row-1',
				'cell-1',
				'p-1',
				'cell-2',
				'p-2',
				'row-2',
				'cell-3',
				'p-3',
				'cell-4',
				'p-4',
			]);
		});

		it('should handle NodeSelection on a layoutSection with columns', () => {
			const { layoutSection, layoutColumn, paragraph } = defaultSchema.nodes;

			const doc = defaultSchema.nodes.doc.create(
				{},
				layoutSection.create({ localId: 'layout-1' }, [
					layoutColumn.create({ localId: 'col-1' }, [
						paragraph.create({ localId: 'p-1' }, [defaultSchema.text('Left')]),
					]),
					layoutColumn.create({ localId: 'col-2' }, [
						paragraph.create({ localId: 'p-2' }, [defaultSchema.text('Right')]),
					]),
				]),
			);

			const state = createEditorState(doc);
			const selection = NodeSelection.create(state.doc, 0);

			const result = getLocalIdsFromSelection(selection);

			expect(result).toEqual(['layout-1', 'col-1', 'p-1', 'col-2', 'p-2']);
		});

		it('should handle NodeSelection on a node without localId descendants', () => {
			const { paragraph } = defaultSchema.nodes;

			const doc = defaultSchema.nodes.doc.create(
				{},
				paragraph.create({ localId: 'p-1' }, [defaultSchema.text('Hello')]),
			);

			const state = createEditorState(doc);
			const selection = NodeSelection.create(state.doc, 0);

			const result = getLocalIdsFromSelection(selection);

			expect(result).toEqual(['p-1']);
		});

		it('should skip nodes without localId attribute', () => {
			const { table, tableRow, tableCell, paragraph } = defaultSchema.nodes;

			const doc = defaultSchema.nodes.doc.create(
				{},
				table.create({ localId: 'table-1' }, [
					tableRow.create({}, [
						tableCell.create({}, [
							paragraph.create({ localId: 'p-1' }, [defaultSchema.text('Hello')]),
						]),
					]),
				]),
			);

			const state = createEditorState(doc);
			const selection = NodeSelection.create(state.doc, 0);

			const result = getLocalIdsFromSelection(selection);

			expect(result).toEqual(['table-1', 'p-1']);
		});
	});

	describe('CellSelection', () => {
		it('should return all selected cell localIds, descendants, and ancestors when whole table is CellSelected', () => {
			const { table, tableRow, tableCell, paragraph } = defaultSchema.nodes;

			const doc = defaultSchema.nodes.doc.create(
				{},
				table.create({ localId: 'table-1' }, [
					tableRow.create({ localId: 'row-1' }, [
						tableCell.create({ localId: 'cell-1' }, [
							paragraph.create({ localId: 'p-1' }, [defaultSchema.text('A')]),
						]),
						tableCell.create({ localId: 'cell-2' }, [
							paragraph.create({ localId: 'p-2' }, [defaultSchema.text('B')]),
						]),
					]),
					tableRow.create({ localId: 'row-2' }, [
						tableCell.create({ localId: 'cell-3' }, [
							paragraph.create({ localId: 'p-3' }, [defaultSchema.text('C')]),
						]),
						tableCell.create({ localId: 'cell-4' }, [
							paragraph.create({ localId: 'p-4' }, [defaultSchema.text('D')]),
						]),
					]),
				]),
			);

			const state = createEditorState(doc);
			const cellPositions: number[] = [];
			state.doc.descendants((node, pos) => {
				if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
					cellPositions.push(pos);
				}
			});
			const $anchorCell = state.doc.resolve(cellPositions[0]);
			const $headCell = state.doc.resolve(cellPositions[cellPositions.length - 1]);
			const selection = new CellSelection($anchorCell, $headCell);

			const result = getLocalIdsFromSelection(selection);

			// Should contain all cell + descendant IDs, plus ancestor IDs (row, table)
			expect(result).toContain('table-1');
			expect(result).toContain('row-1');
			expect(result).toContain('cell-1');
			expect(result).toContain('p-1');
			expect(result).toContain('cell-2');
			expect(result).toContain('p-2');
			expect(result).toContain('row-2');
			expect(result).toContain('cell-3');
			expect(result).toContain('p-3');
			expect(result).toContain('cell-4');
			expect(result).toContain('p-4');
			expect(result).toHaveLength(11);
		});

		it('should return only selected cells, descendants, and ancestors for partial CellSelection', () => {
			const { table, tableRow, tableCell, paragraph } = defaultSchema.nodes;

			const doc = defaultSchema.nodes.doc.create(
				{},
				table.create({ localId: 'table-1' }, [
					tableRow.create({ localId: 'row-1' }, [
						tableCell.create({ localId: 'cell-1' }, [
							paragraph.create({ localId: 'p-1' }, [defaultSchema.text('A')]),
						]),
						tableCell.create({ localId: 'cell-2' }, [
							paragraph.create({ localId: 'p-2' }, [defaultSchema.text('B')]),
						]),
					]),
					tableRow.create({ localId: 'row-2' }, [
						tableCell.create({ localId: 'cell-3' }, [
							paragraph.create({ localId: 'p-3' }, [defaultSchema.text('C')]),
						]),
						tableCell.create({ localId: 'cell-4' }, [
							paragraph.create({ localId: 'p-4' }, [defaultSchema.text('D')]),
						]),
					]),
				]),
			);

			const state = createEditorState(doc);
			const cellPositions: number[] = [];
			state.doc.descendants((node, pos) => {
				if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
					cellPositions.push(pos);
				}
			});
			// Select only the first two cells (row 1)
			const $anchorCell = state.doc.resolve(cellPositions[0]);
			const $headCell = state.doc.resolve(cellPositions[1]);
			const selection = new CellSelection($anchorCell, $headCell);

			const result = getLocalIdsFromSelection(selection);

			// Should contain only cell-1, cell-2 and their content + ancestors
			expect(result).toContain('table-1');
			expect(result).toContain('row-1');
			expect(result).toContain('cell-1');
			expect(result).toContain('p-1');
			expect(result).toContain('cell-2');
			expect(result).toContain('p-2');
			// Should NOT contain unselected cells
			expect(result).not.toContain('row-2');
			expect(result).not.toContain('cell-3');
			expect(result).not.toContain('p-3');
			expect(result).not.toContain('cell-4');
			expect(result).not.toContain('p-4');
			expect(result).toHaveLength(6);
		});
		it('should collect descendant localIds from rich content inside cells (bulletList, listItems)', () => {
			const { table, tableRow, tableCell, paragraph, bulletList, listItem } = defaultSchema.nodes;

			const doc = defaultSchema.nodes.doc.create(
				{},
				table.create({ localId: 'table-1' }, [
					tableRow.create({ localId: 'row-1' }, [
						tableCell.create({ localId: 'cell-1' }, [
							bulletList.create({ localId: 'list-1' }, [
								listItem.create({ localId: 'li-1' }, [
									paragraph.create({ localId: 'p-1' }, [defaultSchema.text('Item 1')]),
								]),
								listItem.create({ localId: 'li-2' }, [
									paragraph.create({ localId: 'p-2' }, [defaultSchema.text('Item 2')]),
								]),
							]),
						]),
						tableCell.create({ localId: 'cell-2' }, [
							paragraph.create({ localId: 'p-3' }, [defaultSchema.text('Simple')]),
						]),
					]),
				]),
			);

			const state = createEditorState(doc);
			const cellPositions: number[] = [];
			state.doc.descendants((node, pos) => {
				if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
					cellPositions.push(pos);
				}
			});
			const $anchorCell = state.doc.resolve(cellPositions[0]);
			const $headCell = state.doc.resolve(cellPositions[cellPositions.length - 1]);
			const selection = new CellSelection($anchorCell, $headCell);

			const result = getLocalIdsFromSelection(selection);

			expect(result).toContain('table-1');
			expect(result).toContain('row-1');
			expect(result).toContain('cell-1');
			expect(result).toContain('list-1');
			expect(result).toContain('li-1');
			expect(result).toContain('p-1');
			expect(result).toContain('li-2');
			expect(result).toContain('p-2');
			expect(result).toContain('cell-2');
			expect(result).toContain('p-3');
			expect(result).toHaveLength(10);
		});

		it('should return single cell localId, descendants, and ancestors for single cell CellSelection', () => {
			const { table, tableRow, tableCell, paragraph } = defaultSchema.nodes;

			const doc = defaultSchema.nodes.doc.create(
				{},
				table.create({ localId: 'table-1' }, [
					tableRow.create({ localId: 'row-1' }, [
						tableCell.create({ localId: 'cell-1' }, [
							paragraph.create({ localId: 'p-1' }, [defaultSchema.text('A')]),
						]),
						tableCell.create({ localId: 'cell-2' }, [
							paragraph.create({ localId: 'p-2' }, [defaultSchema.text('B')]),
						]),
					]),
				]),
			);

			const state = createEditorState(doc);
			const cellPositions: number[] = [];
			state.doc.descendants((node, pos) => {
				if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
					cellPositions.push(pos);
				}
			});
			// Select only the first cell
			const $anchorCell = state.doc.resolve(cellPositions[0]);
			const selection = new CellSelection($anchorCell, $anchorCell);

			const result = getLocalIdsFromSelection(selection);

			expect(result).toContain('table-1');
			expect(result).toContain('row-1');
			expect(result).toContain('cell-1');
			expect(result).toContain('p-1');
			// Should NOT contain unselected cell
			expect(result).not.toContain('cell-2');
			expect(result).not.toContain('p-2');
			expect(result).toHaveLength(4);
		});
	});
});
