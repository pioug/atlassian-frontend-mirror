import { isListItemNode } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

export function isListNodeValidContent(node: PMNode) {
	const { bulletList } = node.type.schema.nodes;
	if (!bulletList) {
		return false;
	}

	const listFragment = Fragment.from(bulletList.createAndFill());

	return !isListItemNode(node) && node.type.validContent(listFragment);
}
