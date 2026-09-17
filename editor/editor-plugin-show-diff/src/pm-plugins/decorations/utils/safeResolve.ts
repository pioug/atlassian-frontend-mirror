import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';

/**
 * Resolves a document position, or returns `null` if it cannot be resolved.
 *
 * `Node.resolve` throws a `RangeError` for a position outside the document. Diff decorations are
 * built from change ranges computed against a document that may since have moved on, so a position
 * arriving out of range is a normal outcome rather than a defect — but an exception escaping here
 * takes down the whole decoration set, leaving the diff unrendered.
 *
 * Callers are expected to treat `null` as "cannot tell" and fall back to behaviour that does not
 * need the resolved position.
 */
export const safeResolve = (doc: PMNode, pos: number): ResolvedPos | null => {
	try {
		return doc.resolve(pos);
	} catch {
		return null;
	}
};
