import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';

import { TableMap } from '../table-map';
import type { Axis } from '../types';

export function nextCell($pos: ResolvedPos, axis: Axis, dir: number): ResolvedPos | null {
	const start = $pos.start(-1);
	const map = TableMap.get($pos.node(-1));
	const moved = map.nextCell($pos.pos - start, axis, dir);
	return moved == null ? null : $pos.node(0).resolve(start + moved);
}
