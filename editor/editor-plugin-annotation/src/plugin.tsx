import React from 'react';

import { annotation } from '@atlaskit/adf-schema';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { UpdateEvent } from '@atlaskit/editor-common/annotation';
import { AnnotationUpdateEmitter } from '@atlaskit/editor-common/annotation';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, SelectionToolbarGroup } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { setInlineCommentDraftState, showInlineCommentForBlockNode } from './commands';
import { inlineCommentPlugin } from './pm-plugins/inline-comment';
import { keymapPlugin } from './pm-plugins/keymap';
import { buildToolbar } from './toolbar';
import type {
	AnnotationInfo,
	AnnotationPlugin,
	AnnotationProviders,
	AnnotationState,
	AnnotationTypeProvider,
	InlineCommentAnnotationProvider,
	InlineCommentCreateComponentProps,
	InlineCommentState,
	InlineCommentViewComponentProps,
} from './types';
import { InlineCommentView } from './ui/InlineCommentView';
import { getPluginState, stripNonExistingAnnotations } from './utils';

export const annotationPlugin: AnnotationPlugin = ({ config: annotationProviders, api }) => {
	const featureFlags = api?.featureFlags?.sharedState.currentState();

	return {
		name: 'annotation',

		marks() {
			return [
				{
					name: 'annotation',
					mark: annotation,
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
					return buildToolbar(api?.analytics?.actions)(
						state,
						intl,
						isToolbarAbove,
						featureFlags?.commentsOnMedia,
					) as SelectionToolbarGroup;
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

export { AnnotationUpdateEmitter };
export type {
	AnnotationProviders,
	InlineCommentAnnotationProvider,
	InlineCommentCreateComponentProps,
	InlineCommentViewComponentProps,
	AnnotationTypeProvider,
	AnnotationInfo,
	AnnotationState,
	InlineCommentState,
	UpdateEvent,
};
