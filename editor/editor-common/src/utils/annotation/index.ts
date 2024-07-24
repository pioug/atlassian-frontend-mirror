import { AnnotationTypes } from '@atlaskit/adf-schema';
import type {
	Mark,
	Node as PMNode,
	ResolvedPos,
	Schema,
	Slice,
} from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
type Range = {
	from: number;
	to: number;
};

export const canApplyAnnotationOnRange = (
	rangeSelection: Range,
	doc: PMNode,
	schema: Schema,
): boolean => {
	const { from, to } = rangeSelection;
	if (isNaN(from + to) || to - from <= 0 || to < 0 || from < 0) {
		return false;
	}

	let foundInvalid = false;

	doc.nodesBetween(rangeSelection.from, rangeSelection.to, (node, _pos, parent) => {
		// Special exception for hardBreak nodes
		if (schema.nodes.hardBreak === node.type) {
			return false;
		}

		// For block elements or text nodes, we want to check
		// if annotations are allowed inside this tree
		// or if we're leaf and not text
		if (fg('editor_inline_comments_on_inline_nodes')) {
			const isAllowedInlineNode = ['emoji', 'status', 'date', 'mention', 'inlineCard'].includes(
				node.type.name,
			);

			if (
				(node.isInline && !node.isText && !isAllowedInlineNode) ||
				(node.isLeaf && !node.isText && !isAllowedInlineNode) ||
				(node.isText && !parent?.type.allowsMarkType(schema.marks.annotation))
			) {
				foundInvalid = true;
				return false;
			}
		} else {
			if (
				(node.isInline && !node.isText) ||
				(node.isLeaf && !node.isText) ||
				(node.isText && !parent?.type.allowsMarkType(schema.marks.annotation))
			) {
				foundInvalid = true;
				return false;
			}
		}
		return true;
	});

	return !foundInvalid;
};

export const getAnnotationIdsFromRange = (
	rangeSelection: Range,
	doc: PMNode,
	schema: Schema,
): string[] => {
	const { from, to } = rangeSelection;
	let annotations = new Set<string>();

	doc.nodesBetween(from, to, (node) => {
		if (!node.marks) {
			return true;
		}
		node.marks.forEach((mark: Mark) => {
			if (mark.type === schema.marks.annotation && mark.attrs) {
				annotations.add(mark.attrs.id);
			}
		});
		return true;
	});

	return Array.from(annotations);
};

/*
 * verifies if node contains annotation mark
 */
export function hasAnnotationMark(node: PMNode, state: EditorState): boolean {
	const {
		schema: {
			marks: { annotation: annotationMark },
		},
	} = state;
	return !!(annotationMark && node && node.marks.length && annotationMark.isInSet(node.marks));
}

/*
 * verifies that slice contains any annotations
 */
export function containsAnyAnnotations(slice: Slice, state: EditorState): boolean {
	if (!slice.content.size) {
		return false;
	}
	let hasAnnotation = false;
	slice.content.forEach((node) => {
		hasAnnotation = hasAnnotation || hasAnnotationMark(node, state);
		// return early if annotation found already
		if (hasAnnotation) {
			return true;
		}
		// check annotations in descendants
		node.descendants((node) => {
			if (hasAnnotationMark(node, state)) {
				hasAnnotation = true;
				return false;
			}
			return true;
		});
	});
	return hasAnnotation;
}

/**
 * This returns a list of node names that are inline nodes in the range.
 */
export function getRangeInlineNodeNames({
	doc,
	pos,
}: {
	doc: PMNode;
	pos: { from: number; to: number };
}) {
	if (!fg('editor_inline_comments_on_inline_nodes')) {
		return undefined;
	}

	let nodeNames = new Set<string>();

	try {
		doc.nodesBetween(pos.from, pos.to, (node) => {
			if (node.isInline) {
				nodeNames.add(node.type.name);
			}
		});

		// We sort the list alphabetically to make human consumption of the list easier (in tools like the analytics extension)
		const sortedNames = [...nodeNames].sort();
		return sortedNames;
	} catch {
		// Some callers have existing gaps where the positions are not valid,
		// and so when called in the current document can throw an error if out of range.
		//
		// This is a defensive check to ensure we don't throw an error in those cases.
		return undefined;
	}
}

/**
 * This function returns a list of node types that are wrapped by an annotation mark.
 *
 * The `undefined` will be returned if `editor_inline_comments_on_inline_nodes` is off.
 *
 * @todo: Do not forget to remove `undefined` when the
 *        `editor_inline_comments_on_inline_nodes` is removed.
 */
export function getAnnotationInlineNodeTypes(
	state: { doc: PMNode; schema: Schema },
	annotationId: string,
): string[] | undefined {
	if (!fg('editor_inline_comments_on_inline_nodes')) {
		return undefined;
	}

	const mark = state.schema.marks.annotation.create({
		id: annotationId,
		annotationType: AnnotationTypes.INLINE_COMMENT,
	});

	const inlineNodeNames = new Set<string>();
	state.doc.descendants((node, pos) => {
		if (mark.isInSet(node.marks)) {
			inlineNodeNames.add(node.type.name);
		}
		return true;
	});

	// This sorting is done to make human consumption easier (ie. in dev tools, test snapshots, analytics events, ...)
	return [...inlineNodeNames].sort();
}

/*
	Get the annotations marks from the given position and add them to the original marks array if they exist.
	Used with the creation of the inline nodes: emoji, status, dates, mentions & inlineCards.
*/
export function getAnnotationMarksForPos(pos: ResolvedPos): Mark[] | undefined {
	if (!fg('editor_inline_comments_paste_insert_nodes')) {
		return undefined;
	}

	const annotationMarks = pos
		.marks()
		.filter((mark) => mark.type === pos.doc.type.schema.marks.annotation);

	return annotationMarks;
}
