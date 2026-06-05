import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';

export function endPositionOfParent(resolvedPos: ResolvedPos): number {
	return resolvedPos.end(resolvedPos.depth) + 1;
}
