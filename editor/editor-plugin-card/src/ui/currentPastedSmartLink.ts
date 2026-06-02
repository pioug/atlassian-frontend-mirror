import type { Fragment, Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';

const getUrlFromTextLinkNode = (node: PMNode): string | undefined => {
	if (!node.isText || node.marks.length !== 1 || node.marks[0].type.name !== 'link') {
		return undefined;
	}
	const href = node.marks[0].attrs?.href;
	return typeof href === 'string' && node.text === href ? href : undefined;
};

const getUrlFromInlineCardNode = (node: PMNode): string | undefined => {
	if (node.type.name !== 'inlineCard') {
		return undefined;
	}
	const url = node.attrs?.url;
	return typeof url === 'string' ? url : undefined;
};

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

export const getSingleSmartLinkUrlFromSlice = (slice: Slice | undefined): string | undefined => {
	if (!slice || slice.content.childCount !== 1) {
		return undefined;
	}

	const topNode = slice.content.child(0);
	const topNodeUrl = getUrlFromTextLinkNode(topNode) ?? getUrlFromInlineCardNode(topNode);
	if (topNodeUrl) {
		return topNodeUrl;
	}

	if (topNode.type.name !== 'paragraph') {
		return undefined;
	}

	const children = significantChildren(topNode.content);
	if (children.length !== 1) {
		return undefined;
	}

	return getUrlFromTextLinkNode(children[0]) ?? getUrlFromInlineCardNode(children[0]);
};
