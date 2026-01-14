import type { Node as PMNode, Schema, Slice } from '@atlaskit/editor-prosemirror/model';

export function isPastedFromFabricEditor(pastedFrom: string): boolean {
	return pastedFrom === 'fabric-editor';
}

// @see https://product-fabric.atlassian.net/browse/ED-3159
// @see https://github.com/markdown-it/markdown-it/issues/38
export function escapeLinks(text: string): string {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	return text.replace(/(\[([^\]]+)\]\()?((https?|ftp|jamfselfservice):\/\/[^\s"'>]+)/g, (str) => {
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		return str.match(/^(https?|ftp|jamfselfservice):\/\/[^\s"'>]+$/) ? `<${str}>` : str;
	});
}

export const hasMediaNode = (slice: Slice | undefined): boolean => {
	if (!slice) {
		return false;
	}

	let hasMedia = false;
	slice.content.descendants((node: PMNode) => {
		if (['media', 'mediaInline', 'mediaGroup', 'mediaSingle'].includes(node.type.name)) {
			hasMedia = true;
			return false;
		}
		return true;
	});

	return hasMedia;
};

export const hasRuleNode = (slice: Slice, schema: Schema): boolean => {
	let hasRuleNode = false;
	slice.content.nodesBetween(0, slice.content.size, (node, start) => {
		if (node.type === schema.nodes.rule) {
			hasRuleNode = true;
		}
	});

	return hasRuleNode;
};

export const hasLinkMark = (slice: Slice): boolean => {
	let hasLinkMark = false;
	slice.content.descendants((node: PMNode) => {
		const marks = node.marks?.map((mark) => mark.type.name);
		hasLinkMark = marks?.includes('link');
		if (hasLinkMark) {
			//break out of loop
			return false;
		}
	});

	return hasLinkMark;
};
