import React from 'react';

import type { EditorView } from 'prosemirror-view';

import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import {
	areAttributionColorGatesEnabled,
	resolveContributors,
} from './pm-plugins/decorations/colorSchemes/attributions';
import { getDeletedWidgets } from './pm-plugins/getDeletedWidgets';
import { getScrollableDecorations } from './pm-plugins/getScrollableDecorations';
import { createPlugin, showDiffPluginKey } from './pm-plugins/main';
import { resolveDiffContributors } from './pm-plugins/resolveDiffContributors';
import type { ShowDiffParams, ShowDiffPlugin } from './showDiffPluginType';
import { IndicatorBarContentComponent } from './ui/IndicatorBar/IndicatorBarContentComponent';

const normalizeShowDiffParams = (params: ShowDiffParams | undefined) => {
	if (!params || !('stepsWithAttribution' in params)) {
		// Clear contributors to prevent leaking from attributed to unattributed diffs.
		return params ? { ...params, stepAttributions: [], contributors: undefined } : params;
	}

	const { stepsWithAttribution, contributorProfiles, showContributorTags = true, ...rest } = params;

	return {
		...rest,
		showContributorTags,
		// Resolve at boundary to keep contributor model and attribution format internal.
		contributors: areAttributionColorGatesEnabled()
			? resolveContributors(resolveDiffContributors(stepsWithAttribution, contributorProfiles))
			: undefined,
		steps: stepsWithAttribution.map(({ step }) => step),
		stepAttributions: stepsWithAttribution.map(({ stepAttribution }) => stepAttribution),
	};
};

export const showDiffPlugin: ShowDiffPlugin = ({ api, config }) => {
	// Captured from view lifecycle so read-only actions access state without exposing plugin key.
	let editorView: EditorView | undefined;
	const setEditorView = (view: EditorView | undefined) => {
		editorView = view;
	};

	return {
		name: 'showDiff',
		actions: {
			getDeletedWidgets: (range) => (editorView ? getDeletedWidgets(editorView.state, range) : []),
		},
		commands: {
			showDiff:
				(params?: ShowDiffParams) =>
				({ tr }) => {
					api?.userIntent?.commands.setCurrentUserIntent('viewingDiff')({ tr });
					return tr.setMeta(showDiffPluginKey, {
						...normalizeShowDiffParams(params),
						action: 'SHOW_DIFF',
					});
				},
			hideDiff: ({ tr }) => {
				api?.userIntent?.commands.setCurrentUserIntent('default')({ tr });
				return tr.setMeta(showDiffPluginKey, {
					steps: [],
					stepAttributions: [],
					contributors: undefined,
					action: 'HIDE_DIFF',
				});
			},
			scrollToNext: ({ tr }) => {
				return tr.setMeta(showDiffPluginKey, { action: 'SCROLL_TO_NEXT' });
			},
			scrollToPrevious: ({ tr }) => {
				return tr.setMeta(showDiffPluginKey, { action: 'SCROLL_TO_PREVIOUS' });
			},
		},
		pmPlugins() {
			return [
				{
					name: 'showDiffPlugin',
					// Contributor tags draw themselves into their own decoration widgets — plain DOM, so
					// no portal provider is needed here.
					plugin: ({ getIntl }) => createPlugin(config, getIntl, api, setEditorView),
				},
			];
		},
		contentComponent: () => {
			// Rendered here sharing decoration anchor span DOM context (tags mount separately).
			return (
				<React.Fragment>
					<IndicatorBarContentComponent api={api} />
				</React.Fragment>
			);
		},
		getSharedState: (editorState: EditorState | undefined) => {
			if (!editorState) {
				return {
					isDisplayingChanges: false,
					activeIndex: undefined,
					diffDescriptors: [],
				};
			}
			const pluginState = showDiffPluginKey.getState(editorState);
			const decorationCount = getScrollableDecorations(pluginState?.decorations, editorState.doc);
			return {
				isDisplayingChanges: decorationCount.length > 0,
				activeIndex: pluginState?.activeIndex,
				numberOfChanges: decorationCount.length,
				contributorTags: pluginState?.contributorTags,
				diffDescriptors: pluginState?.diffDescriptors,
				showIndicators: pluginState?.showIndicators,
			};
		},
	};
};
