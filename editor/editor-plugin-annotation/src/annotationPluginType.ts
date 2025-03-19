import type { Command, NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { EditorViewModeEffectsPlugin } from '@atlaskit/editor-plugin-editor-viewmode-effects';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { showInlineCommentForBlockNode } from './editor-commands';
import type { InlineCommentPluginState } from './pm-plugins/types';
import type { AnnotationProviders, InlineCommentInputMethod, TargetType } from './types';

type StripNonExistingAnnotations = (slice: Slice, state: EditorState) => boolean | undefined;

type SetInlineCommentDraftState = (
	drafting: boolean,
	inputMethod: InlineCommentInputMethod,
	/** @default 'inline' */
	targetType?: TargetType,
	targetNodeId?: string,
	isOpeningMediaCommentFromToolbar?: boolean,
) => Command;

export type AnnotationPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<EditorViewModeEffectsPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<ConnectivityPlugin>,
];

export type AnnotationPlugin = NextEditorPlugin<
	'annotation',
	{
		pluginConfiguration: AnnotationProviders | undefined;
		sharedState: InlineCommentPluginState | undefined;
		dependencies: AnnotationPluginDependencies;
		actions: {
			stripNonExistingAnnotations: StripNonExistingAnnotations;
			setInlineCommentDraftState: SetInlineCommentDraftState;
			/**
			 * This function attempts to display the inline comment popup for a given node.
			 * @returns A command function that returns true if the given node is supported and has resolved annotation mark(s);
			 * otherwise, it will return false.
			 */
			showCommentForBlockNode: ReturnType<typeof showInlineCommentForBlockNode>;
			hasAnyUnResolvedAnnotationInPage: (state: EditorState) => boolean;
		};
	}
>;
