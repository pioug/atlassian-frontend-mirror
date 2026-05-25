import type { Fragment, Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';

/**
 * Returns true if the given text node's sole mark is a `link` mark whose href
 * matches the node's text content exactly (i.e. the link label IS the URL).
 */
const isUrlOnlyLinkTextNode = (node: PMNode): boolean => {
	if (!node.isText) {
		return false;
	}
	if (node.marks.length !== 1 || node.marks[0].type.name !== 'link') {
		return false;
	}
	const href: string = node.marks[0].attrs?.href ?? '';
	return node.text === href;
};

/**
 * Returns true if the slice represents a single inline card (smartlink) node.
 * Handles two shapes:
 *  - paragraph > inlineCard  (smartlink from editor/renderer, wrapped in a paragraph)
 *  - inlineCard              (top-level inlineCard with no paragraph wrapper)
 */
const isSingleInlineCard = (slice: Slice): boolean => {
	if (slice.content.childCount !== 1) {
		return false;
	}
	const topNode = slice.content.child(0);

	// Top-level inlineCard (no paragraph wrapper)
	if (topNode.type.name === 'inlineCard') {
		return true;
	}

	// paragraph > inlineCard
	if (topNode.type.name !== 'paragraph') {
		return false;
	}
	if (topNode.childCount !== 1) {
		return false;
	}
	return topNode.child(0).type.name === 'inlineCard';
};

/**
 * Returns the children of a Fragment, filtering out whitespace-only text nodes.
 * This handles trailing/leading spaces that browsers sometimes include when
 * copying a link (e.g. `<a href="...">URL</a> `).
 */
const significantChildren = (fragment: Fragment): PMNode[] => {
	const children: PMNode[] = [];
	fragment.forEach((child) => {
		if (child.isText && child.text?.trim() === '') {
			return;
		}
		children.push(child);
	});
	return children;
};

/**
 * Returns true if the slice represents a single bare link with no label.
 * Handles two shapes:
 *  - paragraph > text(link mark)  (standard rich-text paste, wrapped in a paragraph)
 *  - text(link mark)              (top-level text node with no paragraph wrapper)
 * Whitespace-only sibling text nodes are ignored in both cases.
 */
const isSingleBareLink = (slice: Slice): boolean => {
	// Top-level text node with a link mark (no paragraph wrapper)
	const significantTopChildren = significantChildren(slice.content);
	if (significantTopChildren.length === 1 && isUrlOnlyLinkTextNode(significantTopChildren[0])) {
		return true;
	}

	// paragraph > text(link mark)
	if (slice.content.childCount !== 1) {
		return false;
	}
	const topNode = slice.content.child(0);
	if (topNode.type.name !== 'paragraph') {
		return false;
	}
	const children = significantChildren(topNode.content);
	if (children.length !== 1) {
		return false;
	}
	return isUrlOnlyLinkTextNode(children[0]);
};

/**
 * Returns `true` when the pasted content is NOT a single standalone link.
 *
 * A paste is considered a "single link" (returns `false`) when:
 *  - The slice contains exactly one paragraph with one text node whose text
 *    equals its `link` mark href (bare URL link, no custom label), OR
 *  - The slice contains exactly one paragraph with a single `inlineCard` node
 *    (smartlink from the renderer or editor).
 *
 * Returns `true` (not a single link) when:
 *  - The pasted link has a custom label (text ≠ href)
 *  - There are multiple paragraphs or sibling nodes
 *  - There is additional text alongside the link in the same paragraph
 *  - The slice is absent (plain-text paste)
 */
export const isNotSingleLink = (slice: Slice | undefined): boolean => {
	if (!slice || !slice.content.size) {
		// No rich-text slice → plain text paste, not a single link in the relevant sense
		return true;
	}

	return !isSingleBareLink(slice) && !isSingleInlineCard(slice);
};
