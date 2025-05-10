import type React from 'react';

import type { AnnotationTypes } from '@atlaskit/adf-schema';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
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
	 * Selected text (can be used when creating a comment)
	 */
	textSelection?: string;

	/**
	 * DOM element around selected text (for positioning)
	 */
	dom?: HTMLElement;
	/**
	 * Indicates that a draft comment was discarded/cancelled
	 */
	onClose?: () => void;
};

export type InlineCommentCreateComponentProps = AnnotationComponentProps & {
	/**
	 * Creates an annotation mark in the document with the given id.
	 */
	onCreate: (id: string) => void;
	/** List of inline node types, which are wrapped by the annotation. */
	inlineNodeTypes: string[] | undefined;
	/**
	 * Indicates whether we're opening the media comment box from the media toolbar so we can scroll the media into view
	 */
	isOpeningMediaCommentFromToolbar?: boolean;
};

export type InlineCommentViewComponentProps = AnnotationComponentProps & {
	/**
	 * Existing annotations where the cursor is placed.
	 * These are provided in order, inner-most first.
	 */
	annotations: Array<AnnotationInfo>;

	/**
	 * Resolves an annotation with the given ID around the selection.
	 */
	onResolve: (id: string) => void;

	/**
	 * Removes the annotation from the document
	 */
	onDelete?: (id: string) => void;
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
};

export interface AnnotationState<Type, State> {
	annotationType: Type;
	id: string;
	state: State;
}

export interface AnnotationTypeProvider<Type, State> {
	getState: (annotationIds: string[]) => Promise<AnnotationState<Type, State>[]>;
	updateSubscriber?: AnnotationUpdateEmitter;
	disallowOnWhitespace?: boolean;
}

export type InlineCommentState = { resolved: boolean };

export type InlineCommentAnnotationProvider = AnnotationTypeProvider<
	AnnotationTypes.INLINE_COMMENT,
	InlineCommentState
> & {
	createComponent?: React.ComponentType<React.PropsWithChildren<InlineCommentCreateComponentProps>>;
	viewComponent?: React.ComponentType<React.PropsWithChildren<InlineCommentViewComponentProps>>;
	// always position toolbar above the selection
	isToolbarAbove?: boolean;

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
	onCommentButtonMount?: () => void;
};

export interface AnnotationProviders {
	inlineComment: InlineCommentAnnotationProvider;
	createCommentExperience?: InlineCommentCompoundExperience;
	// Annotations plugin uses only a simplified version of SelectInlineCommentCompoundExperience.
	selectCommentExperience?: SimpleSelectInlineCommentCompoundExperience;
	annotationManager?: AnnotationManager;
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
	top: number;
	bottom: number;
	left: number;
	right: number;
};

export type DraftBookmark = {
	from: number;
	to: number;
	head: number;
	isBlockNode?: boolean;
};

type ExperienceAttributes = {
	[key: string]: string | number | boolean | string[] | number[];
};

type InlineCommentAttributes =
	| { pageClass: 'editor'; commentType: 'inline'; annotationId?: undefined }
	| { pageClass: 'editor'; commentType: 'block'; blockType: 'media'; annotationId?: undefined }
	| { pageClass: 'renderer'; commentType: 'inline'; annotationId: string }
	| { pageClass: 'renderer'; commentType: 'block'; blockType: 'media'; annotationId: string };

export type SelectInlineCommentCompoundExperienceEntryPoint =
	| 'create-comment'
	| 'annotation-change'
	| 'comment-navigation'
	| 'keyboard-navigation'
	| 'sidebar'
	| 'unknown:RendererFocus'
	| 'unknown:InlineComment'
	| 'unknown:CommentsPanelList';

export type StartAttributes =
	| {
			pageClass: 'editor' | 'renderer';
			/**
			 * This is optional as in some scenarios the entry point does not know
			 * what type of comment is being selected (e.g. comment navigation, sidebar).
			 **/
			commentType?: 'block' | 'inline';
			blockType?: 'media';
			annotationId: string;
			entryPoint: Exclude<
				SelectInlineCommentCompoundExperienceEntryPoint,
				'keyboard-navigation' | 'comment-navigation'
			>;
			linkedCompoundTaskId?: string;
	  }
	| {
			pageClass: 'editor' | 'renderer';
			/**
			 * This is optional as in some scenarios the entry point does not know
			 * what type of comment is being selected (e.g. comment navigation, sidebar).
			 **/
			commentType?: 'block' | 'inline';
			blockType?: 'media';
			entryPoint: 'keyboard-navigation' | 'comment-navigation';
			linkedCompoundTaskId?: string;
	  };

type ExperienceDebugFunction = (params: {
	createAnalyticsEvent: CreateUIAnalyticsEvent;
	error: Error;
	extraAttributes?: ExperienceAttributes;
}) => void;

export type InlineCommentCompoundExperience = {
	start: (params: { attributes: InlineCommentAttributes }) => void;
	debug: ExperienceDebugFunction;
	addCommonAttributes: (commonAttributes: ExperienceAttributes) => void;
	attachCommonAttributes: (experienceName: string) => void;
	initExperience: {
		start: () => void;
		fail: (error: Error) => void;
		softFail: (error: Error) => void;
		abort: (params: { abortReason: 'Draft annotation removed from document' }) => void;
		complete: () => void;
		debug: ExperienceDebugFunction;
		debugPoint: (message: string, attributes?: ExperienceAttributes) => void;
	};
	draftToPublishExperience: {
		start: () => void;
		publishFailed: (error: Error) => void;
		publishSucceeded: () => void;
		abort: (params: {
			abortReason: 'Create Comment UI dismissed' | 'Unable to apply annotation to document';
		}) => void;
		fail: (error: Error, attributes?: ExperienceAttributes) => void;
		dismissed: () => void;
		softFail: (error: Error) => void;
		complete: () => void;
		debug: ExperienceDebugFunction;
		debugPoint: (message: string, attributes?: ExperienceAttributes) => void;
	};
	attachCommentExperience: {
		start: () => void;
		fail: (error: Error, attributes?: ExperienceAttributes) => void;
		complete: () => void;
		debug: ExperienceDebugFunction;
		debugPoint: (message: string, attributes?: ExperienceAttributes) => void;
	};
};

export type SelectInlineCommentCompoundExperience = {
	_start: (startAttributes: StartAttributes) => void;
	addCommonAttributes: (additionalCommonAttributes: {
		[key: string]: string | number | boolean;
	}) => void;
	abort: (params: { abortReason: 'test abort' }) => void;
	selectAnnotation: {
		debug: ExperienceDebugFunction;
		start: (startAttributes: StartAttributes) => void;
		abort: (params: { abortReason: 'Comment navigation when only one comment' }) => void;
		complete: (startAttributes: StartAttributes) => void;
	};
	showComment: {
		debug: ExperienceDebugFunction;
		debugPoint: (
			message: string,
			attributes?: { [key: string]: string | number | boolean },
		) => void;
		start: (startAttributes: StartAttributes & { annotationId: string }) => void;
		abort: (params: {
			abortReason: 'Non inline comment being shown' | 'Comment sidebar dismissed';
		}) => void;
		fail: (error: Error, extraAttributes?: { misalignedBy: number }) => void;
		complete: () => void;
	};
};

/**
 * Alternative to SelectInlineCommentCompoundExperience, used for the annotation plugin options
 * in the confluence editor presets. See createFullPageEditorPreset.ts or annotationPluginOptions.ts for usage.
 */
export type SimpleSelectInlineCommentCompoundExperience = {
	selectAnnotation: {
		complete: (annotationId: string) => void;
	};
};
