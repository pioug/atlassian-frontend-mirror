import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';

export function inSameTable($a: ResolvedPos, $b: ResolvedPos): boolean {
	return $a.depth === $b.depth && $a.pos >= $b.start(-1) && $a.pos <= $b.end(-1);
}
