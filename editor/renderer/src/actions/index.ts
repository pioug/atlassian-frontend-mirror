import type { AnnotationId } from '@atlaskit/adf-schema';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import type { AnnotationActionResult, AnnotationByMatches } from '@atlaskit/editor-common/types';
import {
	canApplyAnnotationOnRange,
	getAnnotationIdsFromRange,
	getAnnotationInlineNodeTypes,
	isEmptyTextSelectionRenderer,
} from '@atlaskit/editor-common/utils';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { Mark, Node, Schema } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import {
	AddNodeMarkStep,
	RemoveMarkStep,
	RemoveNodeMarkStep,
} from '@atlaskit/editor-prosemirror/transform';
import { fg } from '@atlaskit/platform-feature-flags';
import type { AnalyticsEventPayload, AnnotationDeleteAEP } from '../analytics/events';
import { createAnnotationStep, getPosFromRange } from '../steps';
import {
	getRendererRangeInlineNodeNames,
	getRendererRangeAncestorNodeNames,
} from './get-renderer-range-inline-node-names';
import { getIndexMatch } from './matches-utils';

type ActionResult = { doc: JSONDocNode; step: Step } | false;
type Position = { from: number; to: number };
type Annotation = { annotationId: string; annotationType: AnnotationTypes };

interface RendererActionsOptions {
	annotate: (range: Range, annotationId: string, annotationType: 'inlineComment') => ActionResult;
	deleteAnnotation: (annotationId: string, annotationType: 'inlineComment') => ActionResult;
	isValidAnnotationRange: (range: Range) => boolean;
}

export type ApplyAnnotation = (pos: Position, annotation: Annotation) => AnnotationActionResult;

interface AnnotationsRendererActionsOptions {
	applyAnnotation: ApplyAnnotation;
	getAnnotationMarks: () => Mark[];
	isValidAnnotationPosition: (pos: Position) => boolean;
}

interface PositionRendererActionsOptions {
	getPositionFromRange: (range: Range) => Position | false;
}

export default class RendererActions
	implements
		RendererActionsOptions,
		AnnotationsRendererActionsOptions,
		PositionRendererActionsOptions
{
	// This is our psuedo feature flag for now
	// This module can only be used when wrapped with
	// the <RendererContext> component for now.
	private initFromContext: boolean = false;
	private transformer: JSONTransformer;
	public doc?: Node;
	private schema?: Schema;
	// Any kind of refence is allowed
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private ref?: any;
	private onAnalyticsEvent?: (event: AnalyticsEventPayload) => void;

	constructor(initFromContext: boolean = false) {
		this.initFromContext = initFromContext;
		this.transformer = new JSONTransformer();
	}

	//#region private
	_privateRegisterRenderer(
		ref: React.MutableRefObject<null>,
		doc: Node,
		schema: Schema,
		onAnalyticsEvent?: (event: AnalyticsEventPayload) => void,
	): void {
		if (!this.initFromContext) {
			return;
		} else if (!this.ref) {
			this.ref = ref;
		} else if (this.ref !== ref) {
			throw new Error(
				"Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.",
			);
		}
		this.doc = doc;
		this.schema = schema;
		this.onAnalyticsEvent = onAnalyticsEvent;
	}

	_privateUnregisterRenderer(): void {
		this.doc = undefined;
		this.ref = undefined;
		this.schema = undefined;
	}

	/**
	 * Validate whether we can create an annotation between two positions
	 */
	_privateValidatePositionsForAnnotation(from: number, to: number): boolean {
		if (!this.doc || !this.schema) {
			return false;
		}

		const currentSelection = TextSelection.create(this.doc, from, to);
		if (isEmptyTextSelectionRenderer(currentSelection, this.schema)) {
			return false;
		}

		const result = canApplyAnnotationOnRange({ from, to }, this.doc, this.schema);

		return result;
	}

	//#endregion

	deleteAnnotation(annotationId: string, annotationType: 'inlineComment') {
		if (!this.doc || !this.schema || !this.schema.marks.annotation) {
			return false;
		}

		const mark = this.schema.marks.annotation.create({
			id: annotationId,
			annotationType,
		});

		let from: number | undefined;
		let to: number | undefined;
		let nodePos: number | undefined;
		let step: RemoveNodeMarkStep | RemoveMarkStep | undefined;

		this.doc.descendants((node, pos) => {
			const found = mark.isInSet(node.marks);
			if (found && node.type.name === 'media') {
				nodePos = pos;
			}
			if (found && !from) {
				// Set both here incase it only spans one node.
				from = pos;
				to = pos + node.nodeSize;
			} else if (found && from) {
				// If the mark spans multiple nodes,
				// we'll keep setting the end until no longer found.
				to = pos + node.nodeSize;
			}
			return true;
		});

		if (nodePos !== undefined) {
			step = new RemoveNodeMarkStep(nodePos, mark);
		} else {
			if (from === undefined || to === undefined) {
				return false;
			}

			step = new RemoveMarkStep(from, to, mark);
		}

		const { doc, failed } = step.apply(this.doc);

		if (this.onAnalyticsEvent) {
			const payload: AnnotationDeleteAEP = {
				action: ACTION.DELETED,
				actionSubject: ACTION_SUBJECT.ANNOTATION,
				actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					inlineNodeNames:
						step instanceof RemoveMarkStep
							? getRendererRangeInlineNodeNames({
									// Ignored via go/ees005
									// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
									pos: { from: from!, to: to! },
									actions: this,
								})
							: undefined,
				},
			};

			this.onAnalyticsEvent(payload);
		}

		if (!failed && doc) {
			return {
				step,
				doc: this.transformer.encode(doc),
			};
		}

		return false;
	}

	annotate(range: Range, annotationId: string, _annotationType: 'inlineComment') {
		if (!this.doc || !this.schema || !this.schema.marks.annotation) {
			return false;
		}

		const pos = getPosFromRange(range);
		if (!pos) {
			return false;
		}

		const { from, to } = pos;
		const validPositions = this._privateValidatePositionsForAnnotation(from, to);
		if (!validPositions) {
			return false;
		}

		return this.applyAnnotation(pos, {
			annotationId,
			annotationType: AnnotationTypes.INLINE_COMMENT,
		});
	}

	isValidAnnotationRange(range: Range | null): boolean {
		if (!range) {
			return false;
		}

		if (fg('editor_inline_comments_on_inline_nodes')) {
			if (this.isRendererWithinRange(range)) {
				return false;
			}
		}

		const pos = getPosFromRange(range);
		if (!pos || !this.doc) {
			return false;
		}

		return this._privateValidatePositionsForAnnotation(pos.from, pos.to);
	}

	isRangeAnnotatable(range: Range | null): boolean {
		try {
			if (!range) {
				return false;
			}

			const { startContainer, endContainer } = range;

			if (
				startContainer.parentElement?.closest('.ak-renderer-extension') ||
				endContainer.parentElement?.closest('.ak-renderer-extension')
			) {
				return false;
			}

			return this.isValidAnnotationRange(range);
		} catch {
			// isValidAnnotationRange can fail when called inside nested renderers.
			// while isRendererWithinRange guards against this to some degree -- the classnames
			// are controlled by product -- and we don't have platform guarantees on them.
			//
			// Currently there is a mix of logic across the platform and confluence on determining
			// positions that are annotatable. This is a defensive check to ensure we don't throw an error
			// in cases where the range is not valid.
			return false;
		}
	}

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * This is replaced by `isRangeAnnotatable`.
	 *
	 * @deprecated
	 **/
	isRendererWithinRange(range: Range): boolean {
		const { startContainer, endContainer } = range;

		if (
			(startContainer.parentElement &&
				startContainer.parentElement.closest('.ak-renderer-extension')) ||
			(endContainer.parentElement && endContainer.parentElement.closest('.ak-renderer-extension'))
		) {
			return true;
		}

		return false;
	}

	isValidAnnotationPosition(pos: Position): boolean {
		if (!pos || !this.doc) {
			return false;
		}

		return this._privateValidatePositionsForAnnotation(pos.from, pos.to);
	}

	/**
	 * Note: False indicates that the selection not able to be calculated.
	 */
	getPositionFromRange(range: Range | null): Position | false {
		if (!this.doc || !this.schema || !range) {
			return false;
		}

		return getPosFromRange(range);
	}

	getAnnotationMarks() {
		const { schema, doc } = this;
		if (!schema || !doc) {
			return [];
		}

		const {
			marks: { annotation: annotationMarkType },
		} = schema;

		if (!annotationMarkType) {
			return [];
		}
		const marks: Mark[] = [];

		doc.descendants((node) => {
			const annotationsMark = node.marks.filter((m) => m.type === annotationMarkType);
			if (!annotationsMark || !annotationsMark.length) {
				return true;
			}

			marks.push(...annotationsMark);

			return false;
		});

		const uniqueMarks: Map<AnnotationId, Mark> = new Map();
		marks.forEach((m) => {
			uniqueMarks.set(m.attrs.id, m);
		});

		return Array.from(uniqueMarks.values());
	}

	getAnnotationsByPosition(range: Range): string[] {
		if (!this.doc || !this.schema) {
			return [];
		}

		const pos = getPosFromRange(range);
		if (!pos || !this.doc) {
			return [];
		}
		return getAnnotationIdsFromRange(pos, this.doc, this.schema);
	}

	applyAnnotation(pos: Position, annotation: Annotation): AnnotationActionResult {
		if (!this.doc || !pos || !this.schema) {
			return false;
		}
		const { from, to } = pos;
		const { annotationId, annotationType } = annotation;
		let step;
		let targetNodeType;

		// As part of fix for RAP, `from` points to the position right before media node
		// hence, -1 is not needed
		const beforeNodePos = from;
		const possibleNode = this.doc.nodeAt(beforeNodePos);
		if (possibleNode?.type.name === 'media') {
			targetNodeType = 'media';
			step = new AddNodeMarkStep(
				beforeNodePos,
				this.schema.marks.annotation.create({
					id: annotationId,
					type: annotationType,
				}),
			);
		} else {
			const resolvedNode = this.doc.resolve(from).node();
			// annotation is technically on text, but the context is caption
			targetNodeType = resolvedNode.type.name === 'caption' ? 'caption' : 'text';
			step = createAnnotationStep(from, to, {
				annotationId,
				annotationType,
				schema: this.schema,
			});
		}

		const { doc, failed } = step.apply(this.doc);

		if (failed || !doc) {
			return false;
		}

		const originalSelection = doc.textBetween(from, to);
		const { numMatches, matchIndex, blockNodePos } = getIndexMatch(
			this.doc,
			this.schema,
			originalSelection,
			from,
		);

		return {
			step,
			doc: this.transformer.encode(doc),
			inlineNodeTypes: getRendererRangeInlineNodeNames({
				actions: this,
				pos: { from, to },
			}),
			ancestorNodeTypes: getRendererRangeAncestorNodeNames({
				actions: this,
				pos: { from, to },
			}),
			originalSelection,
			numMatches,
			matchIndex,
			pos: blockNodePos,
			...{ targetNodeType },
		};
	}

	generateAnnotationIndexMatch(pos: Position): AnnotationByMatches | false {
		if (!this.doc || !pos || !this.schema) {
			return false;
		}
		const { from, to } = pos;
		const originalSelection = this.doc.textBetween(from, to);
		const { numMatches, matchIndex, blockNodePos } = getIndexMatch(
			this.doc,
			this.schema,
			originalSelection,
			from,
		);

		return {
			originalSelection,
			numMatches,
			matchIndex,
			pos: blockNodePos,
		};
	}

	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	// TODO: Do not forget to remove `undefined` when the `editor_inline_comments_on_inline_nodes` is removed.
	getInlineNodeTypes(annotationId: string): string[] | undefined {
		if (!this.doc || !this.schema) {
			return [];
		}

		return getAnnotationInlineNodeTypes({ doc: this.doc, schema: this.schema }, annotationId);
	}
}
