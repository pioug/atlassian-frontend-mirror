import type React from 'react';

import type { AnnotationTypes } from '@atlaskit/adf-schema';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { AnnotationUpdateEmitter } from '@atlaskit/editor-common/annotation';
import type { Command, NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { showInlineCommentForBlockNode } from './commands';
import type { InlineCommentPluginState } from './pm-plugins/types';

type StripNonExistingAnnotations = (slice: Slice, state: EditorState) => boolean | undefined;

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

type SetInlineCommentDraftState = (
	drafting: boolean,
	inputMethod: InlineCommentInputMethod,
	/** @default 'inline' */
	targetType?: TargetType,
	/** check for confluence.frontend.fabric.editor.comments-on-media feature flag */
	isCommentOnMediaOn?: boolean,
	targetNodeId?: string,
) => Command;

export type AnnotationPlugin = NextEditorPlugin<
	'annotation',
	{
		pluginConfiguration: AnnotationProviders | undefined;
		sharedState: InlineCommentPluginState | undefined;
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			OptionalPlugin<FeatureFlagsPlugin>,
		];
		actions: {
			stripNonExistingAnnotations: StripNonExistingAnnotations;
			setInlineCommentDraftState: SetInlineCommentDraftState;
			/**
			 * This function attempts to display the inline comment popup for a given node.
			 * @returns A command function that returns true if the given node is supported and has resolved annotation mark(s);
			 * otherwise, it will return false.
			 */
			showCommentForBlockNode: ReturnType<typeof showInlineCommentForBlockNode>;
		};
	}
>;

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
};

export interface AnnotationProviders {
	inlineComment: InlineCommentAnnotationProvider;
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
