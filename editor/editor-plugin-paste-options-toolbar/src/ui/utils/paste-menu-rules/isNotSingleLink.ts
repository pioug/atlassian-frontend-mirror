import type { Fragment, Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';

/**
 * Returns true if the given text node's sole mark is a `link` mark whose href
 * matches the node's text content exactly (i.e. the link label IS the URL).
 * Or if the text content is a parseable URL.
 */
const isUrlOnlyLinkTextNode = (node: PMNode): boolean => {
	if (!node.isText) {
		return false;
	}
	if (node.marks.length !== 1 || node.marks[0].type.name !== 'link') {
		return false;
	}
	const href: string = node.marks[0].attrs?.href ?? '';

	// Check if the text content is a URL
	const textOfNode = node.text ?? '';

	const parseableUrl = isParseableUrl(textOfNode);

	return node.text === href || parseableUrl;
};

/**
 * Checks if a given string is parseable as a URL.
 */
const isParseableUrl = (text: string): boolean => {
	if (typeof URL?.canParse === 'function') {
		return URL.canParse(text);
	}

	// Fallback for older environments
	try {
		new URL(text);
		return true;
	} catch (e) {
		return false;
	}
};

const isSupportedCard = (node: PMNode): boolean =>
	node.type.name === 'inlineCard' || node.type.name === 'blockCard';

const transparentSingleChildContainerNodeTypes = new Set([
	'paragraph',
	'listItem',
	'bulletList',
	'orderedList',
]);

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
 * Returns true when the fragment contains exactly one meaningful leaf that
 * satisfies `isSupportedLeaf`.
 *
 * Transparent single-child containers (paragraph, listItem, bulletList, and
 * orderedList) are traversed recursively. Whitespace-only sibling text nodes
 * are ignored at each level.
 */
const containsExactlyOneMeaningfulLeaf = (
	fragment: Fragment,
	isSupportedLeaf: (node: PMNode) => boolean,
): boolean => {
	const children = significantChildren(fragment);
	if (children.length !== 1) {
		return false;
	}

	const [child] = children;
	if (isSupportedLeaf(child)) {
		return true;
	}

	if (!transparentSingleChildContainerNodeTypes.has(child.type.name)) {
		return false;
	}

	return containsExactlyOneMeaningfulLeaf(child.content, isSupportedLeaf);
};

const isSingleSmartLinkCard = (slice: Slice): boolean =>
	containsExactlyOneMeaningfulLeaf(slice.content, isSupportedCard);

const isSingleBareLink = (slice: Slice): boolean =>
	containsExactlyOneMeaningfulLeaf(slice.content, isUrlOnlyLinkTextNode);

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

	return !isSingleBareLink(slice) && !isSingleSmartLinkCard(slice);
};
