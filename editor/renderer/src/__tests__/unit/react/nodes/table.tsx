import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	akEditorTableNumberColumnWidth,
	akEditorDefaultLayoutWidth,
	akEditorTableLegacyCellMinWidth as tableCellMinWidth,
} from '@atlaskit/editor-shared-styles';
import type { Layout as TableLayout } from '@atlaskit/adf-schema/tableNodes';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { inlineCard, p, table, td, th, tr } from '@atlaskit/adf-utils/builders';
import Table from '../../../../react/nodes/table';
import { TableCell, TableHeader } from '../../../../react/nodes/tableCell';
import TableRow from '../../../../react/nodes/tableRow';
import { Context as SmartCardStorageContext } from '../../../../ui/SmartCardStorage';
import type { RendererAppearance } from '../../../../ui/Renderer/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { shadowClassNames, shadowObserverClassNames } from '@atlaskit/editor-common/ui';
import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { RendererContextProvider } from '../../../../renderer-context';
import type { RendererContextProps } from '../../../../renderer-context';
import { RendererCssClassName } from '../../../../consts';

const getTableContainer = (container: HTMLElement): HTMLElement => {
	const tableContainer = container.querySelector<HTMLElement>(
		`.${TableSharedCssClassName.TABLE_CONTAINER}`,
	);

	if (!tableContainer) {
		throw new Error('Expected a table container to be rendered');
	}

	return tableContainer;
};

const getColStyles = (element: HTMLElement): CSSStyleDeclaration[] =>
	Array.from(element.querySelectorAll('col')).map((col) => col.style);

const checkColWidths = (element: HTMLElement, expectedColWidths: number[]) => {
	expect(getColStyles(element).map((style) => style.width)).toEqual(
		expectedColWidths.map((width) => `${width}px`),
	);
};

const getBodyRowsText = (container: HTMLElement): string[][] =>
	Array.from(container.querySelectorAll('tr'))
		.slice(1)
		.map((row) => Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent ?? ''));

const getSortButtons = () => screen.queryAllByRole('button');

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

const basicTable = ({
	columnWidths,
	isNumberColumnEnabled = true,
	renderWidth = akEditorDefaultLayoutWidth,
	layout = 'default',
	rendererAppearance = 'full-page',
	isInsideOfBlockNode = false,
	allowTableResizing = false,
}: {
	allowTableResizing?: boolean;
	columnWidths?: number[];
	isInsideOfBlockNode?: boolean;
	isNumberColumnEnabled?: boolean;
	layout?: TableLayout;
	rendererAppearance?: RendererAppearance;
	renderWidth?: number;
} = {}) => (
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
	</Table>
);

const renderBasicTable = (options?: Parameters<typeof basicTable>[0]) =>
	renderWithIntl(basicTable(options));

const renderTable = (
	node: PMNode,
	rendererWidth: number,
	columnWidths?: number[],
	appearance: RendererAppearance = 'full-page',
	isInsideOfBlockNode = false,
	allowTableAlignment = false,
	allowTableResizing = false,
	isInsideOfTable = false,
) => {
	return renderWithIntl(
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

const renderTableWithFF = (
	featureFlags: RendererContextProps['featureFlags'],
	node: PMNode,
	rendererWidth: number,
	columnWidths?: number[],
	appearance: RendererAppearance = 'full-page',
	isInsideOfBlockNode = false,
	isTopLevelRenderer: RendererContextProps['isTopLevelRenderer'] = true,
	isInsideOfTable = false,
	allowTableResizing = false,
	allowFixedColumnWidthOption?: boolean,
) => {
	return renderWithIntl(
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
				allowFixedColumnWidthOption={allowFixedColumnWidthOption}
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
	const renderContentModeTable = (isTopLevelRenderer: boolean) =>
		renderTableWithFF(
			{},
			schema.nodeFromJSON({
				...table(tr([th()(p('Header'))]), tr([td()(p('Body'))])),
				attrs: { layout: 'align-start' },
			}),
			renderWidth,
			undefined,
			'full-page',
			false,
			isTopLevelRenderer,
			false,
			true,
		);

	const contentModeTables = (container: HTMLElement) =>
		container.querySelectorAll('table[data-initial-width-mode="content"]');

	it('disables content mode for nested renderers', () => {
		const { container: nestedRenderer } = renderContentModeTable(false);

		expect(contentModeTables(nestedRenderer)).toHaveLength(0);

		const { container: topLevelRenderer } = renderContentModeTable(true);

		expect(contentModeTables(topLevelRenderer)).toHaveLength(1);
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderTable(createDefaultTable(), renderWidth);

		await expect(container).toBeAccessible();
	});

	it('should render table DOM with all attributes', () => {
		const { container } = renderBasicTable({ renderWidth, layout: 'full-width' });

		expect(container.querySelectorAll('table')).toHaveLength(1);
		expect(container.querySelectorAll('div[data-layout="full-width"]')).toHaveLength(1);
		expect(screen.getByTestId('renderer-table')).toHaveAttribute('data-number-column', 'true');
	});

	it('should render table props', () => {
		const columnWidths = [100, 110, 120];
		const { container } = renderBasicTable({ columnWidths, renderWidth });

		expect(getTableContainer(container)).toHaveAttribute('data-layout', 'default');
		expect(screen.getByTestId('renderer-table')).toHaveAttribute('data-number-column', 'true');
		expect(container.querySelectorAll(`td.${RendererCssClassName.NUMBER_COLUMN}`)).toHaveLength(1);
		expect(container.querySelectorAll('col')).toHaveLength(columnWidths.length + 1);
	});

	it('should NOT render a colgroup when columnWidths is an empty array', () => {
		const columnWidths: Array<number> = [];
		const { container } = renderBasicTable({
			columnWidths,
			renderWidth,
			isNumberColumnEnabled: false,
		});

		expect(container.querySelectorAll('col')).toHaveLength(0);
	});

	it('should NOT render a colgroup when columnWidths is an array of zeros', () => {
		const columnWidths: Array<number> = [0, 0, 0];
		const { container } = renderBasicTable({
			columnWidths,
			renderWidth,
			isNumberColumnEnabled: false,
			allowTableResizing: true,
		});

		expect(container.querySelectorAll('col')).toHaveLength(3);
	});

	it('should render children', () => {
		const { container } = renderBasicTable({ renderWidth });

		expect(getTableContainer(container)).toHaveAttribute('data-layout', 'default');
		expect(screen.getAllByRole('row')).toHaveLength(1);
		expect(
			container.querySelectorAll(`td:not(.${RendererCssClassName.NUMBER_COLUMN})`),
		).toHaveLength(3);
	});

	describe('When number column is enabled', () => {
		describe('When header row is enabled', () => {
			it('should start numbers from the second row', () => {
				const { container } = renderWithIntl(
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

				container.querySelectorAll('tr').forEach((row, index) => {
					expect(row.querySelector('td')?.textContent).toEqual(index === 0 ? '' : `${index}`);
				});
			});
		});
		describe('When header row is disabled', () => {
			it('should start numbers from the first row', () => {
				const { container } = renderWithIntl(
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

				container.querySelectorAll('tr').forEach((row, index) => {
					expect(row.querySelector('td')?.textContent).toEqual(`${index + 1}`);
				});
			});
		});

		describe('when columnWidths is set and is equal to table container minus 1', () => {
			it('should have the correct width for numbered column', () => {
				const { container } = renderWithIntl(
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

				// The table is sized by CSS container queries, so data columns are emitted as
				// percentages of the scaled table width - only the number column stays fixed.
				const resultingColumnWidths = [39.6414342629482, 60.3585657370518];
				const colStyles = getColStyles(container);
				expect(colStyles).toHaveLength(3);

				colStyles.forEach((style, index) => {
					if (index === 0) {
						expect(style.width).toEqual(`${akEditorTableNumberColumnWidth}px`);
					} else {
						expect(style.width).toEqual(`${resultingColumnWidths[index - 1]}%`);
					}
				});
			});
		});

		describe('when columnWidths is set and smaller than table container', () => {
			it('should have the correct width for numbered column ', () => {
				const { container } = renderWithIntl(
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

				// col widths get scaled up when num cols is enabled, then emitted as percentages
				// because the table width itself is driven by CSS container queries.
				const resultingColumnWidths = [44.223107569721115, 55.77689243027888];
				const colStyles = getColStyles(container);
				expect(colStyles).toHaveLength(3);

				colStyles.forEach((style, index) => {
					if (index === 0) {
						expect(style.width).toEqual(`${akEditorTableNumberColumnWidth}px`);
					} else {
						expect(style.width).toEqual(`${resultingColumnWidths[index - 1]}%`);
					}
				});
			});
		});

		it('should have the correct width for numbered column when no columnWidths', () => {
			const { container } = renderWithIntl(
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

			const colStyles = getColStyles(container);

			expect(colStyles).toHaveLength(3);
			colStyles.forEach((style, index) => {
				if (index === 0) {
					expect(style.width).toEqual(`${akEditorTableNumberColumnWidth}px`);
				} else {
					expect(style.minWidth).toEqual('');
				}
			});
		});
	});

	describe('When number column is disabled', () => {
		it('should not add an extra <col> node for number column', () => {
			const columnWidths = [300, 380];
			const { container } = renderWithIntl(
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

			// Columns are scaled down by the maximum 30% because the table width is resolved by
			// CSS container queries rather than a measured render width.
			checkColWidths(container, [210, 266]);
		});
	});

	describe('When multiple columns do not have width', () => {
		const fourColumnTable = (columnWidths: number[], isNumberColumnEnabled: boolean) => (
			<Table
				layout="default"
				isNumberColumnEnabled={isNumberColumnEnabled}
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
			</Table>
		);

		describe('when renderWidth is smaller than table minimum allowed width', () => {
			it('should add minWidth to zero width columns', () => {
				const columnWidths = [260, 260, 0, 0];

				const { container, rerender } = renderWithIntl(fourColumnTable(columnWidths, true));
				rerender(fourColumnTable(columnWidths, false));

				checkColWidths(container, [
					columnWidths[0] - 1,
					columnWidths[1] - 1,
					tableCellMinWidth,
					tableCellMinWidth,
				]);
			});
		});
		describe('when the table is narrower than the minimum allowed width', () => {
			it('should add minWidth to zero width columns', () => {
				const columnWidths = [200, 200, 0, 0];

				const { container, rerender } = renderWithIntl(fourColumnTable(columnWidths, true));
				rerender(fourColumnTable(columnWidths, false));

				const colStyles = getColStyles(container);

				// With CSS container query sizing there is no measured render width to compare
				// against, so zero width columns always fall back to the legacy cell min width.
				expect(colStyles).toHaveLength(4);
				colStyles.forEach((style, index) => {
					if (index < 2) {
						expect(style.width).toEqual(`${columnWidths[index] - 1}px`);
					} else {
						expect(style.width).toEqual(`${tableCellMinWidth}px`);
					}
				});
			});
		});
	});

	describe('when renderWidth is 20% lower than table width', () => {
		it('should scale down columns widths by the maximum 30%', () => {
			const columnWidths = [200, 200, 280];
			const { container } = renderWithIntl(
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
			// The table container is sized with CSS container queries, so columns always take the
			// maximum 30% scale down instead of scaling relative to a measured render width.
			checkColWidths(
				container,
				columnWidths.map((width) => Math.floor(width * 0.7)),
			);
		});
	});

	describe('when renderWidth is 40% lower than table width', () => {
		it('should scale down columns widths by 30% and then overflow', () => {
			const columnWidths = [200, 200, 280];
			const { container } = renderWithIntl(
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

			checkColWidths(
				container,
				columnWidths.map((width) => width - width * 0.3),
			);
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

		it('should add sortable props to first table row', async () => {
			const tableFromSchema = schema.nodeFromJSON(tableDoc);

			const { container } = renderWithIntl(
				<Table
					layout="default"
					renderWidth={renderWidth}
					allowColumnSorting={true}
					tableNode={tableFromSchema}
					isNumberColumnEnabled={false}
					rendererAppearance="full-page"
				>
					<TableRow allowColumnSorting={true}>
						<TableHeader allowColumnSorting={true} />
						<TableHeader allowColumnSorting={true} />
						<TableHeader allowColumnSorting={true} />
					</TableRow>
					<TableRow>
						<TableCell />
						<TableCell />
						<TableCell />
					</TableRow>
				</Table>,
			);

			const sortButtons = getSortButtons();
			expect(sortButtons).toHaveLength(3);

			await userEvent.click(sortButtons[0]);

			const headers = container.querySelectorAll('th');
			expect(headers[0]).toHaveAttribute('aria-sort', 'ascending');
			expect(headers[1]).toHaveAttribute('aria-sort', 'none');
			expect(headers[2]).toHaveAttribute('aria-sort', 'none');
		});

		describe('when header row is not enabled', () => {
			it('should not add sortable props to the first table row', () => {
				const tableFromSchema = schema.nodeFromJSON(tableDoc);

				renderWithIntl(
					<Table
						layout="default"
						renderWidth={renderWidth}
						allowColumnSorting={true}
						tableNode={tableFromSchema}
						isNumberColumnEnabled={false}
						rendererAppearance="full-page"
					>
						<TableRow allowColumnSorting={true}>
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

				expect(getSortButtons()).toHaveLength(0);
			});
		});

		describe('when there is merged cell on table', () => {
			it('should not add sortable props to the first table row', () => {
				const tableFromSchema = schema.nodeFromJSON(tableDocWithMergedCell);

				const { container } = renderWithIntl(
					<Table
						layout="default"
						renderWidth={renderWidth}
						allowColumnSorting={true}
						tableNode={tableFromSchema}
						isNumberColumnEnabled={false}
						rendererAppearance="full-page"
					>
						<TableRow allowColumnSorting={true}>
							<TableHeader allowColumnSorting={true} />
							<TableHeader allowColumnSorting={true} />
							<TableHeader allowColumnSorting={true} />
						</TableRow>
						<TableRow>
							<TableCell />
							<TableCell />
						</TableRow>
					</Table>,
				);

				expect(getSortButtons()).toHaveLength(0);
				expect(
					container.querySelectorAll(`.${RendererCssClassName.SORTABLE_COLUMN_ICON_WRAPPER}`)[0],
				).toBeInTheDocument();
				expect(container.querySelectorAll('[aria-disabled="true"]')).toHaveLength(3);
			});
		});

		describe('when there is no tableNode', () => {
			it('should not add sortable props to the first table row', () => {
				renderWithIntl(
					<Table
						layout="default"
						renderWidth={renderWidth}
						allowColumnSorting={true}
						isNumberColumnEnabled={false}
						rendererAppearance="full-page"
					>
						<TableRow allowColumnSorting={true}>
							<TableHeader allowColumnSorting={true} />
							<TableHeader allowColumnSorting={true} />
							<TableHeader allowColumnSorting={true} />
						</TableRow>
						<TableRow>
							<TableCell />
							<TableCell />
							<TableCell />
						</TableRow>
					</Table>,
				);

				expect(getSortButtons()).toHaveLength(0);
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
			])('should sort using %p to resolve inlineCard titles', async (storage, expected) => {
				const tableFromSchema = schema.nodeFromJSON(tableWithInlineCardsDoc);

				const { container } = renderWithIntl(
					<SmartCardStorageContext.Provider value={storage}>
						<Table
							layout="default"
							renderWidth={renderWidth}
							allowColumnSorting={true}
							tableNode={tableFromSchema}
							isNumberColumnEnabled={false}
							rendererAppearance="full-page"
						>
							<TableRow allowColumnSorting={true}>
								<TableHeader allowColumnSorting={true} />
								<TableHeader allowColumnSorting={true} />
							</TableRow>
							<TableRow>
								<TableCell>row-2</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>row-3</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>row-4</TableCell>
							</TableRow>
						</Table>
					</SmartCardStorageContext.Provider>,
				);

				await userEvent.click(getSortButtons()[0]);

				const sortPosition = getBodyRowsText(container).map(([cellText]) => cellText);

				expect(sortPosition).toEqual(expected.slice(1).map((position) => `row-${position}`));
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

		const renderSortableTable = () =>
			renderWithIntl(
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
								<TableRow key={rowIndex} allowColumnSorting={true}>
									{row.map((_, headerIndex) => (
										// Ignored via go/ees005
										// eslint-disable-next-line react/no-array-index-key
										<TableHeader key={headerIndex} allowColumnSorting={true} />
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

		const sortColumn = async (columnIndex: number, clicks: number) => {
			for (let click = 0; click < clicks; click++) {
				await userEvent.click(getSortButtons()[columnIndex]);
			}
		};

		const ASCENDING = 1;
		const DESCENDING = 2;
		const NO_ORDER = 3;

		describe('when sorting on the first column', () => {
			const sortedByFirstColumn = [
				[' C', 'C'],
				['!c', 'A nEw world'],
				['1a', '@yolo'],
				['a1', 'be@ns'],
				['BBb', ' '],
				['Bbb', 'A'],
				['bBBB', 'B'],
				['C', 'A nEw world!'],
			];

			it('should sort table by column A to Z', async () => {
				const { container } = renderSortableTable();

				await sortColumn(0, ASCENDING);

				expect(getBodyRowsText(container)).toEqual(sortedByFirstColumn);
			});

			it('should sort table by column Z to A', async () => {
				const { container } = renderSortableTable();

				await sortColumn(0, DESCENDING);

				expect(getBodyRowsText(container)).toEqual([...sortedByFirstColumn].reverse());
			});

			it('should clear table order', async () => {
				const { container } = renderSortableTable();

				await sortColumn(0, NO_ORDER);

				expect(getBodyRowsText(container)).toEqual(initialTableState.slice(1));
			});
		});

		describe('when sorting on the second column', () => {
			const sortedBySecondColumn = [
				['BBb', ' '],
				['1a', '@yolo'],
				['Bbb', 'A'],
				['!c', 'A nEw world'],
				['C', 'A nEw world!'],
				['bBBB', 'B'],
				['a1', 'be@ns'],
				[' C', 'C'],
			];

			it('should sort table by column A to Z', async () => {
				const { container } = renderSortableTable();

				await sortColumn(1, ASCENDING);

				expect(getBodyRowsText(container)).toEqual(sortedBySecondColumn);
			});

			it('should sort table by column Z to A', async () => {
				const { container } = renderSortableTable();

				await sortColumn(1, DESCENDING);

				expect(getBodyRowsText(container)).toEqual([...sortedBySecondColumn].reverse());
			});

			it('should clear table order', async () => {
				const { container } = renderSortableTable();

				await sortColumn(1, NO_ORDER);

				expect(getBodyRowsText(container)).toEqual(initialTableState.slice(1));
			});
		});
	});

	describe('table with overflow shadows', () => {
		it('when columnWidths are not set, should not render shadows', () => {
			const { container } = renderBasicTable({ columnWidths: [0, 0, 0] });

			expect(container.querySelector(`.${shadowClassNames.LEFT_SHADOW}`)).not.toBeInTheDocument();
			expect(container.querySelector(`.${shadowClassNames.RIGHT_SHADOW}`)).not.toBeInTheDocument();
		});

		it('when columnWidths are set should render shadows', () => {
			const { container } = renderBasicTable({ columnWidths: [100, 100, 100] });

			expect(
				container.querySelector(`.${shadowObserverClassNames.SENTINEL_LEFT}`),
			).toBeInTheDocument();
			expect(
				container.querySelector(`.${shadowObserverClassNames.SENTINEL_RIGHT}`),
			).toBeInTheDocument();
		});
	});

	describe('Table widths', () => {
		it('table is centered and has correct width', () => {
			const tableNode = createTable(700, 'wide');
			const rendererWidth = 1800;
			const { container } = renderTable(
				tableNode,
				rendererWidth,
				undefined,
				'full-page',
				false,
				false,
				true,
			);

			const tableContainer = getTableContainer(container);

			expect(tableContainer.style.width).toBe('calc(min(700px, 100cqw - 32px * 2))');
			// In full-page the table is allowed to break out of the line length, so `left` is a
			// container query expression that resolves to 0 while the table fits the line length.
			expect(tableContainer.style.left).toBe(
				'calc(min(0px, 760px - min(700px, 100cqw - 32px * 2)) / 2)',
			);
		});

		it('default table should be full width in full-width mode', () => {
			const tableNode = createDefaultTable();
			const rendererWidth = 1800;

			const { container } = renderTable(
				tableNode,
				rendererWidth,
				undefined,
				'full-width',
				false,
				false,
				true,
			);

			expect(getTableContainer(container).style.width).toBe('calc(min(1800px, 100cqw))');
		});

		it('default table should be responsively full width in full-width mode', () => {
			const tableNode = createDefaultTable();
			const rendererWidth = 900;
			const { container } = renderTable(
				tableNode,
				rendererWidth,
				undefined,
				'full-width',
				false,
				false,
				true,
			);

			// The container query caps the table at the full-width layout width and lets it shrink
			// with the container, rather than baking in the measured renderer width.
			expect(getTableContainer(container).style.width).toBe('calc(min(1800px, 100cqw))');
		});

		it('table width responsively scales down', () => {
			const tableNode = createTable(700, 'wide');
			const rendererWidth = 600;

			const { container } = renderTable(
				tableNode,
				rendererWidth,
				undefined,
				'full-page',
				false,
				false,
				true,
			);

			const tableContainer = getTableContainer(container);

			expect(tableContainer.style.width).toBe('calc(min(700px, 100cqw - 32px * 2))');
			// Sizing is resolved by the container query, so the same CSS is emitted regardless of
			// the measured renderer width - it just resolves to a different value at runtime.
			expect(tableContainer.style.left).toBe(
				'calc(min(0px, 760px - min(700px, 100cqw - 32px * 2)) / 2)',
			);
		});

		it('table scales table columns down', () => {
			const tableWidth = 960;
			const scale = 0.9;
			const tableNode = createTable(tableWidth, 'wide');
			const rendererWidth = tableWidth * scale;
			const colWidths = [420, 220, 320];
			// Columns take the maximum 30% scale down: the table width is resolved by CSS container
			// queries, so there is no measured render width to scale proportionally against.
			const expectedWidths = colWidths.map((w) => Math.floor(w * 0.7));

			const { container } = renderTable(tableNode, rendererWidth, [420, 220, 320]);

			checkColWidths(getTableContainer(container), expectedWidths);
		});

		it('table scales table columns down max 30%', () => {
			const tableWidth = 960;
			const scale = 0.6;
			const tableNode = createTable(tableWidth, 'wide');
			const rendererWidth = tableWidth * scale;
			const colWidths = [420, 220, 320];
			const expectedWidths = colWidths.map((w) => w * 0.7);

			const { container } = renderTable(tableNode, rendererWidth, colWidths);

			checkColWidths(getTableContainer(container), expectedWidths);
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
				const { container } = renderTable(
					tableNode,
					rendererWidth,
					colWidths,
					'full-page',
					false,
					false,
					true,
				);

				checkColWidths(getTableContainer(container), expectedWidths([166, 166, 166]));
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
				const { container } = renderTable(
					tableNode,
					rendererWidth,
					colWidths,
					'full-page',
					false,
					false,
					true,
				);

				checkColWidths(getTableContainer(container), expectedWidths([399, 399, 399]));
			});

			it('should render table columns as undefined when nested in a block node', () => {
				const tableWidth = 500;
				const scale = 0.6;
				const tableNode = createTable(tableWidth, 'default');
				const rendererWidth = tableWidth * scale;
				// column widths 0 as they're undefined
				const colWidths = [0, 0, 0];

				const { container } = renderTable(tableNode, rendererWidth, colWidths, undefined, true);

				expect(getTableContainer(container).querySelectorAll('colgroup')).toHaveLength(0);
			});

			it('should NOT render a colgroup when isInsideOfTable and columns have not been resized', () => {
				const tableWidth = 500;
				const scale = 0.6;
				const tableNode = createTable(tableWidth, 'default');
				const rendererWidth = tableWidth * scale;
				// column widths 0 as they're undefined
				const colWidths = [0, 0, 0];

				const { container } = renderTable(
					tableNode,
					rendererWidth,
					colWidths,
					undefined,
					false,
					false,
					true,
					true,
				);

				expect(getTableContainer(container).querySelectorAll('colgroup')).toHaveLength(0);
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

				const { container } = renderTableWithFF(
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

				// The nested renderer no longer measures a render width - the table is sized by CSS
				// container queries - so unresized columns fall back to the minimum cell width and
				// the container query keeps them inside the available space.
				checkColWidths(getTableContainer(container), [48, 48, 48]);
			});
		});

		it('table columns scale down even when renderer width is bigger than table width', () => {
			const tableNode = createDefaultTable();
			const rendererWidth = 1400;
			const colWidths = [420, 220, 620];
			// Columns take the maximum 30% scale down: the table width is resolved by CSS container
			// queries, so the renderer width is no longer compared against the table width.
			const expectedNotScaledWidths = colWidths.map((w) => Math.floor(w * 0.7));

			const { container } = renderTable(tableNode, rendererWidth, colWidths);

			checkColWidths(getTableContainer(container), expectedNotScaledWidths);
		});

		it('table column does not scales down when table is fixed and tableWithFixedColumnWidthsOption is enabled', () => {
			const tableNode = createDefaultTable('fixed');
			const rendererWidth = 700;

			const { container } = renderTableWithFF(
				undefined,
				tableNode,
				rendererWidth,
				[420, 220, 620],
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				true,
			);

			checkColWidths(getTableContainer(container), [419, 219, 619]);
		});

		it('table scales down when table when tableWithFixedColumnWidthsOption is disabled', () => {
			const scale = 0.7;
			const tableNode = createDefaultTable('fixed');
			const rendererWidth = 700;
			const colWidths = [420, 220, 620];
			const expectedScaleWidths = colWidths.map((w) => w * scale);

			const { container } = renderTableWithFF(
				undefined,
				tableNode,
				rendererWidth,
				[420, 220, 620],
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				false,
			);

			checkColWidths(getTableContainer(container), expectedScaleWidths);
		});

		it('should have correct style when table alignment is enabled', () => {
			const tableNode = createTable(600, 'align-start');
			const rendererWidth = 1000;

			const allowTableAlignment = true;
			const { container } = renderTable(
				tableNode,
				rendererWidth,
				undefined,
				'full-page',
				false,
				allowTableAlignment,
			);

			// The offset is expressed as a container query so it stays correct as the container
			// resizes; it resolves to -80px at the 600px table width used here.
			expect(getTableContainer(container).style.left).toBe(
				'calc((min(600px, 100cqw - 32px * 2) - 760px) / 2)',
			);
		});

		it('should not have left alignment when table alignment is not enabled', () => {
			const tableNode = createTable(600, 'align-start');
			const rendererWidth = 1000;

			const { container } = renderTable(tableNode, rendererWidth);

			// Clamped to a maximum of 0px, so the table is never shifted left.
			expect(getTableContainer(container).style.left).toBe(
				'calc(min(0px, 760px - min(600px, 100cqw - 32px * 2)) / 2)',
			);
		});

		it('should not have left style when table is inside of a block node', () => {
			// should not have left style when table is inside of a block node
			const tableNode = createTable(600, 'align-start');
			const rendererWidth = 1000;

			const allowTableAlignment = true;
			const { container } = renderTable(
				tableNode,
				rendererWidth,
				[],
				undefined,
				true,
				allowTableAlignment,
			);

			// Clamped to a maximum of 0px, so the table is never shifted left.
			expect(getTableContainer(container).style.left).toBe(
				'calc(min(0px, 760px - min(600px, 100cqw - 32px * 2)) / 2)',
			);
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
			const { container } = renderTable(
				tableNode,
				rendererWidth,
				columnWidths,
				'comment',
				isInsideOfBlockNode,
				allowTableResizing,
				allowTableAlignment,
			);

			expect(getTableContainer(container).style.width).toBe('inherit');
		});

		it('default table should have the same width as renderer when table resizing and alignment are disabled', () => {
			const tableNode = createDefaultTable('default');
			const rendererWidth = 900;

			const columnWidths = undefined;
			const { container } = renderTable(tableNode, rendererWidth, columnWidths, 'comment');

			expect(getTableContainer(container).style.width).toBe('inherit');
		});

		it('resized table should have correct width when table resizing is enabled and alignment is NOT enabled', () => {
			const tableWidth = 300;
			const tableNode = createTable(tableWidth, 'default');
			const rendererWidth = 900;

			const columnWidths = undefined;
			const isInsideOfBlockNode = false;
			const allowTableResizing = true;
			const allowTableAlignment = false;
			const { container } = renderTable(
				tableNode,
				rendererWidth,
				columnWidths,
				'comment',
				isInsideOfBlockNode,
				allowTableAlignment,
				allowTableResizing,
			);

			expect(getTableContainer(container).style.width).toBe(`calc(min(${tableWidth}px, 100cqw))`);
		});

		it('edge case: a table with 760px width when table resizing is enabled and alignment is NOT enabled should inherit renderer width', () => {
			const tableWidth = 760;
			const tableNode = createTable(tableWidth, 'default');
			const rendererWidth = 900;

			const columnWidths = undefined;
			const isInsideOfBlockNode = false;
			const allowTableResizing = true;
			const allowTableAlignment = false;
			const { container } = renderTable(
				tableNode,
				rendererWidth,
				columnWidths,
				'comment',
				isInsideOfBlockNode,
				allowTableAlignment,
				allowTableResizing,
			);

			expect(getTableContainer(container).style.width).toBe('inherit');
		});

		it('resized table should have correct width when table resizing and alignment are enabled', () => {
			const tableWidth = 300;
			const tableNode = createTable(tableWidth, 'align-start');
			const rendererWidth = 900;

			const columnWidths = undefined;
			const isInsideOfBlockNode = false;
			const allowTableResizing = true;
			const allowTableAlignment = true;
			const { container } = renderTable(
				tableNode,
				rendererWidth,
				columnWidths,
				'comment',
				isInsideOfBlockNode,
				allowTableAlignment,
				allowTableResizing,
			);

			expect(getTableContainer(container).style.width).toBe(`calc(min(${tableWidth}px, 100cqw))`);
		});

		it('resized table should have correct width when table resizing and alignment are disabled', () => {
			const tableWidth = 300;
			const tableNode = createTable(tableWidth, 'default');
			const rendererWidth = 900;

			const columnWidths = undefined;
			const { container } = renderTable(tableNode, rendererWidth, columnWidths, 'comment');

			expect(getTableContainer(container).style.width).toBe('inherit');
		});

		it('should have correct styles when table alignment is enabled in Comment Renderer', () => {
			const tableNode = createTable(600, 'align-start');
			const rendererWidth = 1000;

			const allowTableAlignment = true;
			const { container } = renderTable(
				tableNode,
				rendererWidth,
				undefined,
				'comment',
				false,
				allowTableAlignment,
			);

			// Expressed as a container query; resolves to -200px at the 1000px renderer width.
			expect(getTableContainer(container).style.left).toBe(
				'calc((min(600px, 100cqw) - 100cqw) / 2)',
			);
		});

		it('should have correct styles when table alignment is not enabled in Comment Renderer', () => {
			const tableNode = createTable(600, 'align-start');
			const rendererWidth = 1000;

			const { container } = renderTable(tableNode, rendererWidth, undefined, 'comment');

			expect(getTableContainer(container).style.left).toBe('');
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

		const renderSSRTable = (
			node: PMNode,
			columnWidths?: number[],
			appearance: RendererAppearance = 'full-page',
			isInsideOfBlockNode = false,
			allowTableResizing = false,
		) => {
			return renderWithIntl(
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
			const { container } = renderSSRTable(tableNode, undefined, 'full-width', true, true);

			const tableContainer = getTableContainer(container);

			expect(tableContainer.style.width).toBe('calc(min(700px, 100cqw))');
			expect(tableContainer.style.left).toBe('');
		});

		it('default table should be full width in full-width mode', () => {
			const tableNode = createDefaultTable();
			const { container } = renderSSRTable(tableNode, undefined, 'full-width', false, true);

			expect(getTableContainer(container).style.width).toBe('calc(min(1800px, 100cqw))');
		});
	});
});
