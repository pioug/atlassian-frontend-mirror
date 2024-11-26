import type { Command, NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorViewModeEffectsPlugin } from '@atlaskit/editor-plugin-editor-viewmode-effects';
import type { EngagementPlatformPlugin } from '@atlaskit/editor-plugin-engagement-platform';
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

export type AnnotationPlugin = NextEditorPlugin<
	'annotation',
	{
		pluginConfiguration: AnnotationProviders | undefined;
		sharedState: InlineCommentPluginState | undefined;
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<EditorViewModeEffectsPlugin>,
			OptionalPlugin<FeatureFlagsPlugin>,
			OptionalPlugin<EngagementPlatformPlugin>,
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
