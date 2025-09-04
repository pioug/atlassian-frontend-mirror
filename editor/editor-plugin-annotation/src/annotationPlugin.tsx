import React from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, SelectionToolbarGroup } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
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
import { getToolbarComponents } from './ui/toolbar-components';

export const annotationPlugin: AnnotationPlugin = ({ config: annotationProviders, api }) => {
	const featureFlags = api?.featureFlags?.sharedState.currentState();
	const isToolbarAIFCEnabled = editorExperiment('platform_editor_toolbar_aifc', true, {
		exposure: true,
	});

	if (isToolbarAIFCEnabled) {
		api?.toolbar?.actions.registerComponents(getToolbarComponents(api, annotationProviders));
	}

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
							viewInlineCommentTraceUFOPress: annotationProviders.viewInlineCommentTraceUFOPress,
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
				const pluginState = getPluginState(state);
				const bookmark = pluginState?.bookmark;

				if (shouldSuppressFloatingToolbar({ state, bookmark })) {
					return buildSuppressedToolbar(state);
				}
			},

			selectionToolbar(state, intl): SelectionToolbarGroup | undefined {
				if (isToolbarAIFCEnabled) {
					return;
				}

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
					const { isToolbarAbove, onCommentButtonMount, getCanAddComments, contentType } =
						annotationProviders.inlineComment;

					const toolbarConfig = buildToolbar(api?.analytics?.actions)({
						state,
						intl,
						isToolbarAbove,
						api,
						createCommentExperience: annotationProviders.createCommentExperience,
						annotationManager: annotationProviders.annotationManager,
						onCommentButtonMount,
						getCanAddComments,
						contentType,
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
	annotationProviders: AnnotationProviders;
	api: ExtractInjectionAPI<typeof annotationPlugin> | undefined;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
	editorView: EditorView;
}

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<typeof annotationPlugin>,
		'annotation'
	>,
) => {
	return {
		isVisible: states.annotationState?.isVisible,
		selectedAnnotations: states.annotationState?.selectedAnnotations,
		annotations: states.annotationState?.annotations,
	};
};

function AnnotationContentComponent({
	api,
	editorView,
	annotationProviders,
	dispatchAnalyticsEvent,
}: AnnotationContentComponentProps) {
	const annotationState = useSharedPluginStateWithSelector(api, ['annotation'], selector);

	if (
		annotationState &&
		!annotationState.isVisible &&
		expValEquals('platform_editor_usesharedpluginstatewithselector', 'isEnabled', false)
	) {
		return null;
	}

	// need to explicitly check for false as undefined is also a valid value to continue
	if (
		annotationState?.isVisible === false &&
		expValEquals('platform_editor_usesharedpluginstatewithselector', 'isEnabled', true)
	) {
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
