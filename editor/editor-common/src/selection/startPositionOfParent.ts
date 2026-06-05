import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';

export function startPositionOfParent(resolvedPos: ResolvedPos): number {
	return resolvedPos.start(resolvedPos.depth);
}
