import { Selection } from 'prosemirror-state';
import { Mapping } from 'prosemirror-transform';
import { Slice, ResolvedPos, Node as PMNode } from 'prosemirror-model';
import { isValidTargetNode } from './utils/is-valid-target-node';

export enum Side {
  LEFT = 'left',
  RIGHT = 'right',
}

export const JSON_ID = 'gapcursor';

export class GapCursorSelection extends Selection {
  public readonly visible: boolean = false;

  /**
   * Construct a GapCursorSelection
   * @param {ResolvedPos} $pos resolved position
   * @param {Side} side side where the gap cursor is drawn
   */
  constructor($pos: ResolvedPos, public readonly side: Side = Side.LEFT) {
    super($pos, $pos);
  }

  static valid($pos: ResolvedPos): boolean {
    const { parent, nodeBefore, nodeAfter } = $pos;

    const targetNode = isValidTargetNode(nodeBefore)
      ? nodeBefore
      : isValidTargetNode(nodeAfter)
      ? nodeAfter
      : null;

    if (!targetNode || parent.isTextblock) {
      return false;
    }

    const deflt = (parent.contentMatchAt($pos.index()) as any).defaultType;
    return deflt && deflt.isTextblock;
  }

  static findFrom(
    $pos: ResolvedPos,
    dir: number,
    mustMove = false,
  ): GapCursorSelection | null {
    const side = dir === 1 ? Side.RIGHT : Side.LEFT;

    if (!mustMove && GapCursorSelection.valid($pos)) {
      return new GapCursorSelection($pos, side);
    }

    let pos = $pos.pos;

    // TODO: Fix any, potential issue. ED-5048
    let next: any = null;

    // Scan up from this position
    for (let d = $pos.depth; ; d--) {
      const parent = $pos.node(d);

      if (
        side === Side.RIGHT
          ? $pos.indexAfter(d) < parent.childCount
          : $pos.index(d) > 0
      ) {
        next = parent.maybeChild(
          side === Side.RIGHT ? $pos.indexAfter(d) : $pos.index(d) - 1,
        );
        break;
      } else if (d === 0) {
        return null;
      }

      pos += dir;

      const $cur = $pos.doc.resolve(pos);
      if (GapCursorSelection.valid($cur)) {
        return new GapCursorSelection($cur, side);
      }
    }

    // And then down into the next node
    for (;;) {
      next = side === Side.RIGHT ? next.firstChild : next.lastChild;

      if (next === null) {
        break;
      }

      pos += dir;

      const $cur = $pos.doc.resolve(pos);
      if (GapCursorSelection.valid($cur)) {
        return new GapCursorSelection($cur, side);
      }
    }

    return null;
  }

  static fromJSON(
    doc: PMNode,
    json: { pos: number; type: string },
  ): GapCursorSelection {
    return new GapCursorSelection(doc.resolve(json.pos));
  }

  map(doc: PMNode, mapping: Mapping): Selection {
    const $pos = doc.resolve(mapping.map(this.head));
    return GapCursorSelection.valid($pos)
      ? new GapCursorSelection($pos, this.side)
      : Selection.near($pos);
  }

  eq(other: Selection): boolean {
    return other instanceof GapCursorSelection && other.head === this.head;
  }

  content() {
    return Slice.empty;
  }

  getBookmark() {
    return new GapBookmark(this.anchor);
  }

  toJSON() {
    return { pos: this.head, type: JSON_ID };
  }
}

Selection.jsonID(JSON_ID, GapCursorSelection);

export class GapBookmark {
  constructor(private readonly pos: number) {}

  map(mapping: any) {
    return new GapBookmark(mapping.map(this.pos));
  }

  resolve(doc: PMNode): GapCursorSelection | Selection {
    const $pos = doc.resolve(this.pos);
    return GapCursorSelection.valid($pos)
      ? new GapCursorSelection($pos)
      : Selection.near($pos);
  }
}
