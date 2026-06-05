import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';

// Checks to see if the parent node is the document, ie not contained within another entity
export function hasDocAsParent($anchor: ResolvedPos): boolean {
	return $anchor.depth === 1;
}
