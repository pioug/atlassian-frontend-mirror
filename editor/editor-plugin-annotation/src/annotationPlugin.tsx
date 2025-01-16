import React from 'react';

import { annotation } from '@atlaskit/adf-schema';
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
import { buildToolbar } from './pm-plugins/toolbar';
import { getPluginState, stripNonExistingAnnotations } from './pm-plugins/utils';
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
					mark: fg('platform_editor_annotation_react_18_mem_leak')
						? annotationWithToDOMFix
						: annotation,
				},
			];
		},

		actions: {
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
				plugin: ({ dispatch, portalProviderAPI, eventDispatcher }) => {
					if (annotationProviders) {
						return inlineCommentPlugin({
							dispatch,
							portalProviderAPI,
							eventDispatcher,
							provider: annotationProviders.inlineComment,
							editorAnalyticsAPI: api?.analytics?.actions,
							featureFlagsPluginState: featureFlags,
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
					});

					if (!toolbarConfig) {
						return undefined;
					} else {
						return {
							...toolbarConfig,
							rank: editorExperiment('contextual_formatting_toolbar', true) ? 1 : undefined,
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
