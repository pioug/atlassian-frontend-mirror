import { ResolvedPos } from 'prosemirror-model';

import { TableMap } from '../table-map';
import { Axis } from '../types';

export function pointsAtCell($pos: ResolvedPos) {
  return $pos.parent.type.spec.tableRole === 'row' && $pos.nodeAfter;
}

export function cellNear($pos: ResolvedPos): ResolvedPos | null {
  for (
    let after = $pos.nodeAfter, { pos } = $pos;
    after;
    after = after.firstChild, pos++
  ) {
    const role = after.type.spec.tableRole;
    if (role === 'cell' || role === 'header_cell') {
      return $pos.doc.resolve(pos);
    }
  }
  for (
    let before = $pos.nodeBefore, { pos } = $pos;
    before;
    before = before.lastChild, pos--
  ) {
    const role = before.type.spec.tableRole;
    if (role === 'cell' || role === 'header_cell') {
      return $pos.doc.resolve(pos - before.nodeSize);
    }
  }

  return null;
}

export function cellAround($pos: ResolvedPos): ResolvedPos | null {
  for (let d = $pos.depth - 1; d > 0; d--) {
    if ($pos.node(d).type.spec.tableRole === 'row') {
      return $pos.node(0).resolve($pos.before(d + 1));
    }
  }
  return null;
}

export function nextCell(
  $pos: ResolvedPos,
  axis: Axis,
  dir: number,
): ResolvedPos | null {
  const start = $pos.start(-1);
  const map = TableMap.get($pos.node(-1));
  const moved = map.nextCell($pos.pos - start, axis, dir);
  return moved == null ? null : $pos.node(0).resolve(start + moved);
}
