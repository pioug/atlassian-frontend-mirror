import { p, tr, table, td, th } from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import { TableMap } from '../../../table-map';
import { determineTableHeaderStateFromTableNode } from '../../analyse-table';
import { tableNodeTypes } from '../../table-node-types';

const types = tableNodeTypes(defaultSchema);

describe('analyseTable', () => {
	describe('for 5x5 tables with no merged cells', () => {
		it('returns (false, false) when there is no header row and no header column', () => {
			const tableNode = table()(
				tr(td()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(td()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(td()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(td()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(td()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
			)(defaultSchema);

			const tableMap = TableMap.get(tableNode);
			const result = determineTableHeaderStateFromTableNode(tableNode, tableMap, types);

			expect(result).toEqual({ rowHeaderEnabled: false, columnHeaderEnabled: false });
		});

		it('returns (true, false) when there is a header row and no header column', () => {
			const tableNode = table()(
				tr(th()(p()), th()(p()), th()(p()), th()(p()), th()(p())),
				tr(td()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(td()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(td()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(td()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
			)(defaultSchema);

			const tableMap = TableMap.get(tableNode);
			const result = determineTableHeaderStateFromTableNode(tableNode, tableMap, types);

			expect(result).toEqual({ rowHeaderEnabled: true, columnHeaderEnabled: false });
		});

		it('returns (false, true) when there is no header row and a header column', () => {
			const tableNode = table()(
				tr(th()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(th()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(th()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(th()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(th()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
			)(defaultSchema);

			const tableMap = TableMap.get(tableNode);
			const result = determineTableHeaderStateFromTableNode(tableNode, tableMap, types);

			expect(result).toEqual({ rowHeaderEnabled: false, columnHeaderEnabled: true });
		});

		it('returns (true, true) when there is a header row and a header column', () => {
			const tableNode = table()(
				tr(th()(p()), th()(p()), th()(p()), th()(p()), th()(p())),
				tr(th()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(th()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(th()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
				tr(th()(p()), td()(p()), td()(p()), td()(p()), td()(p())),
			)(defaultSchema);

			const tableMap = TableMap.get(tableNode);
			const result = determineTableHeaderStateFromTableNode(tableNode, tableMap, types);

			expect(result).toEqual({ rowHeaderEnabled: true, columnHeaderEnabled: true });
		});
	});

	describe('for 5x5 tables with merged cells', () => {
		eeTest('platform_editor_analyse_table_with_merged_cells', {
			// returns (true, false) when there is a header row and no header column
			true: () => {
				// cell (0,0) and cell (1,0) are merged
				const tableNode = table()(
					tr(th({"rowspan": 2})(p()), th({})(p()), th({})(p()), th({})(p()), th({})(p())),
					tr(td({})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(td({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(td({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(td({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p()))
				)(defaultSchema);
	
				const tableMap = TableMap.get(tableNode);
				const result = determineTableHeaderStateFromTableNode(tableNode, tableMap, types);
	
				expect(result).toEqual({ rowHeaderEnabled: true, columnHeaderEnabled: false });
			},
			// returns (true, true) when there is a header row and no header column
			false: () => {
				// cell (0,0) and cell (1,0) are merged
				const tableNode = table()(
					tr(th({"rowspan": 2})(p()), th({})(p()), th({})(p()), th({})(p()), th({})(p())),
					tr(td({})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(td({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(td({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(td({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p()))
				)(defaultSchema);
	
				const tableMap = TableMap.get(tableNode);
				const result = determineTableHeaderStateFromTableNode(tableNode, tableMap, types);
	
				expect(result).toEqual({ rowHeaderEnabled: true, columnHeaderEnabled: true });
			},
		});

		eeTest('platform_editor_analyse_table_with_merged_cells', {
			// returns (false, true) when there is no header row and a header column
			true: () => {
				// cell (0,0) and cell (0,1) are merged
				const tableNode = table()(
					tr(th({"colspan": 2})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(th({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(th({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(th({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(th({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p()))
				)(defaultSchema);
	
				const tableMap = TableMap.get(tableNode);
				const result = determineTableHeaderStateFromTableNode(tableNode, tableMap, types);
	
				expect(result).toEqual({ rowHeaderEnabled: false, columnHeaderEnabled: true });
			},
			// returns (true, true) when there is no header row and a header column
			false: () => {
				// cell (0,0) and cell (0,1) are merged
				const tableNode = table()(
					tr(th({"colspan": 2})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(th({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(th({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(th({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p())),
					tr(th({})(p()), td({})(p()), td({})(p()), td({})(p()), td({})(p()))
				)(defaultSchema);
	
				const tableMap = TableMap.get(tableNode);
				const result = determineTableHeaderStateFromTableNode(tableNode, tableMap, types);
	
				expect(result).toEqual({ rowHeaderEnabled: true, columnHeaderEnabled: true });
			},
		});
	});
});
