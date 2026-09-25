import React from 'react';

import type { EditorView } from 'prosemirror-view';

import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import {
	areAttributionColorGatesEnabled,
	resolveContributors,
} from './pm-plugins/decorations/colorSchemes/attributions';
import { getDeletedWidgets } from './pm-plugins/getDeletedWidgets';
import { getScrollableDecorations } from './pm-plugins/getScrollableDecorations';
import { createPlugin, showDiffPluginKey } from './pm-plugins/main';
import { resolveDiffContributors } from './pm-plugins/resolveDiffContributors';
import { beginReveal, cancelReveal } from './pm-plugins/revealAnimation';
import type { RevealOptions, ShowDiffParams, ShowDiffPlugin } from './showDiffPluginType';
import { IndicatorBarContentComponent } from './ui/IndicatorBar/IndicatorBarContentComponent';

const normalizeShowDiffParams = (params: ShowDiffParams | undefined) => {
	if (!params || !('stepsWithAttribution' in params)) {
		// Clear contributors to prevent leaking from attributed to unattributed diffs.
		return params ? { ...params, stepAttributions: [], contributors: undefined } : params;
	}

	const { stepsWithAttribution, contributorProfiles, ...rest } = params;

	return {
		...rest,
		// Resolve at boundary to keep contributor model and attribution format internal.
		contributors: areAttributionColorGatesEnabled()
			? resolveContributors(resolveDiffContributors(stepsWithAttribution, contributorProfiles))
			: undefined,
		steps: stepsWithAttribution.map(({ step }) => step),
		stepAttributions: stepsWithAttribution.map(({ stepAttribution }) => stepAttribution),
	};
};

const prefersReducedMotion = (): boolean =>
	typeof window !== 'undefined' &&
	typeof window.matchMedia === 'function' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Resolve reveal preconditions once here so decorations and animation share one answer. If
 * decorations think a reveal is happening but animation doesn't, highlight paints hidden forever.
 * All preconditions resolved here (not just gate) ensures "unable to animate" means "do not reveal".
 *
 * Umbrella experiment: within the AI streaming UX M1 population this behaviour is only enabled
 * for the treatment cohort. Non-AI callers (track-changes, etc.) are not enrolled and default
 * to `true`, preserving the pre-umbrella baseline.
 */
const resolveReveal = (
	reveal: RevealOptions | undefined,
	editorView: EditorView | undefined,
): RevealOptions | undefined =>
	// Gate first, so it is the primary switch and is always observable once a reveal is requested.
	reveal &&
	fg('platform_editor_diff_reveal_animation') &&
	UNSAFE_expValNoExposure('platform_editor_ai_streaming_ux_experience_m1', 'isEnabled', false) ===
		true &&
	editorView &&
	typeof window !== 'undefined' &&
	!prefersReducedMotion()
		? reveal
		: undefined;

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
					const reveal = resolveReveal(params?.reveal, editorView);

					// Capture snapshot BEFORE transaction dispatch (last moment outgoing DOM exists).
					if (reveal && editorView) {
						const view = editorView;
						beginReveal({
							editorView: view,
							reveal,
							onComplete: () => {
								// Repaint without the reveal so the decorations settle into their resting
								// style. Kept out of history: this is presentation, not an edit.
								view.dispatch(
									view.state.tr
										.setMeta(showDiffPluginKey, { action: 'REVEAL_COMPLETE' })
										.setMeta('addToHistory', false),
								);
							},
						});
					}

					return tr.setMeta(showDiffPluginKey, {
						...normalizeShowDiffParams(params),
						reveal,
						action: 'SHOW_DIFF',
					});
				},
			hideDiff: ({ tr }) => {
				if (editorView) {
					cancelReveal(editorView);
				}
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
