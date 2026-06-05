import type { Fragment, Node } from '@atlaskit/editor-prosemirror/model';

/**
 * A helper to get the underlying array of a fragment.
 */
export function getFragmentBackingArray(fragment: Fragment): ReadonlyArray<Node> {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (fragment as any).content as Node[];
}
