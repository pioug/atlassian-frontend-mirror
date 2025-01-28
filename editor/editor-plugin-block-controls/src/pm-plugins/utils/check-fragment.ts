import { Fragment } from '@atlaskit/editor-prosemirror/model';

/**
 * Check if the fragment has only one node of the specified type
 */
export const isFragmentOfType = (fragment: Fragment, type: string) =>
	fragment.childCount === 1 && fragment.firstChild?.type.name === type;

/**
 * Check if the fragment contains at least a node of the specified type
 */
export const containsNodeOfType = (fragment: Fragment, type: string) => {
	for (let i = 0; i < fragment.childCount; i++) {
		const child = fragment.child(i);

		if (child.type.name === type) {
			return true;
		}
	}
	return false;
};
