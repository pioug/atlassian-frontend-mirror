import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { findChildrenByMark } from '@atlaskit/editor-prosemirror/utils';

/**
 * Minimal structural view of an ADF entity. `parameters.nestedContent` holds raw ADF JSON rather
 * than ProseMirror nodes, so it cannot be walked with the model API.
 */
type AdfEntity = {
	attrs?: {
		[key: string]: unknown;
		parameters?: { nestedContent?: AdfEntity };
		text?: unknown;
	};
	content?: AdfEntity[];
	text?: string;
	type?: string;
};

/** Separates text from adjacent blocks so phrases cannot fuse across block boundaries. */
export const BLOCK_SEPARATOR = ' ';

const asText = (value: unknown): string => (typeof value === 'string' ? value : '');

const nestedContentOf = (attrs: AdfEntity['attrs']): AdfEntity | undefined =>
	attrs?.parameters?.nestedContent;

export const isExpandNode = (node: PMNode): boolean =>
	node.type.name === 'expand' || node.type.name === 'nestedExpand';

/**
 * Reads the text out of raw ADF JSON.
 *
 * Some extensions keep a whole ADF subtree in `attrs.parameters.nestedContent` rather than in their
 * node content. Confluence does this when the authored nesting is deeper than the schema allows —
 * an expand more than two collapsible layers deep, for example. To ProseMirror the extension is a
 * leaf, so walking the node tree never sees that subtree, even though a nested renderer puts it on
 * the page. Recurses, because stashed content often stashes more content of its own.
 */
const adfEntityText = (entity: AdfEntity | undefined): string => {
	if (!entity) {
		return '';
	}

	const parts: string[] = [];

	if (entity.type === 'text') {
		parts.push(asText(entity.text));
	}

	const nestedContent = nestedContentOf(entity.attrs);
	if (nestedContent) {
		// Prefer the real subtree over `attrs.text`, which is only a placeholder label for it.
		parts.push(adfEntityText(nestedContent));
	} else {
		parts.push(asText(entity.attrs?.text));
	}

	entity.content?.forEach((child) => parts.push(adfEntityText(child)));

	return parts.filter(Boolean).join(BLOCK_SEPARATOR);
};

/**
 * `textBetween` skips every leaf node unless its spec declares `leafText`, and no ADF node
 * does — so mentions, emoji, dates and statuses would all be lost. They keep their visible
 * text in attrs, so read it from there.
 */
const leafText = (leaf: PMNode): string => {
	const nestedContent = nestedContentOf(leaf.attrs as AdfEntity['attrs']);
	if (nestedContent) {
		return adfEntityText(nestedContent);
	}
	return asText(leaf.attrs?.text);
};

const isRevealable = (node: PMNode): boolean =>
	isExpandNode(node) || Boolean(nestedContentOf(node.attrs as AdfEntity['attrs']));

const revealableCache = new WeakMap<PMNode, boolean>();

/**
 * Whether this block holds something that can be opened on its own: an expand, or an extension
 * holding stashed ADF that a nested renderer will mount expands from.
 *
 * Those need a real element even while the expand around them is collapsed. The element is how we
 * know find matched inside them rather than higher up: the beforematch event says nothing about
 * where the match was, so the element the browser chose to reveal is the only clue.
 */
export const holdsRevealableContent = (node: PMNode): boolean => {
	const cached = revealableCache.get(node);
	if (cached !== undefined) {
		return cached;
	}

	let found = isRevealable(node);
	if (!found) {
		node.descendants((descendant) => {
			if (found) {
				return false;
			}
			found = isRevealable(descendant);
			return !found;
		});
	}

	revealableCache.set(node, found);
	return found;
};

const hasInlineComment = (node: PMNode): boolean =>
	findChildrenByMark(node, node.type.schema.marks.annotation, true).some((annotation) =>
		annotation.node.marks.some((mark) => mark.attrs.annotationType === 'inlineComment'),
	);

/** `null` is a cached "no search text for this node", as distinct from `undefined` for a miss. */
const searchTextCache = new WeakMap<PMNode, string | null>();

/**
 * The text shown in place of one block of a collapsed expand's body, so browser find can still
 * reach the content without the block being rendered.
 *
 * Cached on the node. ProseMirror nodes never change, and the serializer reuses the same instances
 * across renders, so the text only has to be worked out once per block.
 *
 * @returns the text, or `undefined` if this block has to be rendered instead.
 */
export const getBlockSearchText = (node: PMNode): string | undefined => {
	let cached = searchTextCache.get(node);

	if (cached === undefined) {
		cached = hasInlineComment(node)
			? // No text, which makes the block render instead. Comment navigation looks through the DOM
				// for the commented text and scrolls to it, so that text has to be a real element —
				// plain text carries no comment marks and cannot stand in for it. Without this, the
				// arrow keys silently skip every comment inside a collapsed expand. We give up the
				// saving for this block on purpose.
				null
			: // A leaf block is not inside its own range, so `textBetween` would return nothing and its
				// text would be lost — a macro sitting straight in an expand body, for instance.
				node.isLeaf
				? leafText(node)
				: node.textBetween(0, node.content.size, BLOCK_SEPARATOR, leafText);
		searchTextCache.set(node, cached);
	}

	return cached ?? undefined;
};

/**
 * One piece of what a collapsed table shows: either the text of the rows being stood in for, or the
 * index of a row that has to keep rendering.
 */
export type TableStandInPart = string | number;

const tableStandInCache = new WeakMap<PMNode, TableStandInPart[]>();

/**
 * What a table inside a collapsed expand shows in place of rendering, in table order so that find
 * walks it the way the reader reads it.
 *
 * A row keeps rendering when it holds an expand of its own, which needs a real element for browser
 * find to reveal, or when its text carries an inline comment. Its text is left out of the runs
 * either side of it, since the row itself puts that text in the DOM.
 */
export const getTableStandInParts = (table: PMNode): TableStandInPart[] => {
	const cached = tableStandInCache.get(table);
	if (cached !== undefined) {
		return cached;
	}

	const parts: TableStandInPart[] = [];

	table.forEach((row, _offset, index) => {
		const text = holdsRevealableContent(row) ? undefined : getBlockSearchText(row);

		if (text === undefined) {
			parts.push(index);
			return;
		}

		const last = parts[parts.length - 1];
		if (typeof last === 'string') {
			parts[parts.length - 1] = `${last}${BLOCK_SEPARATOR}${text}`;
			return;
		}

		parts.push(text);
	});

	tableStandInCache.set(table, parts);
	return parts;
};
