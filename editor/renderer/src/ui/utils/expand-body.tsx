import React, { createContext, isValidElement, useContext } from 'react';
import type { Provider, ReactNode } from 'react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import {
	BLOCK_SEPARATOR,
	getBlockSearchText,
	getTableStandInParts,
	holdsRevealableContent,
	isExpandNode,
} from './expand-search-text';

type ExpandBody = {
	/**
	 * Opens this expand, then asks the expand above it to do the same.
	 *
	 * Browser find reveals the element holding the text it matched, and that element belongs to the
	 * expand the text is really in — even a deeply nested one, because an expand only ever replaces
	 * its own blocks with text, never a nested expand. So the expands to open are just that expand's
	 * ancestors.
	 */
	openWithAncestors: () => void;
	/**
	 * True once this expand has been opened. While it is false, the blocks of the body show
	 * their text instead of rendering.
	 *
	 * Each block reads this and decides for itself. The expand does not swap its body out,
	 * because that would throw away and rebuild everything inside it — including a nested
	 * expand find had just opened, and any nested renderer that had already loaded.
	 */
	revealed: boolean;
	/**
	 * The expands browser find has opened. One set is shared by a whole chain of expands.
	 *
	 * A table standing in for itself does swap out what it renders, and a nested expand in one of its
	 * rows is rebuilt when it does. This is how that expand knows to come back open rather than
	 * closed over the match the reader was just taken to.
	 */
	revealedByFind: WeakSet<PMNode>;
};

const ExpandBodyContext = createContext<ExpandBody | null>(null);

export const ExpandBodyProvider: Provider<ExpandBody | null> = ExpandBodyContext.Provider;

export const useExpandBody = (): ExpandBody | null => useContext(ExpandBodyContext);

type ExpandBodyBlockProps = {
	children: ReactNode;
	/** The block's text, or `undefined` if it must always be rendered. */
	searchText?: string;
};

/**
 * One or more neighbouring blocks of an expand's body. Shows their text until the expand is
 * opened, then renders them. Falls back to rendering if there is no text, or if there is no
 * expand above it.
 *
 * The text is rendered as-is, with no element around it. Nothing reads it but browser find,
 * which only needs the characters to be in the DOM.
 */
export const ExpandBodyBlock = ({ children, searchText }: ExpandBodyBlockProps): ReactNode => {
	const body = useExpandBody();

	if (searchText === undefined || body === null || body.revealed) {
		return <>{children}</>;
	}

	return searchText;
};

/**
 * Called for every node the serializer renders. If the node is a block of an expand's body,
 * wraps it so it can show its text instead of rendering while that expand is collapsed.
 * Everything else is returned untouched.
 *
 * A block holding an expand of its own is returned untouched, because standing in for the whole
 * block would take that expand with it, and the expand needs an element of its own: the element
 * browser find reveals is the only way we learn the match was inside it rather than higher up. A
 * table is handed to `ExpandBodyTable`, which stands in for its own rows and keeps only the rows
 * that hold an expand. Everything else — a panel, a list, an extension with stashed ADF — renders
 * in full, so the reader searches once instead of once per level.
 *
 * `ancestors` is the node's ancestor chain, nearest last.
 */
export const withExpandBodyBlock = (
	node: PMNode,
	ancestors: readonly PMNode[],
	index: number,
	serialized: JSX.Element | null,
): JSX.Element | null => {
	const parent = ancestors[ancestors.length - 1];
	if (!parent || !isExpandNode(parent)) {
		return serialized;
	}

	if (!isExperimentEnabled('platform_editor_defer_collapsed_expand_body')) {
		return serialized;
	}

	// `serialized` is only null for a node the renderer has no component for, which a table is not.
	// Such a table falls through to the paths below, which do not reach into it.
	if (node.type.name === 'table' && serialized !== null) {
		const parts = getTableStandInParts(node);

		// With no row to keep, one string can stand in for the whole table — the table then renders
		// nothing at all, and its text joins with the blocks either side of it.
		return parts.every((part) => typeof part === 'string') ? (
			<ExpandBodyBlock key={`expand-body-block-${index}`} searchText={parts.join('')}>
				{serialized}
			</ExpandBodyBlock>
		) : (
			<ExpandBodyTable key={`expand-body-table-${index}`} node={node}>
				{serialized}
			</ExpandBodyTable>
		);
	}

	if (holdsRevealableContent(node)) {
		return serialized;
	}

	const searchText = getBlockSearchText(node);
	if (searchText === undefined) {
		return serialized;
	}

	return (
		<ExpandBodyBlock key={`expand-body-block-${index}`} searchText={searchText}>
			{serialized}
		</ExpandBodyBlock>
	);
};

type ExpandBodyTableProps = {
	/** The serialized table, as `serializeFragmentChild` returned it. */
	children: JSX.Element;
	node: PMNode;
};

const isRow = (child: ReactNode): boolean =>
	isValidElement(child) && (child.props as { nodeType?: string }).nodeType === 'tableRow';

/**
 * The rows inside the serialized table, wherever they sit.
 *
 * What the serializer hands over is not reliably the element whose children are the rows. Marks are
 * folded around the node afterwards, and a product's own serializer may wrap the rows themselves —
 * Confluence's progressive renderer wraps every row but the first. Assuming either a depth or a set
 * of direct children means any wrapper added later silently costs the saving, so the rows are found
 * instead by the `nodeType` the serializer puts on every node.
 *
 * Descent stops at each row: a nested table's rows sit inside a row of this one, and would
 * otherwise be counted among them.
 *
 * The count is only a consistency check. `getTableStandInParts` indexes the rows by position, so a
 * partial match cannot be lined up and the table has to render instead.
 */
const rowsOf = (serialized: ReactNode, rowCount: number): ReactNode[] | undefined => {
	const rows: ReactNode[] = [];

	const collect = (node: ReactNode): void => {
		React.Children.toArray(node).forEach((child) => {
			if (!isValidElement(child)) {
				return;
			}
			if (isRow(child)) {
				rows.push(child);
				return;
			}
			collect((child.props as { children?: ReactNode }).children);
		});
	};

	collect(serialized);

	return rows.length === rowCount ? rows : undefined;
};

/**
 * A table in the body of a collapsed expand. Shows the text of its rows until the expand is opened,
 * keeping the rows that hold an expand of their own — those need an element for find to reveal.
 *
 * Standing in for the whole table, the way an ordinary block does, would take that expand with it.
 */
export const ExpandBodyTable = ({ children, node }: ExpandBodyTableProps): ReactNode => {
	const body = useExpandBody();

	if (body === null || body.revealed) {
		return children;
	}

	const rows = rowsOf(children, node.childCount);
	if (!rows) {
		// Nothing is wrong: the table renders as it always did, only without the saving. Still worth
		// saying, because a silent fallback looks exactly like the feature being switched off.
		// Every environment but production says it: a wrapper added by a product is only ever seen
		// once that product has deployed, which a `NODE_ENV` check never reaches.
		if (process.env.CLOUD_ENV !== 'production') {
			// eslint-disable-next-line no-console
			console.info(
				'@atlaskit/renderer: the rows of a table in a collapsed expand were not found, so the table renders in full rather than showing their text',
			);
		}
		return children;
	}

	return getTableStandInParts(node).map((part) =>
		typeof part === 'string' ? (
			part
		) : (
			// A row cannot stand in the page on its own — `<tr>` is only valid inside a table — so it
			// keeps the least table around it that makes the markup valid. None of this is laid out: the
			// body is hidden until the reader or find opens the expand, and opening it renders the real
			// table in place of all this.
			<table key={`expand-body-row-${part}`}>
				<tbody>{rows[part]}</tbody>
			</table>
		),
	);
};

/** Whatever the serializer produced for one child: an element, a string, an array of either. */
type SerializedChild = ReactNode;

const searchTextOf = (child: SerializedChild): string | undefined =>
	isValidElement(child) && child.type === ExpandBodyBlock
		? (child.props as ExpandBodyBlockProps).searchText
		: undefined;

/**
 * Joins neighbouring blocks that are showing text into one, so a run of them is a single string in
 * the DOM rather than one per block. A body of twenty paragraphs becomes one text node instead of
 * twenty.
 *
 * A block that is being rendered — a nested expand, say — ends the run, because the text either
 * side of it has to stay either side of it.
 */
export const mergeExpandBodyText = (children: SerializedChild[]): SerializedChild[] => {
	// Called for every fragment in the document, and only an expand's body has anything to merge, so
	// leave the array alone unless two neighbours are actually showing text.
	const hasRun = children.some(
		(child, index) =>
			index > 0 &&
			searchTextOf(child) !== undefined &&
			searchTextOf(children[index - 1]) !== undefined,
	);
	if (!hasRun) {
		return children;
	}

	const merged: SerializedChild[] = [];
	let run: SerializedChild[] = [];

	const endRun = () => {
		if (run.length === 0) {
			return;
		}

		if (run.length === 1) {
			merged.push(run[0]);
		} else {
			const text = run.map(searchTextOf).filter(Boolean).join(BLOCK_SEPARATOR);
			// The blocks themselves, not the wrappers around them: nesting the wrappers would show
			// each block's text again inside the joined run.
			const blocks = run.map((child) => (child as JSX.Element).props.children);

			merged.push(
				<ExpandBodyBlock key={(run[0] as JSX.Element).key ?? undefined} searchText={text}>
					{blocks}
				</ExpandBodyBlock>,
			);
		}

		run = [];
	};

	children.forEach((child) => {
		if (searchTextOf(child) === undefined) {
			endRun();
			merged.push(child);
			return;
		}
		run.push(child);
	});
	endRun();

	return merged;
};
