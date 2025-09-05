import type { AnnotationId, AnnotationTypes } from '@atlaskit/adf-schema';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type {
	AddNodeMarkStep,
	AddMarkStep,
	RemoveMarkStep,
	RemoveNodeMarkStep,
} from '@atlaskit/editor-prosemirror/transform';

import type { AnnotationManager } from '../../annotation';

import type { AnnotationState, AnnotationUpdateEmitter } from './emitter';

export type AnnotationByMatches = {
	isAnnotationAllowed?: boolean;
	matchIndex: number;
	numMatches: number;
	originalSelection: string;
	pos?: number;
};

type ActionResult = { doc: JSONDocNode; step: RemoveMarkStep | RemoveNodeMarkStep } | false;
export type AnnotationActionResult =
	| ({
			/** The list of types of all nodes, which wrap the annotation. */
			ancestorNodeTypes?: string[];
			doc: JSONDocNode;
			/** The list of types of all inline nodes, which were wrapped by annotation. */
			inlineNodeTypes?: string[];
			step: AddMarkStep | AddNodeMarkStep;
			targetNodeType?: string;
	  } & AnnotationByMatches)
	| false;

export type InlineCommentSelectionComponentProps = {
	/**
	 * Call this function to surround the range with a HTML tag.
	 */
	applyDraftMode: (options: {
		annotationId?: string;
		keepNativeSelection?: boolean;
	}) => AnnotationActionResult;

	/**
	 * The draft range of a pre-committed annotation
	 */
	draftRange?: Range | null;

	/**
	 * getAnnotationIndexMatch finds the { numMatch, matchIndex } tuple of the current selection
	 */
	getAnnotationIndexMatch?: () => AnnotationByMatches | false;

	/** The list of types of all inline nodes, which were wrapped by annotation. */
	inlineNodeTypes?: string[];

	/**
	 * If it is possible to add an inline comment on this range
	 */
	isAnnotationAllowed: boolean;

	/**
	 * Indicates that a draft comment was discarded/cancelled
	 */
	onClose: () => void;

	/**
	 * Creates an annotation mark in the document with the given id.
	 */
	onCreate: (annotationId: AnnotationId) => AnnotationActionResult;

	/**
	 * Range selected
	 */
	range: Range | null;

	/**
	 * Call this function to remove the draft HTML tags created by the applyDraftMode
	 */
	removeDraftMode: () => void;
	/**
	 * Renderer/Editor DOM element ancestors wrapping the selection.
	 */
	wrapperDOM: HTMLElement;
};

type AnnotationInfo = {
	id: AnnotationId;
	type: AnnotationTypes.INLINE_COMMENT;
};

export type InlineCommentViewComponentProps = {
	/**
	 * Existing annotations where the cursor is placed.
	 * These are provided in order, inner-most first.
	 */
	annotations: Array<AnnotationInfo>;

	/**
	 * eventTarget of the tapped annotation. Useful for UI positioning.
	 */
	clickElementTarget?: HTMLElement;

	deleteAnnotation: (annotationInfo: AnnotationInfo) => ActionResult;
	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	// TODO: Remove this message when the editor_inline_comments_on_inline_nodes FF is removed
	/**
	 * Return a list of inline node types, which are wrapped by the annotation,
	 * for annotation with given ID.
	 *
	 * The `undefined` will be returned if `editor_inline_comments_on_inline_nodes` is off.
	 */
	getInlineNodeTypes: (annotationId: string) => string[] | undefined;
};

export type InlineCommentHoverComponentProps = {
	/**
	 * Call this function to surround the range with a HTML tag.
	 */
	applyDraftMode: (options: {
		annotationId?: string;
		keepNativeSelection?: boolean;
	}) => AnnotationActionResult;

	/**
	 * getAnnotationIndexMatch finds the { numMatch, matchIndex } tuple of the current selection
	 */
	getAnnotationIndexMatch?: () => AnnotationByMatches | false;

	/**
	 * If it is possible to add an inline comment on this range
	 */
	isAnnotationAllowed: boolean;

	/**
	 * Is mouse within the range container
	 */
	isWithinRange: boolean;

	/**
	 * Indicates that a draft comment was discarded/cancelled
	 */
	onClose: () => void;

	/**
	 * Creates an annotation mark in the document with the given id.
	 */
	onCreate: (annotationId: AnnotationId) => AnnotationActionResult;

	/**
	 * Range selected
	 */
	range: Range;

	/**
	 * Call this function to remove the draft HTML tags created by the applyDraftMode
	 */
	removeDraftMode: () => void;

	/**
	 * Renderer/Editor DOM element ancestors wrapping the selection.
	 */
	wrapperDOM: HTMLElement;
};

interface AnnotationTypeProvider<Type> {
	allowCommentsOnMedia?: boolean;
	allowDraftMode?: boolean;
	getState: (annotationIds: string[], isNestedRender: boolean) => Promise<AnnotationState<Type>[]>;
	updateSubscriber?: AnnotationUpdateEmitter;
}

export type InlineCommentAnnotationProvider =
	AnnotationTypeProvider<AnnotationTypes.INLINE_COMMENT> & {
		hoverComponent?: React.ComponentType<InlineCommentHoverComponentProps>;
		selectionComponent?: React.ComponentType<
			React.PropsWithChildren<InlineCommentSelectionComponentProps>
		>;
		viewComponent?: React.ComponentType<React.PropsWithChildren<InlineCommentViewComponentProps>>;
	};

export type AnnotationProviders = {
	annotationManager?: AnnotationManager;

	inlineComment: InlineCommentAnnotationProvider;
};
