import type { IntlShape } from 'react-intl-next';

import { processRawValue } from '@atlaskit/editor-common/process-raw-value';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	PluginKey,
	type EditorState,
	type ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView, Decoration } from '@atlaskit/editor-prosemirror/view';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { type DiffParams, type ShowDiffPlugin } from '../showDiffPluginType';

import { calculateDiffDecorations } from './calculateDiffDecorations';
import { NodeViewSerializer } from './NodeViewSerializer';
import { scrollToActiveDecoration } from './scrollToActiveDecoration';

export const showDiffPluginKey = new PluginKey<ShowDiffPluginState>('showDiffPlugin');

export type ShowDiffPluginState = {
	activeIndex?: number;
	activeIndexPos?: { from: number; to: number };
	decorations: DecorationSet;
	isDisplayingChanges: boolean;
	originalDoc: PMNode | undefined;
	steps: ProseMirrorStep[];
};

type EditorStateConfig = Parameters<typeof EditorState.create>[0];

export const getScrollableDecorations = (set: DecorationSet | undefined): Decoration[] =>
	set?.find(
		undefined,
		undefined,
		(spec) => spec.key === 'diff-inline' || spec.key === 'diff-widget' || spec.key === 'diff-block',
	) ?? [];

export const createPlugin = (
	config: DiffParams | undefined,
	getIntl: () => IntlShape,
	api: ExtractInjectionAPI<ShowDiffPlugin> | undefined,
) => {
	const nodeViewSerializer = new NodeViewSerializer({});
	const setNodeViewSerializer = (editorView: EditorView) => {
		nodeViewSerializer.init({ editorView });
	};

	return new SafePlugin<ShowDiffPluginState>({
		key: showDiffPluginKey,
		state: {
			init(_: EditorStateConfig, _state: EditorState) {
				// We do initial setup after we setup the editor view
				return {
					steps: [],
					originalDoc: undefined,
					decorations: DecorationSet.empty,
					isDisplayingChanges: false,
				};
			},
			apply: (
				tr: ReadonlyTransaction,
				currentPluginState: ShowDiffPluginState,
				oldState: EditorState,
				newState: EditorState,
			) => {
				const meta = tr.getMeta(showDiffPluginKey);
				let newPluginState = currentPluginState;

				if (meta) {
					if (meta?.action === 'SHOW_DIFF') {
						// Update the plugin state with the new metadata
						newPluginState = {
							...currentPluginState,
							...meta,
							isDisplayingChanges: true,
							activeIndex: 0,
						};
						// Calculate and store decorations in state
						const decorations = calculateDiffDecorations({
							state: newState,
							pluginState: newPluginState,
							nodeViewSerializer,
							colorScheme: config?.colorScheme,
							intl: getIntl(),
							activeIndexPos: fg('platform_editor_show_diff_scroll_navigation')
								? newPluginState.activeIndexPos
								: undefined,
							api,
						});
						// Update the decorations
						newPluginState.decorations = decorations;
					} else if (meta?.action === 'HIDE_DIFF') {
						newPluginState = {
							...currentPluginState,
							...meta,
							decorations: DecorationSet.empty,
							isDisplayingChanges: false,
							activeIndex: undefined,
						};
					} else if (
						(meta?.action === 'SCROLL_TO_NEXT' || meta?.action === 'SCROLL_TO_PREVIOUS') &&
						fg('platform_editor_show_diff_scroll_navigation')
					) {
						// Update the active index in plugin state and recalculate decorations
						const decorations = getScrollableDecorations(currentPluginState.decorations);

						if (decorations.length > 0) {
							let nextIndex = currentPluginState.activeIndex ?? 0;
							if (meta.action === 'SCROLL_TO_NEXT') {
								nextIndex = (nextIndex + 1) % decorations.length;
							} else {
								nextIndex = (nextIndex - 1 + decorations.length) % decorations.length;
							}
							const activeDecoration = decorations[nextIndex];
							newPluginState = {
								...currentPluginState,
								activeIndex: nextIndex,
								activeIndexPos: activeDecoration
									? { from: activeDecoration.from, to: activeDecoration.to }
									: undefined,
							};
							// Recalculate decorations with the new active index
							const updatedDecorations = calculateDiffDecorations({
								state: newState,
								pluginState: newPluginState,
								nodeViewSerializer,
								colorScheme: config?.colorScheme,
								intl: getIntl(),
								activeIndexPos: newPluginState.activeIndexPos,
								api,
							});
							newPluginState.decorations = updatedDecorations;
						}
					} else {
						newPluginState = { ...currentPluginState, ...meta };
					}
				}

				return {
					...newPluginState,
					decorations: newPluginState.decorations.map(tr.mapping, tr.doc),
				};
			},
		},
		view(editorView: EditorView) {
			setNodeViewSerializer(editorView);
			let isFirst = true;
			let previousActiveIndex: number | undefined;
			return {
				update(view: EditorView) {
					// If we're using configuration to show diffs we initialise here once we setup the editor view
					if (config?.originalDoc && config?.steps && config.steps.length > 0 && isFirst) {
						isFirst = false;

						view.dispatch(
							view.state.tr.setMeta(showDiffPluginKey, {
								action: 'SHOW_DIFF',
								steps: config.steps.map((step) =>
									ProseMirrorStep.fromJSON(view.state.schema, step),
								),
								originalDoc: processRawValue(view.state.schema, config.originalDoc),
							}),
						);
					}

					// Check for any potential scroll side-effects
					if (fg('platform_editor_show_diff_scroll_navigation')) {
						const pluginState = showDiffPluginKey.getState(view.state);
						const activeIndexChanged =
							pluginState?.activeIndex !== undefined &&
							pluginState.activeIndex !== previousActiveIndex;
						previousActiveIndex = pluginState?.activeIndex;

						if (pluginState?.activeIndex && activeIndexChanged) {
							scrollToActiveDecoration(
								view,
								getScrollableDecorations(pluginState.decorations),
								pluginState.activeIndex,
							);
						}
					}
				},
			};
		},
		props: {
			decorations: (state: EditorState) => {
				const pluginState = showDiffPluginKey.getState(state);
				return pluginState?.decorations;
			},
		},
	});
};
