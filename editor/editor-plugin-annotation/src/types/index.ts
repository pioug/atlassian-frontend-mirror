import type React from 'react';

import type { AnnotationTypes } from '@atlaskit/adf-schema';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	AnnotationUpdateEmitter,
	AnnotationManager,
} from '@atlaskit/editor-common/annotation';

/**
 * type of target that annotation apply to.
 * This is used to apply correct decoration to a draft comment
 */
export type TargetType = 'block' | 'inline';

/**
 * The source of draft comment being created
 */
export type InlineCommentInputMethod =
	| INPUT_METHOD.TOOLBAR
	| INPUT_METHOD.SHORTCUT
	| INPUT_METHOD.FLOATING_TB;

export type AnnotationInfo = {
	id: string;
	type: AnnotationTypes.INLINE_COMMENT;
};

type AnnotationComponentProps = {
	/**
	 * DOM element around selected text (for positioning)
	 */
	dom?: HTMLElement;

	/**
	 * Indicates whether the comment UI is offline and should be disabled
	 */
	isOffline?: boolean;
	/**
	 * Indicates that a draft comment was discarded/cancelled
	 */
	onClose?: () => void;
	/**
	 * Selected text (can be used when creating a comment)
	 */
	textSelection?: string;
};

export type InlineCommentCreateComponentProps = AnnotationComponentProps & {
	/** List of inline node types, which are wrapped by the annotation. */
	inlineNodeTypes: string[] | undefined;
	/**
	 * Indicates whether we're opening the media comment box from the media toolbar so we can scroll the media into view
	 */
	isOpeningMediaCommentFromToolbar?: boolean;
	/**
	 * Creates an annotation mark in the document with the given id.
	 */
	onCreate: (id: string) => void;
	wasNewAnnotationSelected?: boolean;
};

export type InlineCommentViewComponentProps = AnnotationComponentProps & {
	/**
	 * Existing annotations where the cursor is placed.
	 * These are provided in order, inner-most first.
	 */
	annotations: Array<AnnotationInfo>;

	/**
	 * Ordered list of annotation ids as shown in the document
	 */
	annotationsList?: string[];

	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	/**
	 * Return a list of inline node types, which are wrapped by the annotation,
	 * for annotation with given ID.
	 *
	 * The `undefined` will be returned if `editor_inline_comments_on_inline_nodes` is off.
	 *
	 * @todo: Do not forget to remove `undefined` when the
	 *        `editor_inline_comments_on_inline_nodes` is removed.
	 */
	getInlineNodeTypes: (annotationId: string) => string[] | undefined;
	/**
	 * Indicates whether we're opening the media comment box from the media toolbar so we can scroll the media into view
	 */
	isOpeningMediaCommentFromToolbar?: boolean;
	/**
	 * Removes the annotation from the document
	 */
	onDelete?: (id: string) => void;
	/**
	 * Resolves an annotation with the given ID around the selection.
	 */
	onResolve: (id: string) => void;
};

export interface AnnotationState<Type, State> {
	annotationType: Type;
	id: string;
	state: State;
}

export interface AnnotationTypeProvider<Type, State> {
	disallowOnWhitespace?: boolean;
	getState: (annotationIds: string[]) => Promise<AnnotationState<Type, State>[]>;
	updateSubscriber?: AnnotationUpdateEmitter;
}

export type InlineCommentState = { resolved: boolean };

export type InlineCommentAnnotationProvider = AnnotationTypeProvider<
	AnnotationTypes.INLINE_COMMENT,
	InlineCommentState
> & {
	contentType?: string;
	createComponent?: React.ComponentType<React.PropsWithChildren<InlineCommentCreateComponentProps>>;
	getCanAddComments?: () => boolean;

	// always position toolbar above the selection
	isToolbarAbove?: boolean;
	onCommentButtonMount?: () => void;
	/**
	 * @experimental Still under development. Do not use.
	 *
	 * A list of supported editor node names for inline comment,
	 * Note 1: value is the type name of the node, e.g. media, mediaInline
	 * Invalid node names, nodes does not support annotation
	 * or nodes not supported by current ADF schema will be ignored.
	 * Note 2: text is supported by default.
	 */
	supportedBlockNodes?: string[];
	viewComponent?: React.ComponentType<React.PropsWithChildren<InlineCommentViewComponentProps>>;
};

export interface AnnotationProviders {
	annotationManager?: AnnotationManager;
	createCommentExperience?: {
		initExperience: {
			start: () => void;
		};
		start: (_: {
			attributes:
				| {
						annotationId?: undefined;
						commentType: 'inline';
						entryPoint?: 'highlightActions';
						pageClass: 'editor';
				  }
				| {
						annotationId?: undefined;
						blockType: 'media';
						commentType: 'block';
						entryPoint?: 'highlightActions';
						pageClass: 'editor';
				  };
		}) => void;
	};
	inlineComment: InlineCommentAnnotationProvider;
	selectCommentExperience?: {
		selectAnnotation: {
			complete: (annotationId: string) => void;
		};
	};
	viewInlineCommentTraceUFOPress?: () => void;
}

export enum AnnotationSelectionType {
	INVALID = 'invalid', // Annotation should not be created, toolbar should not be shown
	DISABLED = 'disabled', // Annotation should not be created, toolbar should be shown, but disabled
	VALID = 'valid', // Annotation can be created
}

const prefix = 'ak-editor-annotation';
export const AnnotationTestIds = {
	prefix,
	floatingComponent: `${prefix}-floating-component`,
	floatingToolbarCreateButton: `${prefix}-toolbar-create-button`,
	componentSave: `${prefix}-dummy-save-button`,
	componentClose: `${prefix}-dummy-close-button`,
};

export type CoordsAtPos = {
	bottom: number;
	left: number;
	right: number;
	top: number;
};

export type DraftBookmark = {
	from: number;
	head: number;
	isBlockNode?: boolean;
	to: number;
};
