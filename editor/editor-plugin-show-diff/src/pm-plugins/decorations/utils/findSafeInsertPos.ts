import type { Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import { canInsert } from '@atlaskit/editor-prosemirror/utils';

/**
 * Find a safe position to insert a deletion slice at the given position.
 * @param doc
 * @param pos
 * @param slice
 * @returns
 */
export function findSafeInsertPos(doc: PMNode, pos: number, slice: Slice): number {
	if (pos > doc.content.size) {
		return doc.content.size;
	}
	let $pos = doc.resolve(pos);
	while (!canInsert($pos, slice.content) && slice.content.firstChild?.type.name !== 'paragraph') {
		if ($pos.pos + 1 > doc.content.size) {
			break;
		}
		$pos = doc.resolve($pos.pos + 1);
	}
	return $pos.pos;
}
