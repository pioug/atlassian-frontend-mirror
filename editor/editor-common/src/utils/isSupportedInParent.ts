import type { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { CardAppearance } from '@atlaskit/smart-card';

/**
 * Checks if a particular node fragment is supported in the parent
 * @param state EditorState
 * @param fragment The fragment to be checked for
 */
export const isSupportedInParent = (
	state: EditorState,
	fragment: Fragment,
	currentAppearance?: CardAppearance,
): boolean => {
	const depth = currentAppearance === 'embed' || currentAppearance === 'block' ? undefined : -1;
	const parent = state.selection.$from.node(depth);
	return parent && parent.type.validContent(fragment);
};
