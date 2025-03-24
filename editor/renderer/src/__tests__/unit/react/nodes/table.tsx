import React from 'react';
import {
	akEditorTableNumberColumnWidth,
	akEditorDefaultLayoutWidth,
	akEditorTableLegacyCellMinWidth as tableCellMinWidth,
} from '@atlaskit/editor-shared-styles';
import type { TableLayout } from '@atlaskit/adf-schema';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { inlineCard, p, table, td, th, tr } from '@atlaskit/adf-utils/builders';
import Table, { TableProcessor } from '../../../../react/nodes/table';
import { TableCell, TableHeader } from '../../../../react/nodes/tableCell';
import TableRow from '../../../../react/nodes/tableRow';
import { Context as SmartCardStorageContext } from '../../../../ui/SmartCardStorage';
import type { RendererAppearance } from '../../../../ui/Renderer/types';
import { SortOrder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { shadowClassNames, shadowObserverClassNames } from '@atlaskit/editor-common/ui';
import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { RendererContextProvider } from '../../../../renderer-context';
import type { RendererContextProps } from '../../../../renderer-context';
import { ffTest } from '@atlassian/feature-flags-test-utils';

const checkColWidths = (table: ReactWrapper, expectedColWidths: number[]) => {
	table.find('col').forEach((col, index) => {
		expect(col.prop('style')!.width).toBe(`${expectedColWidths[index]}px`);
	});
};

const createTable = (width: number, layout: TableLayout) => {
	return schema.nodeFromJSON({
		...table(
			tr([th()(p('Header content 1')), th()(p('Header content 2')), th()(p('Header content 3'))]),
			tr([td()(p('Body content 1')), td()(p('Body content 2')), td()(p('Body content 3'))]),
		),
		attrs: { width, layout },
	});
};

const createDefaultTable = (displayMode?: string) => {
	return schema.nodeFromJSON({
		...table(
			tr([th()(p('Header content 1')), th()(p('Header content 2')), th()(p('Header content 3'))]),
			tr([td()(p('Body content 1')), td()(p('Body content 2')), td()(p('Body content 3'))]),
		),
		attrs: { layout: 'default', displayMode },
	});
};

const mountBasicTable = ({
	columnWidths,
	isNumberColumnEnabled = true,
	renderWidth = akEditorDefaultLayoutWidth,
	layout = 'default',
	rendererAppearance = 'full-page',
	isInsideOfBlockNode = false,
	allowTableResizing = false,
}: {
	columnWidths?: number[];
	isNumberColumnEnabled?: boolean;
	renderWidth?: number;
	layout?: TableLayout;
	rendererAppearance?: RendererAppearance;
	isInsideOfBlockNode?: boolean;
	allowTableResizing?: boolean;
} = {}) => {
	return mountWithIntl(
		<Table
			layout={layout}
			isNumberColumnEnabled={isNumberColumnEnabled}
			columnWidths={columnWidths}
			renderWidth={renderWidth}
			rendererAppearance={rendererAppearance}
			isInsideOfBlockNode={isInsideOfBlockNode}
			allowTableResizing={allowTableResizing}
		>
			<TableRow>
				<TableCell />
				<TableCell />
				<TableCell />
			</TableRow>
		</Table>,
	);
};

const mountTable = (
	node: PMNode,
	rendererWidth: number,
	columnWidths?: number[],
	appearance: RendererAppearance = 'full-page',
	isInsideOfBlockNode = false,
	allowTableAlignment = false,
	allowTableResizing = false,
	isInsideOfTable = false,
) => {
	return mountWithIntl(
		<Table
			layout={node.attrs.layout}
			renderWidth={rendererWidth}
			rendererAppearance={appearance}
			isNumberColumnEnabled={false}
			tableNode={node}
			columnWidths={columnWidths}
			isInsideOfBlockNode={isInsideOfBlockNode}
			isInsideOfTable={isInsideOfTable}
			allowTableAlignment={allowTableAlignment}
			allowTableResizing={allowTableResizing}
		>
			<TableRow>
				<TableHeader />
				<TableHeader />
				<TableHeader />
			</TableRow>
			<TableRow>
				<TableCell />
				<TableCell />
				<TableCell />
			</TableRow>
		</Table>,
	);
};

const mountTableWithFF = (
	featureFlags: RendererContextProps['featureFlags'],
	node: PMNode,
	rendererWidth: number,
	columnWidths?: number[],
	appearance: RendererAppearance = 'full-page',
	isInsideOfBlockNode = false,
	isTopLevelRenderer: RendererContextProps['isTopLevelRenderer'] = true,
	isInsideOfTable = false,
	allowTableResizing = false,
) => {
	return mountWithIntl(
		<RendererContextProvider value={{ featureFlags, isTopLevelRenderer }}>
			<Table
				layout={node.attrs.layout}
				renderWidth={rendererWidth}
				rendererAppearance={appearance}
				isNumberColumnEnabled={false}
				tableNode={node}
				columnWidths={columnWidths}
				isInsideOfBlockNode={isInsideOfBlockNode}
				isInsideOfTable={isInsideOfTable}
				allowTableResizing={allowTableResizing}
			>
				<TableRow>
					<TableHeader />
					<TableHeader />
					<TableHeader />
				</TableRow>
				<TableRow>
					<TableCell />
					<TableCell />
					<TableCell />
				</TableRow>
			</Table>
		</RendererContextProvider>,
	);
};

const schema = getSchemaBasedOnStage('stage0');

describe('Renderer - React/Nodes/Table', () => {
	const renderWidth = akEditorDefaultLayoutWidth;

	it('should render table DOM with all attributes', () => {
		const table = mountBasicTable({ renderWidth, layout: 'full-width' });
		expect(table.find('table')).toHaveLength(1);
		expect(table.find('div[data-layout="full-width"]')).toHaveLength(1);
		expect(table.find('table').prop('data-number-column')).toEqual(true);
		table.unmount();
	});

	it('should render table props', () => {
		const columnWidths = [100, 110, 120];
		const table = mountBasicTable({ columnWidths, renderWidth });
		expect(table.prop('layout')).toEqual('default');
		expect(table.prop('isNumberColumnEnabled')).toEqual(true);
		expect(table.prop('columnWidths')).toEqual(columnWidths);
		expect(table.find(TableRow).prop('isNumberColumnEnabled')).toEqual(true);
		table.unmount();
	});

	it('should NOT render a colgroup when columnWidths is an empty array', () => {
		const columnWidths: Array<number> = [];
		const table = mountBasicTable({
			columnWidths,
			renderWidth,
			isNumberColumnEnabled: false,
		});
		expect(table.find('col')).toHaveLength(0);
		table.unmount();
	});

	it('should NOT render a colgroup when columnWidths is an array of zeros', () => {
		const columnWidths: Array<number> = [0, 0, 0];
		const table = mountBasicTable({
			columnWidths,
			renderWidth,
			isNumberColumnEnabled: false,
			allowTableResizing: true,
		});
		expect(table.find('col')).toHaveLength(3);
		table.unmount();
	});

	it('should render children', () => {
		const table = mountBasicTable({ renderWidth });
		expect(table.prop('layout')).toEqual('default');
		expect(table.prop('isNumberColumnEnabled')).toEqual(true);
		expect(table.find(TableRow)).toHaveLength(1);
		expect(table.find(TableCell)).toHaveLength(3);
		table.unmount();
	});

	describe('When number column is enabled', () => {
		describe('When header row is enabled', () => {
			it('should start numbers from the second row', () => {
				const table = mountWithIntl(
					<Table
						layout="default"
						isNumberColumnEnabled={true}
						renderWidth={renderWidth}
						rendererAppearance="full-page"
					>
						<TableRow>
							<TableHeader />
							<TableHeader />
						</TableRow>
						<TableRow>
							<TableCell />
							<TableCell />
						</TableRow>
						<TableRow>
							<TableCell />
							<TableCell />
						</TableRow>
					</Table>,
				);

				table.find('tr').forEach((row, index) => {
					expect(row.find('td').at(0).text()).toEqual(index === 0 ? '' : `${index}`);
				});
				table.unmount();
			});
		});
		describe('When header row is disabled', () => {
			it('should start numbers from the first row', () => {
				const table = mountWithIntl(
					<Table
						layout="default"
						isNumberColumnEnabled={true}
						renderWidth={renderWidth}
						rendererAppearance="full-page"
					>
						<TableRow>
							<TableCell />
							<TableCell />
						</TableRow>
						<TableRow>
							<TableCell />
							<TableCell />
						</TableRow>
						<TableRow>
							<TableCell />
							<TableCell />
						</TableRow>
					</Table>,
				);

				table.find('tr').forEach((row, index) => {
					expect(row.find('td').at(0).text()).toEqual(`${index + 1}`);
				});
				table.unmount();
			});
		});

		describe('when columnWidths is set and is equal to table container minus 1', () => {
			it('should have the correct width for numbered column', () => {
				const table = mountWithIntl(
					<RendererContextProvider value={{}}>
						<Table
							layout="default"
							columnWidths={[300, 459]}
							isNumberColumnEnabled={true}
							renderWidth={renderWidth}
							rendererAppearance="full-page"
						>
							<TableRow>
								<TableCell />
								<TableCell />
							</TableRow>
							<TableRow>
								<TableCell />
								<TableCell />
							</TableRow>
						</Table>
					</RendererContextProvider>,
				);

				// equals 43px (number column = 42px)
				const resultingColumnWidths = [284, 432];
				expect(table.find('col')).toHaveLength(3);

				table.find('col').forEach((col, index) => {
					if (index === 0) {
						expect(col.prop('style')!.width).toEqual(akEditorTableNumberColumnWidth);
					} else {
						expect(col.prop('style')!.width).toEqual(`${resultingColumnWidths[index - 1]}px`);
					}
				});
				table.unmount();
			});
		});

		describe('when columnWidths is set and smaller than table container', () => {
			it('should have the correct width for numbered column ', () => {
				const table = mountWithIntl(
					<RendererContextProvider value={{}}>
						<Table
							layout="default"
							columnWidths={[300, 380]}
							isNumberColumnEnabled={true}
							renderWidth={renderWidth}
							rendererAppearance="full-page"
						>
							<TableRow>
								<TableCell />
								<TableCell />
							</TableRow>
							<TableRow>
								<TableCell />
								<TableCell />
							</TableRow>
						</Table>
					</RendererContextProvider>,
				);

				// col widths get scaled up when num cols is enabled
				const resultingColumnWidths = [317, 399];
				expect(table.find('col')).toHaveLength(3);

				table.find('col').forEach((col, index) => {
					if (index === 0) {
						expect(col.prop('style')!.width).toEqual(akEditorTableNumberColumnWidth);
					} else {
						expect(col.prop('style')!.width).toEqual(`${resultingColumnWidths[index - 1]}px`);
					}
				});
				table.unmount();
			});
		});

		it('should have the correct width for numbered column when no columnWidths', () => {
			const table = mountWithIntl(
				<Table
					layout="default"
					columnWidths={[0, 0]}
					isNumberColumnEnabled={true}
					renderWidth={renderWidth}
					rendererAppearance="full-page"
					allowTableResizing={true}
				>
					<TableRow>
						<TableCell />
						<TableCell />
					</TableRow>
					<TableRow>
						<TableCell />
						<TableCell />
					</TableRow>
				</Table>,
			);

			expect(table.find('col')).toHaveLength(3);

			table.find('col').forEach((col, index) => {
				if (index === 0) {
					expect(col.prop('style')!.width).toEqual(akEditorTableNumberColumnWidth);
				} else {
					expect(col.prop('style')!.minWidth).toBeUndefined();
				}
			});
			table.unmount();
		});
	});

	describe('When number column is disabled', () => {
		it('should not add an extra <col> node for number column', () => {
			const columnWidths = [300, 380];
			const table = mountWithIntl(
				<Table
					layout="default"
					isNumberColumnEnabled={false}
					columnWidths={columnWidths}
					renderWidth={renderWidth}
					rendererAppearance="full-page"
				>
					<TableRow>
						<TableCell />
						<TableCell />
					</TableRow>
					<TableRow>
						<TableCell />
						<TableCell />
					</TableRow>
				</Table>,
			);
			expect(table.find('col')).toHaveLength(2);

			table.find('col').forEach((col, index) => {
				expect(col.prop('style')!.width).toEqual(`${columnWidths[index] - 1}px`);
			});
			table.unmount();
		});
	});

	describe('When multiple columns do not have width', () => {
		describe('when renderWidth is smaller than table minimum allowed width', () => {
			it('should add minWidth to zero width columns', () => {
				const columnWidths = [260, 260, 0, 0];

				const table = mountWithIntl(
					<Table
						layout="default"
						isNumberColumnEnabled={true}
						columnWidths={columnWidths}
						renderWidth={renderWidth}
						rendererAppearance="full-page"
					>
						<TableRow>
							<TableCell />
							<TableCell />
							<TableCell />
							<TableCell />
						</TableRow>
						<TableRow>
							<TableCell />
							<TableCell />
							<TableCell />
							<TableCell />
						</TableRow>
					</Table>,
				);
				table.setProps({ isNumberColumnEnabled: false });

				expect(table.find('col')).toHaveLength(4);

				table.find('col').forEach((col, index) => {
					if (index < 2) {
						expect(col.prop('style')!.width).toEqual(`${columnWidths[index] - 1}px`);
					} else {
						expect(col.prop('style')!.width).toEqual(`${tableCellMinWidth}px`);
					}
				});
				table.unmount();
			});
		});
		describe('when renderWidth is greater than table minimum allowed width', () => {
			it('should not add minWidth to zero width columns', () => {
				const columnWidths = [200, 200, 0, 0];

				const table = mountWithIntl(
					<Table
						layout="default"
						isNumberColumnEnabled={true}
						columnWidths={columnWidths}
						renderWidth={renderWidth}
						rendererAppearance="full-page"
					>
						<TableRow>
							<TableCell />
							<TableCell />
							<TableCell />
							<TableCell />
						</TableRow>
						<TableRow>
							<TableCell />
							<TableCell />
							<TableCell />
							<TableCell />
						</TableRow>
					</Table>,
				);
				table.setProps({ isNumberColumnEnabled: false });

				expect(table.find('col')).toHaveLength(4);

				table.find('col').forEach((col, index) => {
					if (index < 2) {
						expect(col.prop('style')!.width).toEqual(`${columnWidths[index] - 1}px`);
					} else {
						expect(typeof col.prop('style')!.width).toEqual('undefined');
					}
				});
				table.unmount();
			});
		});
	});

	describe('when renderWidth is 20% lower than table width', () => {
		it('should scale down columns widths by 20%', () => {
			const columnWidths = [200, 200, 280];
			const table = mountWithIntl(
				<Table
					layout="default"
					isNumberColumnEnabled={false}
					columnWidths={columnWidths}
					renderWidth={544}
					rendererAppearance="full-page"
				>
					<TableRow>
						<TableCell />
						<TableCell />
						<TableCell />
					</TableRow>
					<TableRow>
						<TableCell />
						<TableCell />
						<TableCell />
					</TableRow>
				</Table>,
			);
			expect(table.find('col')).toHaveLength(3);
			table.find('col').forEach((col, index) => {
				const width = columnWidths[index] - columnWidths[index] * 0.2;
				expect(col.prop('style')!.width).toEqual(`${width}px`);
			});
			table.unmount();
		});
	});

	describe('when renderWidth is 40% lower than table width', () => {
		it('should scale down columns widths by 30% and then overflow', () => {
			const columnWidths = [200, 200, 280];
			const table = mountWithIntl(
				<Table
					layout="default"
					isNumberColumnEnabled={false}
					columnWidths={columnWidths}
					renderWidth={408}
					rendererAppearance="full-page"
				>
					<TableRow>
						<TableCell />
						<TableCell />
						<TableCell />
					</TableRow>
					<TableRow>
						<TableCell />
						<TableCell />
						<TableCell />
					</TableRow>
				</Table>,
			);
			expect(table.find('col')).toHaveLength(3);
			table.find('col').forEach((col, index) => {
				const width = columnWidths[index] - columnWidths[index] * 0.3;
				expect(col.prop('style')!.width).toEqual(`${width}px`);
			});
			table.unmount();
		});
	});

	describe('tables created when allowColumnSorting is enabled', () => {
		const tableDoc = {
			...table(
				tr([th()(p('Header content 1')), th()(p('Header content 2')), th()(p('Header content 3'))]),
				tr([td()(p('Body content 1')), td()(p('Body content 2')), td()(p('Body content 3'))]),
			),
			attrs: { isNumberColumnEnabled: true },
		};

		const tableDocWithMergedCell = {
			...table(
				tr([th()(p('Header content 1')), th()(p('Header content 2')), th()(p('Header content 3'))]),
				tr([td()(p('Body content 1')), td({ colspan: 2 })(p('Body content 2'))]),
			),
			attrs: { isNumberColumnEnabled: true },
		};

		it('should add sortable props to first table row', () => {
			const tableFromSchema = schema.nodeFromJSON(tableDoc);

			const wrap = mountWithIntl(
				<Table
					layout="default"
					renderWidth={renderWidth}
					allowColumnSorting={true}
					tableNode={tableFromSchema}
					isNumberColumnEnabled={false}
					rendererAppearance="full-page"
				>
					<TableRow>
						<TableHeader />
						<TableHeader />
						<TableHeader />
					</TableRow>
					<TableRow>
						<TableCell />
						<TableCell />
						<TableCell />
					</TableRow>
				</Table>,
			);

			const container = wrap.find(TableProcessor).instance();
			act(() => {
				container.setState({
					tableOrderStatus: { columnIndex: 0, sortOrdered: SortOrder.ASC },
				});
			});
			wrap.update();

			const firstRowProps = wrap.find(TableRow).first().props();
			expect(firstRowProps.tableOrderStatus).toEqual({
				columnIndex: 0,
				sortOrdered: SortOrder.ASC,
			});
			expect(typeof firstRowProps.onSorting).toBe('function');
			wrap.unmount();
		});

		describe('when header row is not enabled', () => {
			it('should not add sortable props to the first table row', () => {
				const tableFromSchema = schema.nodeFromJSON(tableDoc);

				const wrap = mountWithIntl(
					<Table
						layout="default"
						renderWidth={renderWidth}
						allowColumnSorting={true}
						tableNode={tableFromSchema}
						isNumberColumnEnabled={false}
						rendererAppearance="full-page"
					>
						<TableRow>
							<TableCell />
							<TableCell />
							<TableCell />
						</TableRow>
						<TableRow>
							<TableCell />
							<TableCell />
							<TableCell />
						</TableRow>
					</Table>,
				);

				const container = wrap.find(TableProcessor).instance();

				container.setState({
					tableOrderStatus: { columnIndex: 0, sortOrdered: SortOrder.ASC },
				});
				wrap.update();

				const firstRowProps = wrap.find(TableRow).first().props();
				expect(firstRowProps.tableOrderStatus).toBeUndefined();
				expect(firstRowProps.onSorting).toBeUndefined();
				wrap.unmount();
			});
		});

		describe('when there is merged cell on table', () => {
			it('should not add sortable props to the first table row', () => {
				const tableFromSchema = schema.nodeFromJSON(tableDocWithMergedCell);

				const wrap = mountWithIntl(
					<Table
						layout="default"
						renderWidth={renderWidth}
						allowColumnSorting={true}
						tableNode={tableFromSchema}
						isNumberColumnEnabled={false}
						rendererAppearance="full-page"
					>
						<TableRow>
							<TableHeader />
							<TableHeader />
							<TableHeader />
						</TableRow>
						<TableRow>
							<TableCell />
							<TableCell />
						</TableRow>
					</Table>,
				);

				const container = wrap.find(TableProcessor).instance();

				container.setState({
					tableOrderStatus: { columnIndex: 0, sortOrdered: SortOrder.ASC },
				});
				wrap.update();

				const firstRowProps = wrap.find(TableRow).first().props();
				expect(firstRowProps.tableOrderStatus).toBeUndefined();
				expect(firstRowProps.onSorting).toBeUndefined();
				wrap.unmount();
			});
		});

		describe('when there is no tableNode', () => {
			it('should not add sortable props to the first table row', () => {
				const wrap = mountWithIntl(
					<Table
						layout="default"
						renderWidth={renderWidth}
						allowColumnSorting={true}
						isNumberColumnEnabled={false}
						rendererAppearance="full-page"
					>
						<TableRow>
							<TableHeader />
							<TableHeader />
							<TableHeader />
						</TableRow>
						<TableRow>
							<TableCell />
							<TableCell />
							<TableCell />
						</TableRow>
					</Table>,
				);

				const container = wrap.find(TableProcessor).instance();

				container.setState({
					tableOrderStatus: { columnIndex: 0, sortOrdered: SortOrder.ASC },
				});
				wrap.update();

				const firstRowProps = wrap.find(TableRow).first().props();
				expect(firstRowProps.tableOrderStatus).toBeUndefined();
				expect(firstRowProps.onSorting).toBeUndefined();
				wrap.unmount();
			});
		});

		describe('when table has inlineCards', () => {
			const atlassianUrl = 'http://atlassian.com';
			const bitbucketUrl = 'http://bitbucket.com';
			const trelloUrl = 'http://trello.com';

			const tableWithInlineCardsDoc = {
				...table(
					tr([th()(p('Header content'))]),
					tr([
						td()(
							p(
								inlineCard({
									url: trelloUrl,
								}),
							),
						),
					]),
					tr([
						td()(
							p(
								inlineCard({
									url: atlassianUrl,
								}),
							),
						),
					]),
					tr([
						td()(
							p(
								inlineCard({
									url: bitbucketUrl,
								}),
							),
						),
					]),
				),
				attrs: { isNumberColumnEnabled: true },
			};
			const TableRowWithOriginalPos = ({
				originalIndex,
				...tableRowProps
			}: React.PropsWithChildren<
				React.ComponentProps<typeof TableRow> & { originalIndex: number }
			>) => {
				return <TableRow {...tableRowProps} />;
			};

			test.each<[Map<string, string>, number[]]>([
				[
					new Map([
						[trelloUrl, 'a'],
						[atlassianUrl, 'c'],
						[bitbucketUrl, 'b'],
					]),
					[1, 2, 4, 3],
				],
				[
					new Map([
						[trelloUrl, 'c'],
						[atlassianUrl, 'a'],
						[bitbucketUrl, 'b'],
					]),
					[1, 3, 4, 2],
				],
			])('should sort using %p to resolve inlineCard titles', (storage, expected) => {
				const tableFromSchema = schema.nodeFromJSON(tableWithInlineCardsDoc);

				const wrap = mountWithIntl(
					<SmartCardStorageContext.Provider value={storage}>
						<Table
							layout="default"
							renderWidth={renderWidth}
							allowColumnSorting={true}
							tableNode={tableFromSchema}
							isNumberColumnEnabled={false}
							rendererAppearance="full-page"
						>
							<TableRowWithOriginalPos originalIndex={1}>
								<TableHeader />
								<TableHeader />
							</TableRowWithOriginalPos>
							<TableRowWithOriginalPos originalIndex={2}>
								<TableCell />
							</TableRowWithOriginalPos>
							<TableRowWithOriginalPos originalIndex={3}>
								<TableCell />
							</TableRowWithOriginalPos>
							<TableRowWithOriginalPos originalIndex={4}>
								<TableCell />
							</TableRowWithOriginalPos>
						</Table>
					</SmartCardStorageContext.Provider>,
				);
				const tableRowProps = wrap.find(TableRow).first().props();

				act(() => {
					tableRowProps.onSorting!(0, SortOrder.ASC);
				});
				wrap.update();

				const sortPosition = wrap
					.find(TableRowWithOriginalPos)
					.map((tableRowWithOriginalPos) => tableRowWithOriginalPos.props().originalIndex);

				expect(sortPosition).toEqual(expected);
				wrap.unmount();
			});
		});
	});

	describe('sort table by column', () => {
		const initialTableState = [
			['Header', 'Header'],
			['Bbb', 'A'],
			['bBBB', 'B'],
			['BBb', ' '],
			[' C', 'C'],
			['1a', '@yolo'],
			['a1', 'be@ns'],
			['!c', 'A nEw world'],
			['C', 'A nEw world!'],
		];
		const getRows = () => {
			return initialTableState.map((row, index) => {
				if (index === 0) {
					const cells = row.map((val) => th()(p(val)));

					return tr(cells);
				}
				return tr(row.map((val) => td()(p(val))));
			});
		};
		const tableDoc = {
			...table(...getRows()),
			attrs: { isNumberColumnEnabled: false },
		};
		const Cell = ({ text }: { text: string }) => (
			<td>
				<p>{text}</p>
			</td>
		);
		const tableFromSchema = schema.nodeFromJSON(tableDoc);
		const wrap = mountWithIntl(
			<Table
				layout="default"
				renderWidth={renderWidth}
				allowColumnSorting={true}
				isNumberColumnEnabled={false}
				tableNode={tableFromSchema}
				rendererAppearance="full-page"
			>
				{initialTableState.map((row, rowIndex) => {
					if (rowIndex === 0) {
						return (
							// Ignored via go/ees005
							// eslint-disable-next-line react/no-array-index-key
							<TableRow key={rowIndex}>
								{row.map((_, headerIndex) => (
									// Ignored via go/ees005
									// eslint-disable-next-line react/no-array-index-key
									<TableHeader key={headerIndex} />
								))}
							</TableRow>
						);
					}

					return (
						// Ignored via go/ees005
						// eslint-disable-next-line react/no-array-index-key
						<TableRow key={rowIndex}>
							{row.map((cellVal, cellIndex) => (
								// Ignored via go/ees005
								// eslint-disable-next-line react/no-array-index-key
								<Cell key={cellIndex} text={cellVal} />
							))}
						</TableRow>
					);
				})}
			</Table>,
		);
		const expectTableOrder = (expectedValues: string[][]) => {
			for (let i = 0; i < expectedValues.length; i++) {
				for (let j = 0; j < expectedValues[0].length; j++) {
					const cell = wrap
						.find(TableRow)
						.at(i + 1)
						.find('td')
						.at(j);
					const actualValue = cell.text();
					const expectedValue = expectedValues[i][j];

					expect(actualValue).toEqual(expectedValue);
				}
			}
		};

		describe('when sorting on the first column', () => {
			it('should sort table by column A to Z', () => {
				const tableRowProps = wrap.find(TableRow).first().props();
				act(() => {
					tableRowProps.onSorting!(0, SortOrder.ASC);
				});
				wrap.update();
				const tableState = [
					[' C', 'C'],
					['!c', 'A nEw world'],
					['1a', '@yolo'],
					['a1', 'be@ns'],
					['BBb', ' '],
					['Bbb', 'A'],
					['bBBB', 'B'],
					['C', 'A nEw world!'],
				];
				expectTableOrder(tableState);
			});

			it('should sort table by column Z to A', () => {
				const tableRowProps = wrap.find(TableRow).first().props();
				act(() => {
					tableRowProps.onSorting!(0, SortOrder.DESC);
				});
				wrap.update();
				const tableState = [
					[' C', 'C'],
					['!c', 'A nEw world'],
					['1a', '@yolo'],
					['a1', 'be@ns'],
					['BBb', ' '],
					['Bbb', 'A'],
					['bBBB', 'B'],
					['C', 'A nEw world!'],
				].reverse();
				expectTableOrder(tableState);
			});

			it('should clear table order', () => {
				const tableRowProps = wrap.find(TableRow).first().props();
				act(() => {
					tableRowProps.onSorting!(0, SortOrder.NO_ORDER);
				});
				wrap.update();
				const tableState = [
					['Bbb', 'A'],
					['bBBB', 'B'],
					['BBb', ' '],
					[' C', 'C'],
					['1a', '@yolo'],
					['a1', 'be@ns'],
					['!c', 'A nEw world'],
					['C', 'A nEw world!'],
				];
				expectTableOrder(tableState);
			});
		});

		describe('when sorting on the second column', () => {
			it('should sort table by column A to Z', () => {
				const tableRowProps = wrap.find(TableRow).first().props();
				act(() => {
					tableRowProps.onSorting!(1, SortOrder.ASC);
				});
				wrap.update();
				const tableState = [
					['BBb', ' '],
					['1a', '@yolo'],
					['Bbb', 'A'],
					['!c', 'A nEw world'],
					['C', 'A nEw world!'],
					['bBBB', 'B'],
					['a1', 'be@ns'],
					[' C', 'C'],
				];
				expectTableOrder(tableState);
			});
			it('should sort table by column Z to A', () => {
				const tableRowProps = wrap.find(TableRow).first().props();
				act(() => {
					tableRowProps.onSorting!(1, SortOrder.DESC);
				});
				wrap.update();
				const tableState = [
					['BBb', ' '],
					['1a', '@yolo'],
					['Bbb', 'A'],
					['!c', 'A nEw world'],
					['C', 'A nEw world!'],
					['bBBB', 'B'],
					['a1', 'be@ns'],
					[' C', 'C'],
				].reverse();
				expectTableOrder(tableState);
			});
			it('should clear table order', () => {
				const tableRowProps = wrap.find(TableRow).first().props();
				act(() => {
					tableRowProps.onSorting!(1, SortOrder.NO_ORDER);
				});
				wrap.update();
				const tableState = [
					['Bbb', 'A'],
					['bBBB', 'B'],
					['BBb', ' '],
					[' C', 'C'],
					['1a', '@yolo'],
					['a1', 'be@ns'],
					['!c', 'A nEw world'],
					['C', 'A nEw world!'],
				];
				expectTableOrder(tableState);
			});
		});
	});

	describe('table with overflow shadows', () => {
		it('when columnWidths are not set, should not render shadows', () => {
			const table = mountBasicTable({ columnWidths: [0, 0, 0] });

			expect(table.html().includes(shadowClassNames.LEFT_SHADOW)).toBeFalsy();
			expect(table.html().includes(shadowClassNames.RIGHT_SHADOW)).toBeFalsy();
		});

		it('when columnWidths are set should render shadows', () => {
			const table = mountBasicTable({ columnWidths: [100, 100, 100] });
			expect(table.html().includes(shadowObserverClassNames.SENTINEL_LEFT)).toBeTruthy();
			expect(table.html().includes(shadowObserverClassNames.SENTINEL_RIGHT)).toBeTruthy();
			table.unmount();
		});
	});

	describe('Table widths', () => {
		it('table is centered and has correct width', () => {
			const tableNode = createTable(700, 'wide');
			const rendererWidth = 1800;
			const wrap = mountTable(tableNode, rendererWidth, undefined, 'full-page', false, false, true);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.width).toBe(700);
			expect(tableContainer.prop('style')!.left).toBe(undefined);
			wrap.unmount();
		});

		it('default table should be full width in full-width mode', () => {
			const tableNode = createDefaultTable();
			const rendererWidth = 1800;

			const wrap = mountTable(
				tableNode,
				rendererWidth,
				undefined,
				'full-width',
				false,
				false,
				true,
			);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.width).toBe(1800);
			wrap.unmount();
		});

		it('default table should be responsively full width in full-width mode', () => {
			const tableNode = createDefaultTable();
			const rendererWidth = 900;
			const wrap = mountTable(
				tableNode,
				rendererWidth,
				undefined,
				'full-width',
				false,
				false,
				true,
			);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.width).toBe(900);
			wrap.unmount();
		});

		it('table width responsively scales down', () => {
			const tableNode = createTable(700, 'wide');
			const rendererWidth = 600;

			const wrap = mountTable(tableNode, rendererWidth, undefined, 'full-page', false, false, true);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.width).toBe(600);
			expect(tableContainer.prop('style')!.left).toBe(undefined);
			wrap.unmount();
		});

		it('table scales table columns down', () => {
			const tableWidth = 960;
			const scale = 0.9;
			const tableNode = createTable(tableWidth, 'wide');
			const rendererWidth = tableWidth * scale;
			const colWidths = [420, 220, 320];
			const expectedWidths = colWidths.map((w) => w * scale);

			const wrap = mountTable(tableNode, rendererWidth, [420, 220, 320]);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			checkColWidths(tableContainer, expectedWidths);
			wrap.unmount();
		});

		it('table scales table columns down max 30%', () => {
			const tableWidth = 960;
			const scale = 0.6;
			const tableNode = createTable(tableWidth, 'wide');
			const rendererWidth = tableWidth * scale;
			const colWidths = [420, 220, 320];
			const expectedWidths = colWidths.map((w) => w * 0.7);

			const wrap = mountTable(tableNode, rendererWidth, colWidths);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			checkColWidths(tableContainer, expectedWidths);
			wrap.unmount();
		});

		describe('column widths undefined', () => {
			it('table scales columns when table width is smaller than fixed-width line length - column widths undefined', () => {
				const tableWidth = 500;
				const scale = 0.6;
				const tableNode = createTable(tableWidth, 'default');
				const rendererWidth = tableWidth * scale;
				// column widths 0 as they're undefined
				const colWidths = [0, 0, 0];
				const expectedWidths = (computedColWidths: Array<number>) =>
					computedColWidths.map((w) => Math.floor(w * 0.7));
				// expected to scale down
				const wrap = mountTable(
					tableNode,
					rendererWidth,
					colWidths,
					'full-page',
					false,
					false,
					true,
				);
				const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);
				checkColWidths(tableContainer, expectedWidths([166, 166, 166]));
				wrap.unmount();
			});

			it('should scale columns when table width is larger than fixed-width line length', () => {
				const tableWidth = 1200;
				const scale = 0.6;
				const tableNode = createTable(tableWidth, 'default');
				const rendererWidth = tableWidth * scale;
				// column widths 0 as they're undefined
				const colWidths = [0, 0, 0];
				const expectedWidths = (computedColWidths: Array<number>) =>
					computedColWidths.map((w) => Math.floor(w * 0.7));

				// expected to scale down
				const wrap = mountTable(
					tableNode,
					rendererWidth,
					colWidths,
					'full-page',
					false,
					false,
					true,
				);
				const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);
				checkColWidths(tableContainer, expectedWidths([399, 399, 399]));
				wrap.unmount();
			});

			it('should render table columns as undefined when nested in a block node', () => {
				const tableWidth = 500;
				const scale = 0.6;
				const tableNode = createTable(tableWidth, 'default');
				const rendererWidth = tableWidth * scale;
				// column widths 0 as they're undefined
				const colWidths = [0, 0, 0];

				const wrap = mountTable(tableNode, rendererWidth, colWidths, undefined, true);
				const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

				expect(tableContainer.find('colgroup')).toHaveLength(0);
				wrap.unmount();
			});

			describe('should NOT render a colgroup when isInsideOfTable and columns have not been resized', () => {
				ffTest(
					'platform_editor_nested_tables_renderer_colgroup',
					() => {
						const tableWidth = 500;
						const scale = 0.6;
						const tableNode = createTable(tableWidth, 'default');
						const rendererWidth = tableWidth * scale;
						// column widths 0 as they're undefined
						const colWidths = [0, 0, 0];

						const wrap = mountTable(
							tableNode,
							rendererWidth,
							colWidths,
							undefined,
							false,
							false,
							true,
							true,
						);
						const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

						expect(tableContainer.find('colgroup')).toHaveLength(0);
						wrap.unmount();
					},
					() => {
						const tableWidth = 500;
						const scale = 0.6;
						const tableNode = createTable(tableWidth, 'default');
						const rendererWidth = tableWidth * scale;
						// column widths 0 as they're undefined
						const colWidths = [0, 0, 0];

						const wrap = mountTable(
							tableNode,
							rendererWidth,
							colWidths,
							undefined,
							false,
							false,
							true,
							true,
						);
						const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

						expect(tableContainer.find('colgroup')).toHaveLength(1);
						wrap.unmount();
					},
				);
			});

			// When Renderer is nested (eg: Renderer is used to render contents inside an extension
			// (Page Properties or Experpt macro)). A table with unresized columns should fit inside
			// the renderWidth without overflow (eg. rendereWidth is used to calculate columns widths)
			it('should fit inside the renderWidth without overflow when renderer is nested', () => {
				const tableNode = createDefaultTable('default');
				const featureFlags = {};
				const appearance = undefined;
				const isInsideBlockNode = false;
				const allowTableResizing = true;
				const isInsideTable = false;

				const isTopLevelRenderer = false;
				const rendererWidth = 300;

				const wrap = mountTableWithFF(
					featureFlags,
					tableNode,
					rendererWidth,
					[0, 0, 0],
					appearance,
					isInsideBlockNode,
					isTopLevelRenderer,
					isInsideTable,
					allowTableResizing,
				);

				const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

				// tableWidth = tableContainerWidth - 1 = rendererWidth - 1 = 299
				// colWidth = tableWidth / 3 = 299/3 = 99.66666666666667
				// then we need to -1 for the tableCellBorderWidth = 98.66666666666667
				checkColWidths(tableContainer, [98.66666666666667, 98.66666666666667, 98.66666666666667]);

				wrap.unmount();
			});
		});

		it('table column not scales down when renderer width is bigger than table width', () => {
			const tableNode = createDefaultTable();
			const rendererWidth = 1400;
			const colWidths = [420, 220, 620];
			const expectedNotScaledWidths = colWidths.map((w) => w - 1);

			const wrap = mountTable(tableNode, rendererWidth, colWidths);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			checkColWidths(tableContainer, expectedNotScaledWidths);
			wrap.unmount();
		});

		it('table column does not scales down when table is fixed and tableWithFixedColumnWidthsOption is enabled', () => {
			const tableNode = createDefaultTable('fixed');
			const rendererWidth = 700;

			const wrap = mountTableWithFF(
				{ tableWithFixedColumnWidthsOption: true },
				tableNode,
				rendererWidth,
				[420, 220, 620],
			);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			checkColWidths(tableContainer, [419, 219, 619]);

			wrap.unmount();
		});

		it('table scales down when table when tableWithFixedColumnWidthsOption is disabled', () => {
			const scale = 0.7;
			const tableNode = createDefaultTable('fixed');
			const rendererWidth = 700;
			const colWidths = [420, 220, 620];
			const expectedScaleWidths = colWidths.map((w) => w * scale);

			const wrap = mountTableWithFF(
				{ tableWithFixedColumnWidthsOption: false },
				tableNode,
				rendererWidth,
				[420, 220, 620],
			);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			checkColWidths(tableContainer, expectedScaleWidths);
			wrap.unmount();
		});

		it('should have correct style when table alignment is enabled', () => {
			const tableNode = createTable(600, 'align-start');
			const rendererWidth = 1000;

			const allowTableAlignment = true;
			const wrap = mountTable(
				tableNode,
				rendererWidth,
				undefined,
				'full-page',
				false,
				allowTableAlignment,
			);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.left).toBe(-80);

			wrap.unmount();
		});

		it('should not have left alignment when table alignment is not enabled', () => {
			const tableNode = createTable(600, 'align-start');
			const rendererWidth = 1000;

			const wrap = mountTable(tableNode, rendererWidth);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.left).toBe(undefined);

			wrap.unmount();
		});

		it('should not have left style when table is inside of a block node', () => {
			// should not have left style when table is inside of a block node
			const tableNode = createTable(600, 'align-start');
			const rendererWidth = 1000;

			const allowTableAlignment = true;
			const wrap = mountTable(tableNode, rendererWidth, [], undefined, true, allowTableAlignment);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.left).toBe(undefined);

			wrap.unmount();
		});
	});

	describe('table in comments renderer', () => {
		it('default table should have the same width as renderer when table resizing and alignment are enabled', () => {
			const tableNode = createDefaultTable();
			const rendererWidth = 900;

			const columnWidths = undefined;
			const isInsideOfBlockNode = false;
			const allowTableResizing = true;
			const allowTableAlignment = true;
			const wrap = mountTable(
				tableNode,
				rendererWidth,
				columnWidths,
				'comment',
				isInsideOfBlockNode,
				allowTableResizing,
				allowTableAlignment,
			);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.width).toBe('inherit');
			wrap.unmount();
		});

		it('default table should have the same width as renderer when table resizing and alignment are disabled', () => {
			const tableNode = createDefaultTable('default');
			const rendererWidth = 900;

			const columnWidths = undefined;
			const wrap = mountTable(tableNode, rendererWidth, columnWidths, 'comment');

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.width).toBe('inherit');
			wrap.unmount();
		});

		it('resized table should have correct width when table resizing is enabled and alignment is NOT enabled', () => {
			const tableWidth = 300;
			const tableNode = createTable(tableWidth, 'default');
			const rendererWidth = 900;

			const columnWidths = undefined;
			const isInsideOfBlockNode = false;
			const allowTableResizing = true;
			const allowTableAlignment = false;
			const wrap = mountTable(
				tableNode,
				rendererWidth,
				columnWidths,
				'comment',
				isInsideOfBlockNode,
				allowTableAlignment,
				allowTableResizing,
			);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.width).toBe(tableWidth);
			wrap.unmount();
		});

		it('edge case: a table with 760px width when table resizing is enabled and alignment is NOT enabled should inherit renderer width', () => {
			const tableWidth = 760;
			const tableNode = createTable(tableWidth, 'default');
			const rendererWidth = 900;

			const columnWidths = undefined;
			const isInsideOfBlockNode = false;
			const allowTableResizing = true;
			const allowTableAlignment = false;
			const wrap = mountTable(
				tableNode,
				rendererWidth,
				columnWidths,
				'comment',
				isInsideOfBlockNode,
				allowTableAlignment,
				allowTableResizing,
			);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.width).toBe('inherit');
			wrap.unmount();
		});

		it('resized table should have correct width when table resizing and alignment are enabled', () => {
			const tableWidth = 300;
			const tableNode = createTable(tableWidth, 'align-start');
			const rendererWidth = 900;

			const columnWidths = undefined;
			const isInsideOfBlockNode = false;
			const allowTableResizing = true;
			const allowTableAlignment = true;
			const wrap = mountTable(
				tableNode,
				rendererWidth,
				columnWidths,
				'comment',
				isInsideOfBlockNode,
				allowTableAlignment,
				allowTableResizing,
			);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.width).toBe(tableWidth);
			wrap.unmount();
		});

		it('resized table should have correct width when table resizing and alignment are disabled', () => {
			const tableWidth = 300;
			const tableNode = createTable(tableWidth, 'default');
			const rendererWidth = 900;

			const columnWidths = undefined;
			const wrap = mountTable(tableNode, rendererWidth, columnWidths, 'comment');

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.width).toBe('inherit');
			wrap.unmount();
		});

		it('should have correct styles when table alignment is enabled in Comment Renderer', () => {
			const tableNode = createTable(600, 'align-start');
			const rendererWidth = 1000;

			const allowTableAlignment = true;
			const wrap = mountTable(
				tableNode,
				rendererWidth,
				undefined,
				'comment',
				false,
				allowTableAlignment,
			);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.left).toBe(-200);

			wrap.unmount();
		});

		it('should have correct styles when table alignment is not enabled in Comment Renderer', () => {
			const tableNode = createTable(600, 'align-start');
			const rendererWidth = 1000;

			const wrap = mountTable(tableNode, rendererWidth, undefined, 'comment');

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.left).toBe(undefined);

			wrap.unmount();
		});
	});

	describe('SSR - Table widths', () => {
		const createTable = (width: number, layout: TableLayout) => {
			return schema.nodeFromJSON({
				...table(
					tr([
						th()(p('Header content 1')),
						th()(p('Header content 2')),
						th()(p('Header content 3')),
					]),
					tr([td()(p('Body content 1')), td()(p('Body content 2')), td()(p('Body content 3'))]),
				),
				attrs: { width, layout },
			});
		};

		const createDefaultTable = (displayMode?: string) => {
			return schema.nodeFromJSON({
				...table(
					tr([
						th()(p('Header content 1')),
						th()(p('Header content 2')),
						th()(p('Header content 3')),
					]),
					tr([td()(p('Body content 1')), td()(p('Body content 2')), td()(p('Body content 3'))]),
				),
				attrs: { layout: 'default', displayMode },
			});
		};

		const mountTable = (
			node: PMNode,
			columnWidths?: number[],
			appearance: RendererAppearance = 'full-page',
			isInsideOfBlockNode = false,
			allowTableResizing = false,
		) => {
			return mountWithIntl(
				<Table
					layout={node.attrs.layout}
					rendererAppearance={appearance}
					isNumberColumnEnabled={false}
					tableNode={node}
					columnWidths={columnWidths}
					isInsideOfBlockNode={isInsideOfBlockNode}
					allowTableResizing={allowTableResizing}
				>
					<TableRow>
						<TableHeader />
						<TableHeader />
						<TableHeader />
					</TableRow>
					<TableRow>
						<TableCell />
						<TableCell />
						<TableCell />
					</TableRow>
				</Table>,
			);
		};

		it('table has its own width in full-width renderer with no width', () => {
			const tableNode = createTable(700, 'wide');
			const wrap = mountTable(tableNode, undefined, 'full-width', true, true);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.width).toBe(700);
			expect(tableContainer.prop('style')!.left).toBe(undefined);
			wrap.unmount();
		});

		it('default table should be full width in full-width mode', () => {
			const tableNode = createDefaultTable();
			const wrap = mountTable(tableNode, undefined, 'full-width', false, true);

			const tableContainer = wrap.find(`.${TableSharedCssClassName.TABLE_CONTAINER}`);

			expect(tableContainer.prop('style')!.width).toBe(1800);
			wrap.unmount();
		});
	});
});
