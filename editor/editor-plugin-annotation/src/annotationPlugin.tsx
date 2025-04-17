import React from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, SelectionToolbarGroup } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { AnnotationPlugin } from './annotationPluginType';
import { setInlineCommentDraftState, showInlineCommentForBlockNode } from './editor-commands';
import { annotationWithToDOMFix } from './nodeviews/annotationMark';
import { inlineCommentPlugin } from './pm-plugins/inline-comment';
import { keymapPlugin } from './pm-plugins/keymap';
import {
	buildSuppressedToolbar,
	buildToolbar,
	shouldSuppressFloatingToolbar,
} from './pm-plugins/toolbar';
import {
	getPluginState,
	hasAnyUnResolvedAnnotationInPage,
	stripNonExistingAnnotations,
} from './pm-plugins/utils';
import type { AnnotationProviders } from './types';
import { InlineCommentView } from './ui/InlineCommentView';

export const annotationPlugin: AnnotationPlugin = ({ config: annotationProviders, api }) => {
	const featureFlags = api?.featureFlags?.sharedState.currentState();

	return {
		name: 'annotation',

		marks() {
			return [
				{
					name: 'annotation',
					mark: annotationWithToDOMFix,
				},
			];
		},

		actions: {
			hasAnyUnResolvedAnnotationInPage,
			stripNonExistingAnnotations,
			setInlineCommentDraftState: setInlineCommentDraftState(
				api?.analytics?.actions,
				annotationProviders?.inlineComment.supportedBlockNodes,
			),
			showCommentForBlockNode: showInlineCommentForBlockNode(
				annotationProviders?.inlineComment.supportedBlockNodes,
			),
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}
			const pluginState = getPluginState(editorState) || undefined;
			const clonedPluginState = Object.assign({}, pluginState);
			delete clonedPluginState?.featureFlagsPluginState;
			return clonedPluginState;
		},

		pmPlugins: () => [
			{
				name: 'annotation',
				plugin: ({ dispatch }) => {
					if (annotationProviders) {
						return inlineCommentPlugin({
							dispatch,
							provider: annotationProviders.inlineComment,
							editorAnalyticsAPI: api?.analytics?.actions,
							featureFlagsPluginState: featureFlags,
							selectCommentExperience: annotationProviders.selectCommentExperience,
							annotationManager: annotationProviders.annotationManager,
							api,
						});
					}

					return;
				},
			},
			{
				name: 'annotationKeymap',
				plugin: () => {
					if (annotationProviders) {
						return keymapPlugin(api?.analytics?.actions);
					}
					return;
				},
			},
		],

		pluginsOptions: {
			floatingToolbar(state) {
				if (!fg('platform_editor_fix_toolbar_comment_jump')) {
					return;
				}

				const pluginState = getPluginState(state);
				const bookmark = pluginState?.bookmark;

				if (shouldSuppressFloatingToolbar({ state, bookmark })) {
					return buildSuppressedToolbar(state);
				}
			},

			selectionToolbar(state, intl): SelectionToolbarGroup | undefined {
				if (!annotationProviders) {
					return;
				}

				const pluginState = getPluginState(state);
				if (
					pluginState &&
					pluginState.isVisible &&
					!pluginState.bookmark &&
					!pluginState.mouseData.isSelecting
				) {
					const { isToolbarAbove } = annotationProviders.inlineComment;

					const toolbarConfig = buildToolbar(api?.analytics?.actions)({
						state,
						intl,
						isToolbarAbove,
						api,
						createCommentExperience: annotationProviders.createCommentExperience,
						annotationManager: annotationProviders.annotationManager,
					});

					if (!toolbarConfig) {
						return undefined;
					} else {
						return {
							...toolbarConfig,
							rank: editorExperiment('platform_editor_controls', 'variant1') ? 1 : undefined,
						};
					}
				}
			},
		},

		contentComponent({ editorView, dispatchAnalyticsEvent }) {
			if (!annotationProviders) {
				return null;
			}
			return (
				<AnnotationContentComponent
					api={api}
					editorView={editorView}
					annotationProviders={annotationProviders}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
				/>
			);
		},
	};
};

interface AnnotationContentComponentProps {
	api: ExtractInjectionAPI<typeof annotationPlugin> | undefined;
	editorView: EditorView;
	annotationProviders: AnnotationProviders;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
}

function AnnotationContentComponent({
	api,
	editorView,
	annotationProviders,
	dispatchAnalyticsEvent,
}: AnnotationContentComponentProps) {
	const { annotationState: inlineCommentState } = useSharedPluginState(api, ['annotation']);
	if (inlineCommentState && !inlineCommentState.isVisible) {
		return null;
	}

	return (
		<div data-editor-popup="true">
			<InlineCommentView
				providers={annotationProviders}
				editorView={editorView}
				dispatchAnalyticsEvent={dispatchAnalyticsEvent}
				editorAnalyticsAPI={api?.analytics?.actions}
				editorAPI={api}
			/>
		</div>
	);
}
