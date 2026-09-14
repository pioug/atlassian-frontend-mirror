import type { Fragment } from '@atlaskit/editor-prosemirror/model';

import { isWhitespaceChar } from './charsByOffset';

/**
 * Whether `fragment` holds anything a reader can see.
 *
 * Text counts once it carries a single non-whitespace character; a leaf node (mention, emoji, date,
 * media, rule, hardBreak, …) counts in its own right, exactly as `resolveTagAnchorPos` treats one.
 * Everything else is descended into, so a paragraph is visible when its content is.
 *
 * A change whose content is nothing but whitespace — a space typed between two words, a run of
 * trailing spaces, an added blank paragraph — has no visible content for a contributor tag to
 * caption, so it carries no tag (EDITOR-8855).
 */
export const hasVisibleContent = (fragment: Fragment): boolean => {
	let visible = false;

	fragment.forEach((node) => {
		if (visible) {
			return;
		}

		if (node.isText) {
			visible = [...(node.text ?? '')].some((char) => !isWhitespaceChar(char));
			return;
		}

		visible = node.isLeaf || hasVisibleContent(node.content);
	});

	return visible;
};
