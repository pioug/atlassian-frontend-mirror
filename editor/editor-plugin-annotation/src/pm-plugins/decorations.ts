import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { getAnnotationViewClassname, getBlockAnnotationViewClassname } from '../nodeviews';
import type { AnnotationInfo, InlineCommentAnnotationProvider } from '../types';
import type { InlineCommentMap } from './types';
import { decorationKey, isSupportedBlockNode, shouldHideRemixAnnotation } from './utils';

export type AnnotationDecorationDeps = {
	annotations: InlineCommentMap | undefined;
	hoveredAnnotations: AnnotationInfo[] | undefined;
	isBlockNodeSupported: InlineCommentAnnotationProvider['isBlockNodeSupported'];
	isInlineCommentViewClosed: boolean | undefined;
	isVisible: boolean | undefined;
	selectedAnnotations: AnnotationInfo[] | undefined;
	supportedBlockNodes: string[] | undefined;
};

/** Values must stay primitive: `DecorationSet.remove` matches specs by shallow equality. */
type AnnotationDecorationSpec = {
	annotationId: string;
	annotationType: string;
	key?: string;
	kind: 'blockNode' | 'inlineNode' | 'inline';
};

type Range = { from: number; to: number };

type TransactionSteps = Pick<ReadonlyTransaction, 'mapping' | 'steps'>;

const isAnnotationDecorationSpec = (
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	spec: any,
): spec is AnnotationDecorationSpec => typeof spec?.annotationId === 'string';

const scanRange = (
	doc: PMNode,
	from: number,
	to: number,
	deps: AnnotationDecorationDeps,
): Decoration[] => {
	const {
		annotations,
		selectedAnnotations,
		hoveredAnnotations,
		isVisible,
		isInlineCommentViewClosed,
		supportedBlockNodes,
		isBlockNodeSupported,
	} = deps;

	if (!isVisible) {
		return [];
	}

	const annotationMarkType = doc.type.schema.marks.annotation;
	if (!annotationMarkType) {
		return [];
	}

	const decorateInlineNodes = fg('editor_inline_comments_on_inline_nodes');
	const decorations: Decoration[] = [];

	doc.nodesBetween(from, to, (node: PMNode, pos: number) => {
		// Do not render saved chart marks as text highlights when annotation support is off.
		if (shouldHideRemixAnnotation(node)) {
			return false;
		}
		// Inline comments are not supported on mediaInline
		if (node.type.name === 'mediaInline') {
			return false;
		}

		const isSupportedBlock =
			node.isBlock && isSupportedBlockNode(node, supportedBlockNodes, isBlockNodeSupported);

		for (const mark of node.marks) {
			if (mark.type !== annotationMarkType) {
				continue;
			}

			const isUnresolved = !!annotations && annotations[mark.attrs.id] === false;
			const isSelected =
				!isInlineCommentViewClosed &&
				!!selectedAnnotations?.some(
					(selectedAnnotation) => selectedAnnotation.id === mark.attrs.id,
				);
			const isHovered =
				!isInlineCommentViewClosed &&
				!!hoveredAnnotations?.some((hoveredAnnotation) => hoveredAnnotation.id === mark.attrs.id);

			const spec = {
				annotationId: mark.attrs.id,
				annotationType: mark.attrs.annotationType,
			};

			if (isSupportedBlock) {
				decorations.push(
					Decoration.node(
						pos,
						pos + node.nodeSize,
						{
							class: `${getBlockAnnotationViewClassname(isUnresolved, isSelected)} ${isUnresolved}`,
						},
						{ ...spec, kind: 'blockNode', key: decorationKey.block },
					),
				);
			} else if (decorateInlineNodes && !node.isText) {
				decorations.push(
					Decoration.node(
						pos,
						pos + node.nodeSize,
						{
							class: `${getAnnotationViewClassname(
								isUnresolved,
								isSelected,
								isHovered,
							)} ${isUnresolved}`,
						},
						{ ...spec, kind: 'inlineNode', key: decorationKey.block },
					),
				);
			} else {
				decorations.push(
					Decoration.inline(
						pos,
						pos + node.nodeSize,
						{
							class: `${getAnnotationViewClassname(
								isUnresolved,
								isSelected,
								isHovered,
							)} ${isUnresolved}`,
							nodeName: 'span',
						},
						{ ...spec, kind: 'inline' },
					),
				);
			}
		}

		return true;
	});

	return decorations;
};

export const getAnnotationDecorationsForDocument = (
	doc: PMNode,
	deps: AnnotationDecorationDeps,
): DecorationSet => DecorationSet.empty.add(doc, scanRange(doc, 0, doc.content.size, deps));

/** Expands a position out to the boundaries of the top-level block containing it. */
const boundsAt = (doc: PMNode, pos: number): Range => {
	const docSize = doc.content.size;
	const inside = Math.max(1, Math.min(pos, Math.max(1, docSize - 1)));
	const $inside = doc.resolve(inside);
	if ($inside.depth > 0) {
		return { from: $inside.before(1), to: $inside.after(1) };
	}

	// Sitting exactly between two top-level blocks, so cover both neighbours
	const $before = doc.resolve(Math.max(1, inside - 1));
	const $after = doc.resolve(Math.min(Math.max(1, docSize - 1), inside + 1));
	return {
		from: $before.depth > 0 ? $before.before(1) : 0,
		to: $after.depth > 0 ? $after.after(1) : docSize,
	};
};

/** Top-level block range covering a decoration, without pulling in sibling blocks. */
const decorationBlockRange = (doc: PMNode, from: number, to: number): Range => {
	if (doc.resolve(from).depth === 0) {
		return { from, to };
	}
	return { from: doc.resolve(from).before(1), to: doc.resolve(to).after(1) };
};

const mergeRanges = (ranges: Range[]): Range[] => {
	const sorted = [...ranges].sort((a, b) => a.from - b.from);

	const merged: Range[] = [];
	for (const range of sorted) {
		const last = merged[merged.length - 1];
		if (last && range.from <= last.to) {
			merged[merged.length - 1] = { from: last.from, to: Math.max(last.to, range.to) };
		} else {
			merged.push({ ...range });
		}
	}
	return merged;
};

export const getDirtyTopLevelRanges = (tr: TransactionSteps, doc: PMNode): Range[] => {
	const docSize = doc.content.size;
	const wholeDoc = [{ from: 0, to: docSize }];
	const ranges: Range[] = [];

	for (let index = 0; index < tr.steps.length; index++) {
		const step = tr.steps[index];
		// Duck-typed so unrecognised step types fall back to a full recompute
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { from, to, pos } = step as any;
		const positions: number[] =
			typeof from === 'number' && typeof to === 'number'
				? [from, to]
				: typeof pos === 'number'
					? [pos]
					: [];

		if (positions.length === 0) {
			return wholeDoc;
		}

		// Step positions predate the later steps, and the bias keeps each end inside its own block
		const remainder = tr.mapping.slice(index);
		const start = boundsAt(doc, remainder.map(Math.min(...positions), -1));
		const end = boundsAt(doc, remainder.map(Math.max(...positions), 1));
		ranges.push({ from: Math.min(start.from, end.from), to: Math.max(start.to, end.to) });
	}

	return mergeRanges(ranges);
};

const rebuildRanges = (
	decorationSet: DecorationSet,
	ranges: Range[],
	doc: PMNode,
	deps: AnnotationDecorationDeps,
): DecorationSet => {
	let result = decorationSet;

	for (const { from, to } of ranges) {
		// `find` also returns decorations that merely touch the range, which the scan will not re-emit
		const stale = result
			.find(from, to)
			.filter((decoration) => decoration.from >= from && decoration.to <= to);
		if (stale.length > 0) {
			result = result.remove(stale);
		}

		const fresh = scanRange(doc, from, to, deps);
		if (fresh.length > 0) {
			result = result.add(doc, fresh);
		}
	}

	return result;
};

export const updateAnnotationDecorations = (
	previousDecorationSet: DecorationSet,
	tr: TransactionSteps,
	doc: PMNode,
	deps: AnnotationDecorationDeps,
): DecorationSet =>
	rebuildRanges(
		previousDecorationSet.map(tr.mapping, doc),
		getDirtyTopLevelRanges(tr, doc),
		doc,
		deps,
	);

/**
 * Rebuilds whole blocks rather than the changed decorations alone, because `DecorationSet.add`
 * appends within a range and that order decides the nesting of overlapping annotations.
 */
export const rebuildRangesForIds = (
	decorationSet: DecorationSet,
	changedIds: Set<string>,
	doc: PMNode,
	deps: AnnotationDecorationDeps,
): DecorationSet => {
	if (changedIds.size === 0) {
		return decorationSet;
	}

	const affected = decorationSet.find(
		undefined,
		undefined,
		(spec) => isAnnotationDecorationSpec(spec) && changedIds.has(spec.annotationId),
	);

	if (affected.length === 0) {
		return decorationSet;
	}

	const ranges = mergeRanges(
		affected.map((decoration) => decorationBlockRange(doc, decoration.from, decoration.to)),
	);

	return rebuildRanges(decorationSet, ranges, doc, deps);
};
