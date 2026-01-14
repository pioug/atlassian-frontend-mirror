import { type Fragment, type Node } from '@atlaskit/editor-prosemirror/model';

/**
 * Get all text between positions `from` and `to` with a newline char between block nodes.
 */
export const getNodeText = (node: Node, from: number, to: number): string => {
	return getFragmentText(node.content, from, to);
};

/**
 * Get all text between positions `from` and `to` with a newline char between block nodes.
 */
export const getFragmentText = (fragment: Fragment, from: number, to: number): string => {
	return textBetween(fragment, from, to, '\n');
};

/**
 * A modified version of {@link Fragment#textBetween}. The default implementation does not insert `blockSeparator` for
 * consecutive empty block nodes (i.e. empty blocks are collapsed into one).
 */
const textBetween = (
	fragment: Fragment,
	from: number,
	to: number,
	blockSeparator?: string,
	leafText?: string,
) => {
	let text = '';
	let enteredInitialBlock = false;
	fragment.nodesBetween(
		from,
		to,
		(innerNode, pos) => {
			if (innerNode.isText) {
				text += innerNode.text?.slice(Math.max(from, pos) - pos, to - pos);
			} else if (innerNode.isLeaf && leafText) {
				text += leafText;
			} else if (innerNode.isBlock) {
				if (enteredInitialBlock) {
					text += blockSeparator;
				} else {
					enteredInitialBlock = true;
				}
			}
		},
		0,
	);
	return text;
};
