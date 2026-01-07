import React from 'react';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import staticData from '../../../examples/data-cleancode-toc.json';
import TableTree, { Cell, Header, Headers, Row, Rows } from '../../index';

const c = (title: any, children?: any) => ({
	title,
	id: title.replaceAll(' ', '-').toLowerCase(),
	children,
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('TableTree', () => {
	const Title = (props: any) => <span>{props.title}</span>;
	const Numbering = (props: any) => <span>{props.numbering}</span>;
	const labelValue = 'test label';
	const { children } = staticData;
	it('should have label', () => {
		render(
			<TableTree
				headers={['Title', 'Numbering']}
				columns={[Title, Numbering]}
				columnWidths={['200px', '200px']}
				items={children}
				label={labelValue}
			/>,
		);
		expect(screen.getByRole('treegrid')).toHaveAttribute('aria-label');
		expect(screen.getByRole('treegrid')).toHaveAccessibleName(labelValue);
	});
	it('should have reference to label', () => {
		render(
			<div>
				<h2 id="table-label">{labelValue}</h2>
				<TableTree
					headers={['Title', 'Numbering']}
					columns={[Title, Numbering]}
					columnWidths={['200px', '200px']}
					items={children}
					referencedLabel="table-label"
				/>
				,
			</div>,
		);
		expect(screen.getByRole('treegrid')).toHaveAttribute('aria-labelledby');
		expect(screen.getByRole('treegrid')).toHaveAccessibleName(labelValue);
	});
});

test('flat tree', async () => {
	const flatItems = [
		{ title: 'Chapter One', page: 10, id: 'chapter-one' },
		{ title: 'Chapter Two', page: 20, id: 'chapter-two' },
		{ title: 'Chapter Three', page: 30, id: 'chapter-three' },
	];

	render(
		<TableTree>
			<Rows
				items={flatItems}
				render={({ title, page }) => (
					<Row itemId={title} hasChildren={false}>
						<Cell>{title}</Cell>
						<Cell>{page}</Cell>
					</Row>
				)}
			/>
		</TableTree>,
	);

	const rows = screen.getAllByRole('row');

	expect(rows).toHaveLength(3);

	const [firstRow, secondRow, thirdRow] = rows.map((row) => within(row).getAllByRole('gridcell'));

	expect(firstRow[0]).toHaveTextContent('Chapter One');
	expect(firstRow[1]).toHaveTextContent('10');
	expect(secondRow[0]).toHaveTextContent('Chapter Two');
	expect(secondRow[1]).toHaveTextContent('20');
	expect(thirdRow[0]).toHaveTextContent('Chapter Three');
	expect(thirdRow[1]).toHaveTextContent('30');
});

test('chevron next to items with children', async () => {
	const nestedData = [
		{
			title: 'Chapter One',
			page: 10,
			id: 'chapter-one',
		},
		{
			title: 'Chapter Two',
			page: 20,
			id: 'chapter-two',
			children: [
				{
					title: 'Chapter Two Subchapter One',
					page: 21,
					id: 'chapter-two-subchapter-one',
				},
			],
		},
	];
	render(
		<TableTree>
			<Rows
				items={nestedData}
				render={({ title, page, children }) => (
					<Row itemId={title} hasChildren={!!children} items={children}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
						<Cell className="title">{title}</Cell>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
						<Cell className="page">{page}</Cell>
					</Row>
				)}
			/>
		</TableTree>,
	);

	const [firstRow, secondRow] = screen.getAllByRole('row');
	const firstRowExpandChevron = within(firstRow).queryByRole('button', {
		name: /expand/i,
	});
	const secondRowExpandChevron = within(secondRow).queryByRole('button', {
		name: /expand/i,
	});

	expect(firstRowExpandChevron).not.toBeInTheDocument();
	expect(secondRowExpandChevron).toBeInTheDocument();
});

describe('expanding and collapsing', () => {
	const nestedData = [
		c('Chapter 1'),
		c('Chapter 2', [c('Chapter 2.1', [c('Chapter 2.1.1')])]),
		c('Chapter 3'),
	];
	const jsx = (
		<TableTree>
			<Rows
				items={nestedData}
				render={({ title, children }: any) => (
					<Row itemId={title} items={children} hasChildren={children?.length}>
						<Cell>{title}</Cell>
					</Row>
				)}
			/>
		</TableTree>
	);

	// This is a little ganky but this is used for the click handler and Jest
	// doesn't really have a version of getSelection that operates according to
	// the spec.
	const originalSelection = window.getSelection;

	beforeEach(() => {
		window.getSelection = jest.fn(() => '' as unknown as Selection);
	});

	afterAll(() => {
		// Clean up
		window.getSelection = originalSelection;
	});

	it('should expand and collapse when using the buttons at the row header', async () => {
		const user = userEvent.setup();
		render(jsx);

		let rowContent = screen.getAllByRole('gridcell');
		expect(rowContent[0]).toHaveTextContent('Chapter 1');
		expect(rowContent[1]).toHaveTextContent('Chapter 2');
		expect(rowContent[2]).toHaveTextContent('Chapter 3');

		const secondRowExpandButton = screen.getByRole('button', {
			name: /expand/i,
		});
		await user.click(secondRowExpandButton);

		rowContent = screen.getAllByRole('gridcell');

		expect(rowContent[0]).toHaveTextContent('Chapter 1');
		expect(rowContent[1]).toHaveTextContent('Chapter 2');
		expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
		expect(rowContent[3]).toHaveTextContent('Chapter 3');

		const secondFirstChildRowExpandButton = screen.getByRole('button', {
			name: /expand/i,
		});
		await user.click(secondFirstChildRowExpandButton);

		rowContent = screen.getAllByRole('gridcell');
		expect(rowContent[0]).toHaveTextContent('Chapter 1');
		expect(rowContent[1]).toHaveTextContent('Chapter 2');
		expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
		expect(rowContent[3]).toHaveTextContent('Chapter 2.1.1');
		expect(rowContent[4]).toHaveTextContent('Chapter 3');

		const collapseButtons = screen.getAllByRole('button', {
			name: /collapse/i,
		});
		await user.click(collapseButtons[0]);

		rowContent = screen.getAllByRole('gridcell');
		expect(rowContent[0]).toHaveTextContent('Chapter 1');
		expect(rowContent[1]).toHaveTextContent('Chapter 2');
		expect(rowContent[2]).toHaveTextContent('Chapter 3');
	});

	it('should not expand and collapse when clicking anywhere on the row itself when not using shouldExpandOnClick', async () => {
		const user = userEvent.setup();
		const jsxRow = (
			<TableTree>
				<Rows
					items={nestedData}
					render={({ title, children }: any) => (
						<Row itemId={title} items={children} hasChildren={children?.length}>
							<Cell>{title}</Cell>
						</Row>
					)}
				/>
			</TableTree>
		);

		const jsxTableTree = <TableTree items={nestedData} />;

		for (const jsx of [jsxRow, jsxTableTree]) {
			render(jsx);

			const rows = screen.getAllByRole('row');

			let rowContent = screen.getAllByRole('gridcell');
			expect(rowContent[0]).toHaveTextContent('Chapter 1');
			expect(rowContent[1]).toHaveTextContent('Chapter 2');
			expect(rowContent[2]).toHaveTextContent('Chapter 3');

			await user.click(rows[1]);
			rowContent = screen.getAllByRole('gridcell');
			expect(rowContent[0]).toHaveTextContent('Chapter 1');
			expect(rowContent[1]).toHaveTextContent('Chapter 2');
			expect(rowContent[2]).toHaveTextContent('Chapter 3');
		}
	});

	it('should expand and collapse when clicking anywhere on the row itself when using shouldExpandOnClick', async () => {
		const user = userEvent.setup();
		const jsxRow = (
			<TableTree>
				<Rows
					items={nestedData}
					render={({ title, children }: any) => (
						<Row itemId={title} items={children} hasChildren={children?.length} shouldExpandOnClick>
							<Cell>{title}</Cell>
						</Row>
					)}
				/>
			</TableTree>
		);

		const jsxTableTree = <TableTree items={nestedData} shouldExpandOnClick />;

		for (const jsx of [jsxRow, jsxTableTree]) {
			render(jsx);

			const rows = screen.getAllByRole('row');

			let rowContent = screen.getAllByRole('gridcell');
			expect(rowContent[0]).toHaveTextContent('Chapter 1');
			expect(rowContent[1]).toHaveTextContent('Chapter 2');
			expect(rowContent[2]).toHaveTextContent('Chapter 3');

			await user.click(rows[1]);
			rowContent = screen.getAllByRole('gridcell');
			expect(rowContent[0]).toHaveTextContent('Chapter 1');
			expect(rowContent[1]).toHaveTextContent('Chapter 2');
			expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
			expect(rowContent[3]).toHaveTextContent('Chapter 3');

			await user.click(rows[1]);
			rowContent = screen.getAllByRole('gridcell');
			expect(rowContent[0]).toHaveTextContent('Chapter 1');
			expect(rowContent[1]).toHaveTextContent('Chapter 2');
			expect(rowContent[2]).toHaveTextContent('Chapter 3');
		}
	});

	it('should not expand when selecting text anywhere on the row', async () => {
		const user = userEvent.setup();
		// Unfortunately, because Jest's getSelection implementation is lacking, we
		// can't test the selection using RTL, but this will do the trick
		// considering our use of getSelection is only for the `toString` output.
		window.getSelection = jest.fn(() => 'selection' as unknown as Selection);

		const jsxRow = (
			<TableTree>
				<Rows
					items={nestedData}
					render={({ title, children }: any) => (
						<Row itemId={title} items={children} hasChildren={children?.length} shouldExpandOnClick>
							<Cell>{title}</Cell>
						</Row>
					)}
				/>
			</TableTree>
		);

		const jsxTableTree = <TableTree items={nestedData} shouldExpandOnClick />;

		for (const jsx of [jsxRow, jsxTableTree]) {
			render(jsx);

			const rows = screen.getAllByRole('row');

			let rowContent = screen.getAllByRole('gridcell');
			expect(rowContent[0]).toHaveTextContent('Chapter 1');
			expect(rowContent[1]).toHaveTextContent('Chapter 2');
			expect(rowContent[2]).toHaveTextContent('Chapter 3');

			// Should not expand because text is selected
			await user.click(rows[1]);
			rowContent = screen.getAllByRole('gridcell');
			expect(rowContent[0]).toHaveTextContent('Chapter 1');
			expect(rowContent[1]).toHaveTextContent('Chapter 2');
			expect(rowContent[2]).toHaveTextContent('Chapter 3');
		}
	});

	it('should show extended span for expand and collapse button when the mainColumnForExpandCollapseLabel is passed as string', () => {
		const nestedItems = [
			{
				id: 'item1',
				content: {
					title: 'Chapter 1: Clean Code',
					numbering: '1',
				},
				hasChildren: true,
				children: [
					{
						id: 'child1.1',
						content: {
							title: 'There Will Be Code',
							numbering: '1.1',
						},
						hasChildren: false,
					},
				],
			},
		];
		const Title = (props: any) => <span>{props.title}</span>;
		const Numbering = (props: any) => <span>{props.numbering}</span>;
		const jsxTableTree = (
			<TableTree
				items={nestedItems}
				columns={[Title, Numbering]}
				headers={['Chapter Title', 'Numbering']}
				mainColumnForExpandCollapseLabel="title"
			></TableTree>
		);

		render(jsxTableTree);

		expect(screen.getByText(/Expand Chapter 1: Clean Code/)).toBeInTheDocument();
		expect(screen.queryByText(/Expand row item1/)).not.toBeInTheDocument();
	});

	it('should show extended span for expand and collapse button when the mainColumnForExpandCollapseLabel is passed as number', () => {
		const nestedData = [
			{
				title: 'Chapter 1: Clean Code',
				page: 1,
				numbering: 'item1',
				id: 'chapter-one',
				children: [
					{
						title: 'There Will Be Code',
						page: 4,
						numbering: 'item1.1',
						id: 'chapter-one-subchapter-one',
					},
				],
			},
		];

		const jsxTableTree = (
			<TableTree>
				<Rows
					items={nestedData}
					render={({ title, page, numbering, children }: any) => (
						<Row
							itemId={numbering}
							items={children}
							hasChildren={children?.length}
							mainColumnForExpandCollapseLabel={0}
						>
							<Cell>{title}</Cell>
							<Cell>{numbering}</Cell>
							<Cell>{page}</Cell>
						</Row>
					)}
				/>
			</TableTree>
		);

		render(jsxTableTree);

		expect(screen.getByText(/Expand Chapter 1: Clean Code/)).toBeInTheDocument();
		expect(screen.queryByText(/Expand row item1/)).not.toBeInTheDocument();
	});

	it('should show default span for expand and collapse button when the mainColumnForExpandCollapseLabel is not passed', () => {
		const nestedData = [
			{
				title: 'Chapter 1: Clean Code',
				page: 1,
				numbering: 'item1',
				id: 'chapter-one',
				children: [
					{
						title: 'There Will Be Code',
						page: 4,
						numbering: 'item1.1',
						id: 'chapter-one-subchapter-one',
					},
				],
			},
		];

		const jsxTableTree = (
			<TableTree>
				<Rows
					items={nestedData}
					render={({ title, page, numbering, children }: any) => (
						<Row itemId={numbering} items={children} hasChildren={children?.length}>
							<Cell>{title}</Cell>
							<Cell>{numbering}</Cell>
							<Cell>{page}</Cell>
						</Row>
					)}
				/>
			</TableTree>
		);

		render(jsxTableTree);

		expect(screen.getByText(/Expand row item1/)).toBeInTheDocument();
	});

	it('should have proper aria attributes on the row when collapsed and expanded', async () => {
		const user = userEvent.setup();

		render(
			<TableTree>
				<Rows
					// Only include child that has nested children
					items={[nestedData[1]]}
					render={({ title, page, id, numbering, children }: any) => (
						<Row itemId={id} items={children} hasChildren={children?.length}>
							<Cell>{title}</Cell>
							<Cell>{numbering}</Cell>
							<Cell>{page}</Cell>
						</Row>
					)}
				/>
			</TableTree>,
		);

		const row = screen.getAllByRole('row')[0];
		const expandButton = screen.getByRole('button');
		expect(row).toHaveAttribute('aria-expanded', 'false');
		expect(expandButton).not.toHaveAttribute('aria-controls');
		await user.click(expandButton);
		expect(row).toHaveAttribute('aria-expanded', 'true');
		expect(expandButton).toHaveAttribute('aria-controls');
	});

	test('should collapse and expand the row when isDefaultExpanded is true', async () => {
		const user = userEvent.setup();

		const nestedData = [c('Top row', [c('Nested row')])];

		render(
			<TableTree>
				<Rows
					items={nestedData}
					render={({ title, children = [] }) => (
						<Row
							itemId={title}
							items={children}
							hasChildren={children.length > 0}
							isDefaultExpanded
						>
							<Cell>{title}</Cell>
						</Row>
					)}
				/>
			</TableTree>,
		);

		expect(screen.getByRole('row', { name: /Top row/i })).toBeVisible();
		expect(screen.getByRole('row', { name: /Nested row/i })).toBeVisible();

		// Collapse the top row
		const collapseButton = screen.getByRole('button', {
			name: /collapse/i,
		});
		await user.click(collapseButton);

		expect(screen.getByRole('row', { name: /Top row/i })).toBeVisible();
		expect(screen.queryByRole('row', { name: /Nested row/i })).not.toBeInTheDocument();

		// Expand the top row
		const expandButton = screen.getByRole('button', {
			name: /expand/i,
		});
		await user.click(expandButton);

		expect(screen.getByRole('row', { name: /Top row/i })).toBeVisible();
		expect(screen.getByRole('row', { name: /Nested row/i })).toBeVisible();
	});
});

test('with isDefaultExpanded property', async () => {
	const nestedData = [
		c('Chapter 1'),
		c('Chapter 2', [c('Chapter 2.1', [c('Chapter 2.1.1')])]),
		c('Chapter 3'),
	];

	render(
		<TableTree>
			<Rows
				items={nestedData}
				render={({ title, children }) => (
					<Row itemId={title} items={children} hasChildren={!!children} isDefaultExpanded>
						<Cell>{title}</Cell>
					</Row>
				)}
			/>
		</TableTree>,
	);

	const rows = screen.getAllByRole('row');
	const rowContent = rows.map((row) => within(row).getByRole('gridcell'));

	expect(rowContent[0]).toHaveTextContent('Chapter 1');
	expect(rowContent[1]).toHaveTextContent('Chapter 2');
	expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
	expect(rowContent[3]).toHaveTextContent('Chapter 2.1.1');
	expect(rowContent[4]).toHaveTextContent('Chapter 3');
});

test('with isExpanded=true property', async () => {
	const user = userEvent.setup();
	const nestedData = [
		c('Chapter 1'),
		c('Chapter 2', [c('Chapter 2.1', [c('Chapter 2.1.1')])]),
		c('Chapter 3'),
	];
	const onCollapseSpy = jest.fn();

	render(
		<TableTree>
			<Rows
				items={nestedData}
				render={({ title, children }) => (
					<Row
						itemId={title}
						items={children}
						hasChildren={!!children}
						onCollapse={onCollapseSpy}
						isExpanded
					>
						<Cell>{title}</Cell>
					</Row>
				)}
			/>
		</TableTree>,
	);

	let rows = screen.getAllByRole('row');
	let rowContent = rows.map((row) => within(row).getByRole('gridcell'));

	expect(rowContent[0]).toHaveTextContent('Chapter 1');
	expect(rowContent[1]).toHaveTextContent('Chapter 2');
	expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
	expect(rowContent[3]).toHaveTextContent('Chapter 2.1.1');
	expect(rowContent[4]).toHaveTextContent('Chapter 3');

	const secondRowExpandButton = within(rowContent[1]).getByRole('button', {
		name: /collapse/i,
	});
	await user.click(secondRowExpandButton);

	rows = screen.getAllByRole('row');
	rowContent = rows.map((row) => within(row).getByRole('gridcell'));

	expect(rowContent[0]).toHaveTextContent('Chapter 1');
	expect(rowContent[1]).toHaveTextContent('Chapter 2');
	expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
	expect(rowContent[3]).toHaveTextContent('Chapter 2.1.1');
	expect(rowContent[4]).toHaveTextContent('Chapter 3');

	expect(onCollapseSpy).toHaveBeenCalled();

	expect(onCollapseSpy).toBeCalledWith(
		expect.objectContaining({
			...c('Chapter 2'),
			children: expect.any(Array),
		}),
	);
});

test('with isExpanded=false property', async () => {
	const user = userEvent.setup();
	const nestedData = [
		c('Chapter 1'),
		c('Chapter 2', [c('Chapter 2.1', [c('Chapter 2.1.1')])]),
		c('Chapter 3'),
	];
	const onExpandSpy = jest.fn();

	render(
		<TableTree>
			<Rows
				items={nestedData}
				render={({ title, children }) => (
					<Row
						itemId={title}
						items={children}
						hasChildren={!!children}
						onExpand={onExpandSpy}
						isExpanded={false}
					>
						<Cell>{title}</Cell>
					</Row>
				)}
			/>
		</TableTree>,
	);

	let rows = screen.getAllByRole('row');
	let rowContent = rows.map((row) => within(row).getByRole('gridcell'));
	expect(rowContent[0]).toHaveTextContent('Chapter 1');
	expect(rowContent[1]).toHaveTextContent('Chapter 2');
	expect(rowContent[2]).toHaveTextContent('Chapter 3');

	let secondRowExpandButton = within(rowContent[1]).getByRole('button', {
		name: /expand/i,
	});
	await user.click(secondRowExpandButton);

	rows = screen.getAllByRole('row');
	rowContent = rows.map((row) => within(row).getByRole('gridcell'));

	expect(rowContent[0]).toHaveTextContent('Chapter 1');
	expect(rowContent[1]).toHaveTextContent('Chapter 2');
	expect(rowContent[2]).toHaveTextContent('Chapter 3');
	expect(onExpandSpy).toBeCalledWith(
		expect.objectContaining({
			...c('Chapter 2'),
			children: expect.any(Array),
		}),
	);
});

test('headers and column widths', async () => {
	const user = userEvent.setup();
	const nestedData = [
		{
			title: 'Chapter One',
			page: 10,
			id: 'chapter-one',
		},
		{
			title: 'Chapter Two',
			page: 20,
			id: 'chapter-two',
			children: [
				{
					title: 'Chapter Two Subchapter One',
					page: 21,
					id: 'chapter-two-subchapter-one',
				},
			],
		},
	];

	render(
		<TableTree>
			<Headers>
				<Header width={300}>Chapter title</Header>
				<Header width={100}>Page #</Header>
			</Headers>
			<Rows
				items={nestedData}
				render={({ title, page, children }: any) => (
					<Row itemId={title} items={children} hasChildren={!!children}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
						<Cell className="title">{title}</Cell>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
						<Cell className="page">{page}</Cell>
					</Row>
				)}
			/>
		</TableTree>,
	);

	let [, ...rows] = screen.getAllByRole('row');
	let rowContent = rows.map((row) => within(row).getAllByRole('gridcell'));

	expect(rows).toHaveLength(2);

	const secondRowExpandButton = within(rowContent[1][0]).getByRole('button', {
		name: /expand/i,
	});
	await user.click(secondRowExpandButton);

	const headers = screen.getAllByRole('columnheader');
	expect(headers[1]).toHaveTextContent('Page #');

	[, ...rows] = screen.getAllByRole('row');

	const [firstRow, secondRow, thirdRow] = rows.map((row) => within(row).getAllByRole('gridcell'));

	expect(rows).toHaveLength(3);
	expect(firstRow[0]).toHaveStyle({ width: '300px' });
	expect(firstRow[1]).toHaveStyle({ width: '100px' });
	expect(secondRow[0]).toHaveStyle({ width: '300px' });
	expect(secondRow[1]).toHaveStyle({ width: '100px' });
	expect(thirdRow[0]).toHaveStyle({ width: '300px' });
	expect(thirdRow[1]).toHaveStyle({ width: '100px' });
});
