import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type NodeEncoder } from '..';
import { unknown } from './unknown';
import { INLINE_CARD_FROM_TEXT_STAMP } from '../../parser/tokenize/issue-key';

export const inlineCard: NodeEncoder = (node: PMNode): string => {
	if (!node.attrs.url) {
		return unknown(node);
	}

	const match = node.attrs.url.match(INLINE_CARD_FROM_TEXT_STAMP);
	if (!match) {
		return `[${node.attrs.url}|${node.attrs.url}|smart-link]`;
	}

	return `[${match[2]}]`;
};
