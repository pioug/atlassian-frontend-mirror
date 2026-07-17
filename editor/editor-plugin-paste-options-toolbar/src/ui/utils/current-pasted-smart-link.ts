import type { Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';

import { isNotSingleLink } from './paste-menu-rules/isNotSingleLink';

const getUrlFromTextLinkNode = (node: PMNode): string | undefined => {
	if (!node.isText || node.marks.length !== 1 || node.marks[0].type.name !== 'link') {
		return undefined;
	}
	const href = node.marks[0].attrs?.href;
	return typeof href === 'string' && node.text === href ? href : undefined;
};

const getUrlFromCardNode = (node: PMNode): string | undefined => {
	if (
		node.type.name !== 'inlineCard' &&
		node.type.name !== 'blockCard' &&
		node.type.name !== 'embedCard'
	) {
		return undefined;
	}
	const url = node.attrs?.url ?? node.attrs?.data?.url;
	return typeof url === 'string' ? url : undefined;
};

const significantChildren = (node: PMNode): PMNode[] => {
	const children: PMNode[] = [];
	node.content.forEach((child) => {
		if (child.isText && child.text?.trim() === '') {
			return;
		}
		children.push(child);
	});
	return children;
};

export const getSingleSmartLinkUrlFromSlice = (slice: Slice | undefined): string | undefined => {
	if (!slice || isNotSingleLink(slice)) {
		return undefined;
	}

	if (slice.content.childCount !== 1) {
		return undefined;
	}

	const topNode = slice.content.child(0);
	const topNodeUrl = getUrlFromTextLinkNode(topNode) ?? getUrlFromCardNode(topNode);
	if (topNodeUrl) {
		return topNodeUrl;
	}

	if (topNode.type.name !== 'paragraph') {
		return undefined;
	}

	const children = significantChildren(topNode);
	if (children.length !== 1) {
		return undefined;
	}

	return getUrlFromTextLinkNode(children[0]) ?? getUrlFromCardNode(children[0]);
};
