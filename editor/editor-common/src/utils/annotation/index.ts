import type { Mark, Node as PMNode, Schema, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
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

	const { inlineCard } = schema.nodes;
	let foundInvalid = false;

	doc.nodesBetween(rangeSelection.from, rangeSelection.to, (node, _pos, parent) => {
		// Special exception for hardBreak nodes
		if (schema.nodes.hardBreak === node.type) {
			return false;
		}
		// For block elements or text nodes, we want to check
		// if annotations are allowed inside this tree
		// or if we're leaf and not text

		if (getBooleanFF('platform.editor.allow-inline-comments-for-inline-nodes')) {
			if (getBooleanFF('platform.editor.allow-inline-comments-for-inline-nodes-round-2_ctuxz')) {
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
					(node.isInline && !node.isText && node.type !== inlineCard) ||
					(node.isLeaf && !node.isText && node.type !== inlineCard) ||
					(node.isText && !parent?.type.allowsMarkType(schema.marks.annotation))
				) {
					foundInvalid = true;
					return false;
				}
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
