// eslint-disable-next-line import/no-extraneous-dependencies
import { uuid } from '@atlaskit/adf-schema';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, table, td, th, tr, strong } from '@atlaskit/editor-test-helpers/doc-builder';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { tableNewColumnMinWidth } from '../../../table-map';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('handle paste', () => {
	beforeAll(() => {
		uuid.setStatic(TABLE_LOCAL_ID);
	});

	afterAll(() => {
		uuid.setStatic(false);
	});

	const createEditor = createEditorFactory();

	const editor = (doc: DocBuilder) => {
		return createEditor({
			doc,
			editorProps: {
				allowTables: {
					allowColumnResizing: true,
					allowNestedTables: true,
				},
			},
		});
	};

	describe('paste table cells with headers', () => {
		const localId = TABLE_LOCAL_ID;

		// Helper functions to generate table html
		const generateTable = (...rows: string[]) => `<meta charset='utf-8'>
      <table>
      <tbody>
      ${rows.join('')}
      </tbody>
      </table>`;
		const row = (...rowContents: string[]) => `<tr>${rowContents.join('')}</tr>`;
		const headerCell = (contents: string) => `<th><p>${contents}</p></th>`;
		const tableCell = (contents: string) => `<td><p>${contents}</p></td>`;

		// Test pasting html into document
		function test(original: DocBuilder, html: string, expected: DocBuilder) {
			const { editorView } = editor(original);

			dispatchPasteEvent(editorView, { html });
			expect(editorView.state.doc).toEqualDocument(expected);
		}

		it('should remove header cells if table being pasted into has no headers', () => {
			test(
				doc(table({ localId })(tr(td()(p('{<>}'))))),
				generateTable(row(headerCell('A'), headerCell('B'), headerCell('C'))),
				doc(table({ localId })(tr(td()(p('A')), td()(p('B')), td()(p('C'))))),
			);
		});

		it('should add header cells if table being pasted into has headers', () => {
			test(
				doc(table({ localId })(tr(th()(p('{<>}'))))),
				generateTable(row(tableCell('A'), tableCell('B'), tableCell('C'))),
				doc(table({ localId })(tr(th()(p('A')), th()(p('B')), th()(p('C'))))),
			);
		});

		it('should maintain row and column header only if all pasted cells are headers', () => {
			test(
				doc(table({ localId })(tr(th()(p('{<>}'))))),
				generateTable(
					row(headerCell('A'), headerCell('B'), headerCell('C')),
					row(headerCell('D'), headerCell('E'), headerCell('F')),
				),
				doc(
					table({ localId })(
						tr(th()(p('A')), th()(p('B')), th()(p('C'))),
						tr(th()(p('D')), td()(p('E')), td()(p('F'))),
					),
				),
			);
		});

		it('should maintain original table header (row and columns) if pasting in table cells', () => {
			test(
				doc(table({ localId })(tr(th()(p('{<>}')), th()(p(''))), tr(th()(p('')), td()(p(''))))),
				generateTable(
					row(tableCell('A'), tableCell('B'), tableCell('C')),
					row(tableCell('D'), tableCell('E'), tableCell('F')),
				),
				doc(
					table({ localId })(
						tr(th()(p('A')), th()(p('B')), th()(p('C'))),
						tr(th()(p('D')), td()(p('E')), td()(p('F'))),
					),
				),
			);
		});

		it('should maintain original table header (row and columns) and extend table size if pasting in table cells into second row', () => {
			test(
				doc(table({ localId })(tr(th()(p('')), th()(p(''))), tr(th()(p('{<>}')), td()(p(''))))),
				generateTable(
					row(tableCell('A'), tableCell('B'), tableCell('C')),
					row(tableCell('D'), tableCell('E'), tableCell('F')),
				),
				doc(
					table({ localId })(
						tr(th()(p('')), th()(p('')), th()(p(''))),
						tr(th()(p('A')), td()(p('B')), td()(p('C'))),
						tr(th()(p('D')), td()(p('E')), td()(p('F'))),
					),
				),
			);
		});

		it('should maintain original table header columns and extend table size if pasting in table cells into second row', () => {
			test(
				doc(table({ localId })(tr(th()(p('')), td()(p(''))), tr(th()(p('{<>}')), td()(p(''))))),
				generateTable(
					row(tableCell('A'), tableCell('B'), tableCell('C')),
					row(tableCell('D'), tableCell('E'), tableCell('F')),
				),
				doc(
					table({ localId })(
						tr(th()(p('')), td()(p('')), td()(p(''))),
						tr(th()(p('A')), td()(p('B')), td()(p('C'))),
						tr(th()(p('D')), td()(p('E')), td()(p('F'))),
					),
				),
			);
		});

		it('should maintain original table header rows and extend table size if pasting in table cells into second row', () => {
			test(
				doc(table({ localId })(tr(th()(p('')), th()(p(''))), tr(td()(p('{<>}')), td()(p(''))))),
				generateTable(
					row(tableCell('A'), tableCell('B'), tableCell('C')),
					row(tableCell('D'), tableCell('E'), tableCell('F')),
				),
				doc(
					table({ localId })(
						tr(th()(p('')), th()(p('')), th()(p(''))),
						tr(td()(p('A')), td()(p('B')), td()(p('C'))),
						tr(td()(p('D')), td()(p('E')), td()(p('F'))),
					),
				),
			);
		});

		it('should maintain original table header rows if pasting in table row', () => {
			test(
				doc(table({ localId })(tr(th()(p('')), th()(p(''))), tr(td()(p('{<>}')), td()(p(''))))),
				row(tableCell('A'), tableCell('B'), tableCell('C')),
				doc(
					table({ localId })(
						tr(th()(p('')), th()(p('')), th()(p(''))),
						tr(td()(p('A')), td()(p('B')), td()(p('C'))),
					),
				),
			);
		});

		it('should maintain original table header rows if pasting in table row with headers', () => {
			test(
				doc(table({ localId })(tr(th()(p('')), th()(p(''))), tr(td()(p('{<>}')), td()(p(''))))),
				row(headerCell('A'), headerCell('B'), headerCell('C')),
				doc(
					table({ localId })(
						tr(th()(p('')), th()(p('')), th()(p(''))),
						tr(td()(p('A')), td()(p('B')), td()(p('C'))),
					),
				),
			);
		});

		it('should maintain original table header rows if pasting in table cell with header', () => {
			test(
				doc(table({ localId })(tr(th()(p('')), th()(p(''))), tr(td()(p('{<>}')), td()(p(''))))),
				headerCell('A'),
				doc(table({ localId })(tr(th()(p('')), th()(p(''))), tr(td()(p('A')), td()(p(''))))),
			);
		});

		it('should maintain original table header rows if pasting in table cell into header column', () => {
			test(
				doc(table({ localId })(tr(th()(p('')), th()(p(''))), tr(th()(p('{<>}')), td()(p(''))))),
				tableCell('A'),
				doc(table({ localId })(tr(th()(p('')), th()(p(''))), tr(th()(p('A')), td()(p(''))))),
			);
		});
	});

	describe('paste table cells with resized column widths', () => {
		const htmlTableCellsWithResizedColumnWidths = `
      <meta charset='utf-8'>
      <table data-number-column="false" data-layout="default" data-autosize="false" data-table-local-id="test" data-pm-slice="1 1 []">
      <tbody>
      <tr>
      <td data-colwidth="51" class="pm-table-cell-content-wrap"><p>A</p></td>
      <td data-colwidth="58" class="pm-table-cell-content-wrap"><p>B</p></td>
      <td data-colwidth="650" class="pm-table-cell-content-wrap"><p>C</p></td>
      </tr>
      </tbody>
      </table>`;

		describe('into empty part of the document', () => {
			it('should keep the column widths of the copied table', () => {
				const { editorView } = editor(doc(p('{<>}')));

				dispatchPasteEvent(editorView, {
					html: htmlTableCellsWithResizedColumnWidths,
				});

				const expectedResult = doc(
					table({
						isNumberColumnEnabled: false,
						layout: 'default',
						localId: 'test',
					})(
						tr(
							td({ colwidth: [51] })(p('A')),
							td({ colwidth: [58] })(p('B')),
							td({ colwidth: [650] })(p('C')),
						),
					),
				);

				expect(editorView.state.doc).toEqualDocument(expectedResult);
			});
		});

		describe('into an existing table', () => {
			it('should keep the column widths of the destination table', () => {
				const { editorView } = editor(
					doc(
						table({
							isNumberColumnEnabled: false,
							layout: 'default',
							localId: 'test',
						})(
							tr(td({})(p('{<>}')), td({})(p()), td({})(p())),
							tr(td({})(p()), td({})(p()), td({})(p())),
							tr(td({})(p()), td({})(p()), td({})(p())),
						),
					),
				);

				dispatchPasteEvent(editorView, {
					html: htmlTableCellsWithResizedColumnWidths,
				});

				const expectedResult = doc(
					table({
						isNumberColumnEnabled: false,
						layout: 'default',
						localId: 'test',
					})(
						tr(td({ colwidth: undefined })(p('A')), td({})(p('B')), td({})(p('C'))),
						tr(td({ colwidth: undefined })(p()), td({})(p()), td({})(p())),
						tr(td({ colwidth: undefined })(p()), td({})(p()), td({})(p())),
					),
				);

				expect(editorView.state.doc).toEqualDocument(expectedResult);
			});

			it('should add a new column with a set width to the destination table', () => {
				const { editorView } = editor(
					doc(
						table({
							isNumberColumnEnabled: false,
							layout: 'default',
							localId: 'test',
						})(
							tr(
								td({ colwidth: [150] })(p()),
								td({ colwidth: [120] })(p()),
								td({ colwidth: [90] })(p()),
							),
							tr(
								td({ colwidth: [150] })(p()),
								td({ colwidth: [120] })(p()),
								td({ colwidth: [90] })(p()),
							),
							tr(
								td({ colwidth: [150] })(p()),
								td({ colwidth: [120] })(p('{<>}')),
								td({ colwidth: [90] })(p()),
							),
						),
					),
				);

				dispatchPasteEvent(editorView, {
					html: htmlTableCellsWithResizedColumnWidths,
				});

				const expectedResult = doc(
					table({
						isNumberColumnEnabled: false,
						layout: 'default',
						localId: 'test',
					})(
						tr(
							td({ colwidth: [150] })(p()),
							td({ colwidth: [120] })(p()),
							td({ colwidth: [90] })(p()),
							td({ colwidth: [650] })(p()),
						),
						tr(
							td({ colwidth: [150] })(p()),
							td({ colwidth: [120] })(p()),
							td({ colwidth: [90] })(p()),
							td({ colwidth: [650] })(p()),
						),
						tr(
							td({ colwidth: [150] })(p()),
							td({ colwidth: [120] })(p('A')),
							td({ colwidth: [90] })(p('B')),
							td({ colwidth: [650] })(p('C')),
						),
					),
				);

				expect(editorView.state.doc).toEqualDocument(expectedResult);
			});
		});
	});

	describe('paste table cells without column widths into a table with resized columns', () => {
		const htmlTableCellsWithResizedColumnWidths = `
		<meta charset='utf-8'>
		<table data-number-column="false" data-layout="default" data-autosize="false" data-table-local-id="test" data-pm-slice="1 1 []">
		<tbody>
		<tr>
		<td class="pm-table-cell-content-wrap"><p>A</p></td>
		<td class="pm-table-cell-content-wrap"><p>B</p></td>
		<td class="pm-table-cell-content-wrap"><p>C</p></td>
		</tr>
		</tbody>
		</table>`;

		it('should keep destination column widths and add a new column with a set width to the destination table', () => {
			const { editorView } = editor(
				doc(
					table({
						isNumberColumnEnabled: false,
						layout: 'default',
						localId: 'test',
					})(
						tr(
							td({ colwidth: [150] })(p()),
							td({ colwidth: [120] })(p()),
							td({ colwidth: [90] })(p()),
						),
						tr(
							td({ colwidth: [150] })(p()),
							td({ colwidth: [120] })(p()),
							td({ colwidth: [90] })(p()),
						),
						tr(
							td({ colwidth: [150] })(p()),
							td({ colwidth: [120] })(p('{<>}')),
							td({ colwidth: [90] })(p()),
						),
					),
				),
			);

			dispatchPasteEvent(editorView, {
				html: htmlTableCellsWithResizedColumnWidths,
			});

			const expectedResult = doc(
				table({
					isNumberColumnEnabled: false,
					layout: 'default',
					localId: 'test',
				})(
					tr(
						td({ colwidth: [150] })(p()),
						td({ colwidth: [120] })(p()),
						td({ colwidth: [90] })(p()),
						td({ colwidth: [tableNewColumnMinWidth] })(p()),
					),
					tr(
						td({ colwidth: [150] })(p()),
						td({ colwidth: [120] })(p()),
						td({ colwidth: [90] })(p()),
						td({ colwidth: [tableNewColumnMinWidth] })(p()),
					),
					tr(
						td({ colwidth: [150] })(p()),
						td({ colwidth: [120] })(p('A')),
						td({ colwidth: [90] })(p('B')),
						td({ colwidth: [tableNewColumnMinWidth] })(p('C')),
					),
				),
			);

			expect(editorView.state.doc).toEqualDocument(expectedResult);
		});
	});

	describe('paste table into a table', () => {
		const htmlTable2x2 = (partial: boolean = false) => `
					<meta charset="utf-8" />
					<html><head></head>
					<body>
						<table data-number-column="false" data-layout="default" data-autosize="false"
							data-table-local-id="${TABLE_LOCAL_ID}" data-pm-slice="${partial ? '1 1' : '0 0'} []">
							<tbody>
								<tr>
									<th><p><strong>1</strong></p></th>
									<th><p><strong>2</strong></p></th>
								</tr>
								<tr>
									<td> <p>3</p></td>
									<td><p>4</p></td>
								</tr>
							</tbody>
						</table>
					</body>
					</html>`;
		ffTest.on(
			'platform_editor_use_nested_table_pm_nodes',
			'with nested table nodes enabled',
			() => {
				const localId = TABLE_LOCAL_ID;
				eeTest
					.describe('nested-tables-in-tables', 'when nested tables are enabled')
					.variant(true, () => {
						it('pastes as nested table', () => {
							const { editorView } = editor(
								doc(
									table({ localId })(
										tr(th()(p(strong('1'))), th()(p(strong('2'))), th()(p(strong('3')))),
										tr(td()(p('4')), td()(p('5')), td()(p('6'))),
										tr(td()(p('7')), td()(p('8{<>}')), td()(p('9'))),
									),
								),
							);

							dispatchPasteEvent(editorView, {
								html: htmlTable2x2(),
							});

							const expectedResult = doc(
								table({ localId })(
									tr(th()(p(strong('1'))), th()(p(strong('2'))), th()(p(strong('3')))),
									tr(td()(p('4')), td()(p('5')), td()(p('6'))),
									tr(
										td()(p('7')),
										td()(
											p('8'),
											table({ localId })(
												tr(th()(p(strong('1'))), th()(p(strong('2')))),
												tr(td()(p('3')), td()(p('4'))),
											),
										),
										td()(p('9')),
									),
								),
							);

							expect(editorView.state.doc).toEqualDocument(expectedResult);
						});

						it('pastes as nested table inside a table header', () => {
							const { editorView } = editor(
								doc(
									table({ localId })(
										tr(th()(p(strong('1'))), th()(p(strong('2'))), th()(p(strong('3')))),
										tr(td()(p('4')), td()(p('5')), td()(p('6'))),
										tr(td()(p('7')), td()(p('8{<>}')), td()(p('9'))),
									),
								),
							);

							dispatchPasteEvent(editorView, {
								html: htmlTable2x2(),
							});

							const expectedResult = doc(
								table({ localId })(
									tr(th()(p(strong('1'))), th()(p(strong('2'))), th()(p(strong('3')))),
									tr(td()(p('4')), td()(p('5')), td()(p('6'))),
									tr(
										td()(p('7')),
										td()(
											p('8'),
											table({ localId })(
												tr(th()(p(strong('1'))), th()(p(strong('2')))),
												tr(td()(p('3')), td()(p('4'))),
											),
										),
										td()(p('9')),
									),
								),
							);

							expect(editorView.state.doc).toEqualDocument(expectedResult);
						});

						it('merges partial table as nested table', () => {
							const { editorView } = editor(
								doc(
									table({ localId })(
										tr(th()(p(strong('1'))), th()(p(strong('2'))), th()(p(strong('3')))),
										tr(td()(p('4')), td()(p('5')), td()(p('6'))),
										tr(td()(p('7')), td()(p('8{<>}')), td()(p('9'))),
									),
								),
							);

							dispatchPasteEvent(editorView, {
								html: htmlTable2x2(true),
							});

							const expectedResult = doc(
								table({ localId })(
									tr(th()(p(strong('1'))), th()(p(strong('2'))), th()(p(strong('3')))),
									tr(td()(p('4')), td()(p('5')), td()(p('6'))),
									tr(td()(p('7')), td()(p(strong('1'))), td()(p(strong('2')))),
									tr(td()(p()), td()(p('3')), td()(p('4'))),
								),
							);

							expect(editorView.state.doc).toEqualDocument(expectedResult);
						});
					});

				eeTest
					.describe('nested-tables-in-tables', 'when nested tables are disabled')
					.variant(false, () => {
						it('merges the nested table', () => {
							const { editorView } = editor(
								doc(
									table({ localId })(
										tr(th()(p(strong('1'))), th()(p(strong('2'))), th()(p(strong('3')))),
										tr(td()(p('4')), td()(p('5')), td()(p('6'))),
										tr(td()(p('7')), td()(p('8{<>}')), td()(p('9'))),
									),
								),
							);

							dispatchPasteEvent(editorView, {
								html: htmlTable2x2(),
							});

							const expectedResult = doc(
								table({ localId })(
									tr(th()(p(strong('1'))), th()(p(strong('2'))), th()(p(strong('3')))),
									tr(td()(p('4')), td()(p('5')), td()(p('6'))),
									tr(td()(p('7')), td()(p(strong('1'))), td()(p(strong('2')))),
									tr(td()(p()), td()(p('3')), td()(p('4'))),
								),
							);

							expect(editorView.state.doc).toEqualDocument(expectedResult);
						});

						// eslint-disable-next-line jest/no-identical-title
						it('merges partial table as nested table', () => {
							const { editorView } = editor(
								doc(
									table({ localId })(
										tr(th()(p(strong('1'))), th()(p(strong('2'))), th()(p(strong('3')))),
										tr(td()(p('4')), td()(p('5')), td()(p('6'))),
										tr(td()(p('7')), td()(p('8{<>}')), td()(p('9'))),
									),
								),
							);

							dispatchPasteEvent(editorView, {
								html: htmlTable2x2(true),
							});

							const expectedResult = doc(
								table({ localId })(
									tr(th()(p(strong('1'))), th()(p(strong('2'))), th()(p(strong('3')))),
									tr(td()(p('4')), td()(p('5')), td()(p('6'))),
									tr(td()(p('7')), td()(p(strong('1'))), td()(p(strong('2')))),
									tr(td()(p()), td()(p('3')), td()(p('4'))),
								),
							);

							expect(editorView.state.doc).toEqualDocument(expectedResult);
						});
					});
			},
		);
	});
});
