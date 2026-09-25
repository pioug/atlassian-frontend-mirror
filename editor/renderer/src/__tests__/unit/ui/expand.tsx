import React from 'react';

import { act, fireEvent, waitFor } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { IntlProvider } from 'react-intl';

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import ExpandWithInt from '../../../ui/Expand';
import { ExpandBodyBlock, withExpandBodyBlock } from '../../../ui/utils/expand-body';

// Pinned so a server render and the subsequent client render produce identical ids. `_uniqueId` is
// a module-level counter, so otherwise they drift and React logs a (harmless, pre-existing)
// "Prop `id` did not match" warning that would obscure the hydration assertions below.
jest.mock('lodash/uniqueId', () => () => 'expand-title-test');

const BODY_TEXT = 'collapsed body text';

const expandNode = () =>
	defaultSchema.nodeFromJSON({
		type: 'expand',
		attrs: { title: 'Expand test title' },
		content: [{ type: 'paragraph', content: [{ type: 'text', text: BODY_TEXT }] }],
	});

// Expand checks for hidden="until-found" with `'onbeforematch' in document.body`. jsdom implements
// that handler on HTMLElement.prototype, so the check passes by default and jsdom looks like a
// supporting browser. `in` walks the prototype chain, so looking like Safari means taking the
// handler off the prototype that declares it — deleting it from the body alone does nothing.
const onbeforematchOwner = (() => {
	let proto = Object.getPrototypeOf(document.body);
	while (proto && !Object.getOwnPropertyDescriptor(proto, 'onbeforematch')) {
		proto = Object.getPrototypeOf(proto);
	}
	return proto;
})();

const onbeforematchDescriptor =
	onbeforematchOwner && Object.getOwnPropertyDescriptor(onbeforematchOwner, 'onbeforematch');

/** Every piece of text under `root`, however deeply nested. */
const textNodesIn = (root: Element | null): string[] => {
	if (!root) {
		return [];
	}

	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	const text: string[] = [];
	while (walker.nextNode()) {
		text.push(walker.currentNode.textContent ?? '');
	}
	return text;
};

const unsupportHiddenUntilFound = () => {
	if (onbeforematchOwner) {
		delete onbeforematchOwner.onbeforematch;
	}
};

/** Restores jsdom's own handler, which is the default state. */
const supportHiddenUntilFound = () => {
	if (onbeforematchOwner && onbeforematchDescriptor) {
		Object.defineProperty(onbeforematchOwner, 'onbeforematch', onbeforematchDescriptor);
	}
};

describe('Expand', () => {
	const TestChildren = () => <div data-testid="expand-children">Test children content</div>;

	/**
	 * The body as the serializer builds it: ordinary blocks wrapped so they can show their text
	 * instead of rendering, and nothing else changed.
	 */
	const Body = ({ text = BODY_TEXT }: { text?: string }) => (
		<ExpandBodyBlock searchText={text}>
			<TestChildren />
		</ExpandBodyBlock>
	);

	it('should render with a tooltip in web', () => {
		const { queryByTestId } = renderWithIntl(
			<ExpandWithInt
				title={'Expand test title'}
				nodeType={'expand'}
				// eslint-disable-next-line react/no-children-prop
				children={<p>Text inside expand</p>}
				rendererAppearance={'full-page'}
			/>,
		);

		expect(queryByTestId('tooltip--container')).toBeInTheDocument();
	});

	describe('without a node', () => {
		it('should render children on initial load and keep them across expand and collapse', () => {
			const { getByRole, queryByTestId } = renderWithIntl(
				<ExpandWithInt
					title={'Expand test title'}
					nodeType={'expand'}
					rendererAppearance={'full-page'}
				>
					<Body />
				</ExpandWithInt>,
			);

			// No node means this expand never opted into lazy loading, so its blocks render regardless
			// of what the serializer attached to them.
			expect(queryByTestId('expand-children')).toBeInTheDocument();

			const expandButton = getByRole('button');
			fireEvent.click(expandButton);
			expect(queryByTestId('expand-children')).toBeInTheDocument();

			fireEvent.click(expandButton);
			expect(queryByTestId('expand-children')).toBeInTheDocument();
		});
	});

	describe('a collapsed body', () => {
		const renderExpand = () =>
			renderWithIntl(
				<ExpandWithInt
					title={'Expand test title'}
					nodeType={'expand'}
					rendererAppearance={'full-page'}
					node={expandNode()}
				>
					<Body />
				</ExpandWithInt>,
			);

		it('should show the body text instead of rendering it while collapsed', () => {
			const { container, queryByTestId } = renderExpand();

			expect(container.textContent).toContain(BODY_TEXT);
			expect(queryByTestId('expand-children')).not.toBeInTheDocument();
		});

		it('should render the body when expanded', async () => {
			const { container, getByRole, queryByTestId } = renderExpand();

			fireEvent.click(getByRole('button'));

			await waitFor(() => {
				expect(queryByTestId('expand-children')).toBeInTheDocument();
			});
			// Leaving the text behind would duplicate the body content in the DOM.
			expect(container.textContent).not.toContain(BODY_TEXT);
		});

		// PGXT-9021: throwing the body away would re-run every macro and Forge fetch inside it on the
		// next open. We only wanted to save work on first load, and that has already happened.
		it('should keep the body rendered when collapsed again', async () => {
			const { container, getByRole, queryByTestId } = renderExpand();

			const expandButton = getByRole('button');
			fireEvent.click(expandButton);
			await waitFor(() => {
				expect(queryByTestId('expand-children')).toBeInTheDocument();
			});

			fireEvent.click(expandButton);

			await waitFor(() => {
				expect(getByRole('button')).toHaveAttribute('aria-expanded', 'false');
			});
			expect(queryByTestId('expand-children')).toBeInTheDocument();
			expect(container.textContent).not.toContain(BODY_TEXT);
		});

		// Nothing reads the text but browser find, which only needs the characters in the DOM.
		it('should put no element around the text', () => {
			const { container } = renderWithIntl(
				<ExpandWithInt
					title={'Expand test title'}
					nodeType={'expand'}
					rendererAppearance={'full-page'}
					node={expandNode()}
				>
					<Body />
				</ExpandWithInt>,
			);

			const wrapper = container.querySelector('.expand-content-wrapper');

			expect(textNodesIn(wrapper)).toEqual([BODY_TEXT]);
			expect(wrapper?.querySelectorAll('span')).toHaveLength(0);
		});

		// Nothing showing its text is laid out, so the width context and the margin reset are of no use
		// yet — and WidthProvider is not free: two divs, a ResizeObserver and an IntersectionObserver
		// per expand.
		it('should leave the width provider out until the body renders', () => {
			const { container, getByRole } = renderExpand();

			const wrapper = container.querySelector('.expand-content-wrapper');
			expect(wrapper?.children).toHaveLength(0);

			fireEvent.click(getByRole('button'));

			// The provider's own div, holding the margin reset and the body. The wrapper around it is
			// the same element throughout: only what it holds is rebuilt.
			expect(container.querySelector('.expand-content-wrapper')).toBe(wrapper);
			expect(wrapper?.children).toHaveLength(1);
		});

		it('should render a block the serializer gave no text, such as one holding a comment', () => {
			const { queryByTestId } = renderWithIntl(
				<ExpandWithInt
					title={'Expand test title'}
					nodeType={'expand'}
					rendererAppearance={'full-page'}
					node={expandNode()}
				>
					<ExpandBodyBlock>
						<TestChildren />
					</ExpandBodyBlock>
				</ExpandWithInt>,
			);

			// Comment navigation scrolls to the commented text, so it has to be a real element.
			expect(queryByTestId('expand-children')).toBeInTheDocument();
		});
	});

	describe('browser find (beforematch)', () => {
		// Products ship a reset with `[hidden] { display: none }` — Confluence does. As an author rule
		// it beats the UA stylesheet's content-visibility for `[hidden=until-found]` and takes the
		// content out of the page, where find cannot reach it. Setting display alongside the attribute
		// is what keeps the text findable, so the two have to stay together.
		it('should set display on the wrapper alongside the attribute', async () => {
			const { container } = renderWithIntl(
				<ExpandWithInt
					title={'Expand test title'}
					nodeType={'expand'}
					rendererAppearance={'full-page'}
					node={expandNode()}
				>
					<Body />
				</ExpandWithInt>,
			);

			const wrapper = container.querySelector<HTMLElement>('.expand-content-wrapper');
			await waitFor(() => {
				expect(wrapper?.getAttribute('hidden')).toBe('until-found');
			});
			expect(wrapper?.style.display).toBe('block');
		});

		it('should clear that display once the expand is open', async () => {
			const { container, getByRole } = renderWithIntl(
				<ExpandWithInt
					title={'Expand test title'}
					nodeType={'expand'}
					rendererAppearance={'full-page'}
					node={expandNode()}
				>
					<Body />
				</ExpandWithInt>,
			);

			const wrapper = container.querySelector<HTMLElement>('.expand-content-wrapper');
			await waitFor(() => {
				expect(wrapper?.style.display).toBe('block');
			});

			fireEvent.click(getByRole('button'));

			await waitFor(() => {
				expect(wrapper?.hasAttribute('hidden')).toBe(false);
			});
			expect(wrapper?.style.display).toBe('');
		});

		// WebKit scrolls to a find-in-page match by selecting it, so unselectable text is matched but
		// never revealed — the reader is told there is a hit and the expand never opens. Chrome does
		// not need a selection, which hid this. content-visibility:hidden already makes the subtree
		// unselectable, so nothing is lost by leaving the property off.
		it('should leave the collapsed wrapper selectable, so find can reveal it', async () => {
			const { container } = renderWithIntl(
				<ExpandWithInt
					title={'Expand test title'}
					nodeType={'expand'}
					rendererAppearance={'full-page'}
					node={expandNode()}
				>
					<Body />
				</ExpandWithInt>,
			);

			const wrapper = container.querySelector<HTMLElement>('.expand-content-wrapper');
			await waitFor(() => {
				expect(wrapper?.getAttribute('hidden')).toBe('until-found');
			});

			expect(wrapper && getComputedStyle(wrapper).userSelect).not.toBe('none');
		});

		it('should render the body when beforematch fires on the collapsed wrapper', async () => {
			const { container, queryByTestId } = renderWithIntl(
				<ExpandWithInt
					title={'Expand test title'}
					nodeType={'expand'}
					rendererAppearance={'full-page'}
					node={expandNode()}
				>
					<Body />
				</ExpandWithInt>,
			);

			expect(container.textContent).toContain(BODY_TEXT);
			expect(queryByTestId('expand-children')).not.toBeInTheDocument();

			const wrapper = container.querySelector('.expand-content-wrapper');
			expect(wrapper).not.toBeNull();

			await waitFor(() => {
				expect(wrapper?.getAttribute('hidden')).toBe('until-found');
			});

			fireEvent(wrapper as Element, new Event('beforematch'));

			await waitFor(() => {
				expect(queryByTestId('expand-children')).toBeInTheDocument();
			});
			expect(container.textContent).not.toContain(BODY_TEXT);
			// Revealing the content must also clear the attribute that was hiding it.
			expect(wrapper?.hasAttribute('hidden')).toBe(false);
		});
	});

	// A nested expand is left as a real element inside its parent's body, rather than being replaced
	// by text, so the browser can reveal it on its own. One match then opens the whole chain to it.
	describe('nested expands', () => {
		const nestedNodes = new Map<string, PMNode>();

		// Memoised on the body text. The serializer reuses the same node instance across renders and
		// `revealedByFind` is keyed by identity, so building a node inside `Nested` would hand it a
		// different one every time it mounted and lose the expands find had opened.
		const nestedNode = (bodyText: string): PMNode => {
			const cached = nestedNodes.get(bodyText);
			if (cached) {
				return cached;
			}

			const node = defaultSchema.nodeFromJSON({
				type: 'nestedExpand',
				attrs: { title: 'Nested' },
				content: [{ type: 'paragraph', content: [{ type: 'text', text: bodyText }] }],
			});
			nestedNodes.set(bodyText, node);
			return node;
		};

		const Nested = ({ label, bodyText }: { bodyText: string; label: string }) => (
			<ExpandWithInt title={'Nested'} nodeType={'nestedExpand'} node={nestedNode(bodyText)}>
				<ExpandBodyBlock searchText={bodyText}>
					<div data-testid={`${label}-children`}>{label} children</div>
				</ExpandBodyBlock>
			</ExpandWithInt>
		);

		const renderOuter = () =>
			renderWithIntl(
				<ExpandWithInt
					title={'Outer'}
					nodeType={'expand'}
					rendererAppearance={'full-page'}
					node={expandNode()}
				>
					<Body />
					<Nested label="nested-a" bodyText="nested a body" />
					<Nested label="nested-b" bodyText="nested b body" />
				</ExpandWithInt>,
			);

		it('should keep nested expands mounted while the outer one is collapsed', () => {
			const { container, queryByTestId } = renderOuter();

			// The outer body shows its text, but the nested expands are real: three title buttons.
			// Queried through the DOM rather than by role, because the collapsed wrapper carries
			// `hidden`, which takes everything inside it out of the accessibility tree.
			expect(container.textContent).toContain(BODY_TEXT);
			expect(queryByTestId('expand-children')).not.toBeInTheDocument();
			expect(container.querySelectorAll('button')).toHaveLength(3);
			expect(container.textContent).toContain('nested a body');
		});

		it('should open the outer expand too when find matches inside a nested one', async () => {
			const { container, getAllByRole, queryByTestId } = renderOuter();

			const nestedWrappers = container.querySelectorAll('.nestedExpand-content-wrapper');
			expect(nestedWrappers).toHaveLength(2);

			await waitFor(() => {
				expect(nestedWrappers[0].getAttribute('hidden')).toBe('until-found');
			});

			// The browser reveals the element holding the match, which is nested A's own wrapper.
			fireEvent(nestedWrappers[0], new Event('beforematch'));

			await waitFor(() => {
				expect(queryByTestId('nested-a-children')).toBeInTheDocument();
			});

			const [outerButton, nestedAButton, nestedBButton] = getAllByRole('button');
			expect(outerButton).toHaveAttribute('aria-expanded', 'true');
			expect(nestedAButton).toHaveAttribute('aria-expanded', 'true');
			// Nested B is beside the match, not above it, so it stays closed.
			expect(nestedBButton).toHaveAttribute('aria-expanded', 'false');
			expect(queryByTestId('nested-b-children')).not.toBeInTheDocument();
		});

		it('should keep a nested expand open through the rebuild when the outer one opens', async () => {
			const { container, getAllByRole, queryByTestId } = renderOuter();

			const nestedWrappers = container.querySelectorAll('.nestedExpand-content-wrapper');
			await waitFor(() => {
				expect(nestedWrappers[0].getAttribute('hidden')).toBe('until-found');
			});

			fireEvent(nestedWrappers[0], new Event('beforematch'));

			await waitFor(() => {
				expect(queryByTestId('nested-a-children')).toBeInTheDocument();
			});

			// Opening the outer expand puts the WidthProvider back around its body, which React cannot
			// do without rebuilding what is inside it — nested A is mounted again, on new elements.
			expect(container.querySelectorAll('.nestedExpand-content-wrapper')[0]).not.toBe(
				nestedWrappers[0],
			);
			// It has to come back open regardless, or the reader would watch the outer expand open onto
			// a closed one with the match nowhere to be seen. `revealedByFind` is what carries that.
			expect(getAllByRole('button')[1]).toHaveAttribute('aria-expanded', 'true');
			expect(queryByTestId('nested-a-children')).toBeInTheDocument();
		});
	});

	// A table inside a collapsed expand shows the text of its rows rather than rendering. The rows
	// holding a nested expand keep rendering, so the browser can reveal that expand on its own —
	// standing in for the whole table would take that expand with it.
	describe('tables in a collapsed body', () => {
		const text = (value: string) => ({
			type: 'paragraph',
			content: [{ type: 'text', text: value }],
		});

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const row = (content: any) => ({
			type: 'tableRow',
			content: [{ type: 'tableCell', attrs: {}, content: [content] }],
		});

		const tableNode = () =>
			defaultSchema.nodeFromJSON({
				type: 'table',
				attrs: { isNumberColumnEnabled: false, layout: 'default' },
				content: [
					row(text('plain row one')),
					row({
						type: 'nestedExpand',
						attrs: { title: 'Nested' },
						content: [text('nested row body')],
					}),
					row(text('plain row three')),
				],
			});

		/** The shape the serializer hands over: one element whose children are the rows. */
		const SerializedTable = ({ children }: { children: React.ReactNode }) => (
			<table data-testid="table">
				<tbody>{children}</tbody>
			</table>
		);

		/** A row as the serializer builds it, carrying the `nodeType` the stand-in looks for. */
		const SerializedRow = ({ children }: { children?: React.ReactNode; nodeType: string }) => (
			<tr>{children}</tr>
		);

		/**
		 * A wrapper a product's serializer folds around a node without adding to the DOM, as
		 * Confluence's progressive renderer does to every row but the first.
		 */
		const RowWrapper = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

		const nestedInRow = (node: PMNode) => (
			<td>
				<ExpandWithInt title={'Nested'} nodeType={'nestedExpand'} node={node}>
					<ExpandBodyBlock searchText="nested row body">
						<div data-testid="nested-children">nested children</div>
					</ExpandBodyBlock>
				</ExpandWithInt>
			</td>
		);

		/** Wraps the serialized table the way the serializer does, then renders it in an expand. */
		const renderInExpand = (table: PMNode, serialized: JSX.Element) =>
			renderWithIntl(
				<ExpandWithInt
					title={'Outer'}
					nodeType={'expand'}
					rendererAppearance={'full-page'}
					node={expandNode()}
				>
					{withExpandBodyBlock(table, [expandNode()], 0, serialized)}
				</ExpandWithInt>,
			);

		const rowsOfTable = (table: PMNode) => [
			<SerializedRow key="row-0" nodeType="tableRow">
				<td>plain row one</td>
			</SerializedRow>,
			<SerializedRow key="row-1" nodeType="tableRow">
				{nestedInRow(table.child(1).child(0).child(0))}
			</SerializedRow>,
			<SerializedRow key="row-2" nodeType="tableRow">
				<td>plain row three</td>
			</SerializedRow>,
		];

		const renderOuter = () => {
			const table = tableNode();

			return renderInExpand(table, <SerializedTable>{rowsOfTable(table)}</SerializedTable>);
		};

		it('should show the text of the rows and keep only the row holding the expand', () => {
			const { container, queryByTestId } = renderOuter();

			expect(queryByTestId('table')).not.toBeInTheDocument();
			expect(container.textContent).toContain('plain row one');
			expect(container.textContent).toContain('plain row three');
			// The kept row is real, so the nested expand has a title of its own — and its own body is
			// still standing in for itself.
			expect(container.querySelectorAll('.nestedExpand-content-wrapper')).toHaveLength(1);
			expect(queryByTestId('nested-children')).not.toBeInTheDocument();
			expect(container.textContent).toContain('nested row body');
		});

		// A `<tr>` on its own in the page is invalid markup, and React says so on every render of every
		// deferred table. The row keeps the least table around it that makes it valid.
		it('should keep the row it renders inside a table', () => {
			const { container } = renderOuter();

			const row = container.querySelector('tr');
			expect(row?.parentElement?.tagName).toBe('TBODY');
			expect(row?.parentElement?.parentElement?.tagName).toBe('TABLE');
		});

		// Rendering the table rebuilds the row, and with it the nested expand find had just opened.
		// Coming back closed would leave the reader looking at a table with the match hidden again.
		it('should keep the nested expand open when the table renders around it', async () => {
			const { container, getAllByRole, queryByTestId } = renderOuter();

			const nestedWrapper = container.querySelector('.nestedExpand-content-wrapper');
			await waitFor(() => {
				expect(nestedWrapper?.getAttribute('hidden')).toBe('until-found');
			});

			fireEvent(nestedWrapper as Element, new Event('beforematch'));

			await waitFor(() => {
				expect(queryByTestId('table')).toBeInTheDocument();
			});

			const [outerButton, nestedButton] = getAllByRole('button');
			expect(outerButton).toHaveAttribute('aria-expanded', 'true');
			expect(nestedButton).toHaveAttribute('aria-expanded', 'true');
			expect(queryByTestId('nested-children')).toBeInTheDocument();
		});

		// With no row to keep the table takes the same route as any other block: one string stands in for
		// all of it, and nothing of the table mounts.
		it('should stand in for a table with no expand in it as a whole block', () => {
			const table = defaultSchema.nodeFromJSON({
				type: 'table',
				attrs: { isNumberColumnEnabled: false, layout: 'default' },
				content: [row(text('only row'))],
			});
			const standIn = withExpandBodyBlock(
				table,
				[expandNode()],
				0,
				<SerializedTable>
					<SerializedRow nodeType="tableRow">
						<td>only row</td>
					</SerializedRow>
				</SerializedTable>,
			);

			expect(standIn?.type).toBe(ExpandBodyBlock);
			expect(standIn?.props.searchText).toBe('only row');
		});

		// The rows are not always the children of what the serializer hands over: marks are folded
		// around the node afterwards. A one-row table is the case a row count alone gets wrong, since
		// every wrapper level also has one child.
		it('should find the rows through a wrapper the serializer folded around the table', () => {
			const table = tableNode();
			const { container, queryByTestId } = renderInExpand(
				table,
				<SerializedRow nodeType="fragmentMark">
					<SerializedTable>{rowsOfTable(table)}</SerializedTable>
				</SerializedRow>,
			);

			expect(queryByTestId('table')).not.toBeInTheDocument();
			expect(container.textContent).toContain('plain row one');
			expect(container.querySelectorAll('.nestedExpand-content-wrapper')).toHaveLength(1);
		});

		// The case that reached a real page: Confluence's progressive renderer wraps every row but the
		// first, so nothing about the table element itself looks wrong — the rows are simply a level
		// further in than the table's own children.
		it('should find the rows when each one is wrapped on its own', () => {
			const table = tableNode();
			const wrapped = rowsOfTable(table).map((row) => (
				<RowWrapper key={`wrapped-${row.key}`}>{row}</RowWrapper>
			));

			const { container, queryByTestId } = renderInExpand(
				table,
				<SerializedTable>{wrapped}</SerializedTable>,
			);

			expect(queryByTestId('table')).not.toBeInTheDocument();
			expect(container.textContent).toContain('plain row one');
			expect(container.textContent).toContain('plain row three');
			expect(container.querySelectorAll('.nestedExpand-content-wrapper')).toHaveLength(1);
		});

		// A wrapper with something beside the table in it, which no descent through single-child
		// wrappers can get past.
		it('should find the rows through a wrapper holding more than the table', () => {
			const table = tableNode();
			const { container, queryByTestId } = renderInExpand(
				table,
				<div>
					<span key="beside">something else the serializer put here</span>
					<SerializedTable>{rowsOfTable(table)}</SerializedTable>
				</div>,
			);

			expect(queryByTestId('table')).not.toBeInTheDocument();
			expect(container.textContent).toContain('plain row one');
			expect(container.querySelectorAll('.nestedExpand-content-wrapper')).toHaveLength(1);
		});

		// Nothing bounds how deep a product may bury the table, so nothing here should either.
		it('should find the rows however deeply the table is wrapped', () => {
			const table = tableNode();
			const deep = [1, 2, 3, 4, 5, 6].reduce(
				(inner, level) => <RowWrapper key={`level-${level}`}>{inner}</RowWrapper>,
				(<SerializedTable>{rowsOfTable(table)}</SerializedTable>) as JSX.Element,
			);

			const { container, queryByTestId } = renderInExpand(table, deep);

			expect(queryByTestId('table')).not.toBeInTheDocument();
			expect(container.querySelectorAll('.nestedExpand-content-wrapper')).toHaveLength(1);
		});

		// A nested table's rows are rows too. Counting them among this table's would put the count
		// past its row count and cost the saving.
		it('should not count the rows of a table nested inside one of its own', () => {
			const table = tableNode();
			const rest = rowsOfTable(table).slice(1);
			const firstHoldingATable = (
				<SerializedRow key="row-0" nodeType="tableRow">
					<td>
						<table>
							<tbody>
								<SerializedRow key="inner-0" nodeType="tableRow">
									<td>nested table row one</td>
								</SerializedRow>
								<SerializedRow key="inner-1" nodeType="tableRow">
									<td>nested table row two</td>
								</SerializedRow>
							</tbody>
						</table>
					</td>
				</SerializedRow>
			);

			const { container, queryByTestId } = renderInExpand(
				table,
				<SerializedTable>{[firstHoldingATable, ...rest]}</SerializedTable>,
			);

			expect(queryByTestId('table')).not.toBeInTheDocument();
			expect(container.querySelectorAll('.nestedExpand-content-wrapper')).toHaveLength(1);
		});

		// The table rendering in full is not a fault, only the saving going unclaimed — but it is
		// indistinguishable from the feature being switched off, so it says so.
		it('should render the table and say so when the rows are not found', () => {
			const said = jest.spyOn(console, 'info').mockImplementation(() => {});
			const cloudEnv = process.env.CLOUD_ENV;
			process.env.CLOUD_ENV = 'staging';

			const { queryByTestId } = renderInExpand(
				tableNode(),
				<SerializedTable>
					<td key="not-a-row">a cell where a row was expected</td>
				</SerializedTable>,
			);

			expect(queryByTestId('table')).toBeInTheDocument();
			expect(said).toHaveBeenCalledWith(expect.stringContaining('were not found'));

			process.env.CLOUD_ENV = cloudEnv;
			said.mockRestore();
		});

		// A wrapper a product adds is only ever seen once that product has deployed, so every
		// environment but production says so — and production stays quiet.
		it('should say nothing in production', () => {
			const said = jest.spyOn(console, 'info').mockImplementation(() => {});
			const cloudEnv = process.env.CLOUD_ENV;
			process.env.CLOUD_ENV = 'production';

			renderInExpand(
				tableNode(),
				<SerializedTable>
					<td key="not-a-row">a cell where a row was expected</td>
				</SerializedTable>,
			);

			expect(said).not.toHaveBeenCalled();

			process.env.CLOUD_ENV = cloudEnv;
			said.mockRestore();
		});
	});

	// Text the browser cannot reveal is worse than no saving: find cannot reach it through the CSS
	// that hides collapsed content, so the body would be missing for nothing.
	describe('when the browser cannot reveal hidden="until-found" content', () => {
		beforeEach(() => {
			unsupportHiddenUntilFound();
		});

		afterEach(supportHiddenUntilFound);

		it('should render the body once support is known to be missing', async () => {
			const { container, queryByTestId } = renderWithIntl(
				<ExpandWithInt
					title={'Expand test title'}
					nodeType={'expand'}
					rendererAppearance={'full-page'}
					node={expandNode()}
				>
					<Body />
				</ExpandWithInt>,
			);

			await waitFor(() => {
				expect(queryByTestId('expand-children')).toBeInTheDocument();
			});
			expect(container.textContent).not.toContain(BODY_TEXT);
		});

		it('should still show text on the server, where no browser can be checked', () => {
			const html = renderToString(
				<IntlProvider locale="en">
					<ExpandWithInt
						title={'Expand test title'}
						nodeType={'expand'}
						rendererAppearance={'full-page'}
						node={expandNode()}
					>
						<Body />
					</ExpandWithInt>
				</IntlProvider>,
			);

			expect(html).toContain(BODY_TEXT);
			expect(html).not.toContain('Test children content');
		});
	});

	// Regression: the previous implementation wrapped children in <Suspense><React.lazy>.
	// `renderToString` cannot resolve Suspense, so it emitted an errored boundary (<!--$!-->) and
	// hydration failed with "The server did not finish this Suspense boundary". Confluence still
	// uses renderToString for non-streaming SSR (notably anonymous traffic), so both shapes this
	// component can emit must hydrate cleanly.
	describe('SSR hydration', () => {
		const hydratedContainers: HTMLElement[] = [];

		afterEach(() => {
			// These containers are appended manually, so testing-library's cleanup does not own them.
			hydratedContainers.splice(0).forEach((container) => container.remove());
			supportHiddenUntilFound();
		});

		const hydrateSSROutput = async (tree: React.ReactElement) => {
			const container = document.createElement('div');
			container.innerHTML = renderToString(tree);
			document.body.appendChild(container);
			hydratedContainers.push(container);

			const onRecoverableError = jest.fn();
			await act(async () => {
				hydrateRoot(container, tree, { onRecoverableError });
			});

			return { container, onRecoverableError };
		};

		const wrap = (withNode: boolean) => (
			<IntlProvider locale="en">
				<ExpandWithInt
					title={'Expand test title'}
					nodeType={'expand'}
					rendererAppearance={'full-page'}
					node={withNode ? expandNode() : undefined}
				>
					<Body />
				</ExpandWithInt>
			</IntlProvider>
		);

		it('should hydrate without a recoverable error while showing the body text', async () => {
			const { container, onRecoverableError } = await hydrateSSROutput(wrap(true));

			expect(onRecoverableError).not.toHaveBeenCalled();
			expect(container.textContent).toContain(BODY_TEXT);
			expect(container.querySelector('[data-testid="expand-children"]')).toBeNull();
		});

		// The server always shows the text, so a browser without support renders the body during
		// hydration. That has to be a render after hydration, not a mismatch against the server HTML.
		it('should hydrate without a recoverable error when the body replaces its text', async () => {
			unsupportHiddenUntilFound();

			const { container, onRecoverableError } = await hydrateSSROutput(wrap(true));

			expect(onRecoverableError).not.toHaveBeenCalled();
			expect(container.querySelector('[data-testid="expand-children"]')).not.toBeNull();
			expect(container.textContent).not.toContain(BODY_TEXT);
		});

		it('should hydrate without a recoverable error when the body is always rendered', async () => {
			const { container, onRecoverableError } = await hydrateSSROutput(wrap(false));

			expect(onRecoverableError).not.toHaveBeenCalled();
			expect(container.querySelector('[data-testid="expand-children"]')).not.toBeNull();
		});

		it('should server-render the body content when no node is supplied', () => {
			// Inline-comment navigation depends on the body HTML being present in the SSR output,
			// not just after hydration.
			const html = renderToString(wrap(false));

			expect(html).toContain('Test children content');
			// An errored Suspense boundary marker; must never appear.
			expect(html).not.toContain('<!--$!-->');
		});
	});
});
