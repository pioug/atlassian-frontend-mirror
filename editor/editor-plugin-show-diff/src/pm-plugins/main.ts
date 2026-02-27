import type { IntlShape } from 'react-intl-next';

import { processRawValue } from '@atlaskit/editor-common/process-raw-value';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	PluginKey,
	NodeSelection,
	TextSelection,
	type EditorState,
	type ReadonlyTransaction,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { type DiffParams } from '../showDiffPluginType';

import { calculateDiffDecorations } from './calculateDiffDecorations';
import { NodeViewSerializer } from './NodeViewSerializer';

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

export const createPlugin = (config: DiffParams | undefined, getIntl: () => IntlShape) => {
	const nodeViewSerializer = new NodeViewSerializer({});
	const setNodeViewSerializer = (editorView: EditorView) => {
		nodeViewSerializer.init({ editorView });
	};

	return new SafePlugin<ShowDiffPluginState>({
		key: showDiffPluginKey,
		appendTransaction(
			transactions: readonly Transaction[],
			oldState: EditorState,
			newState: EditorState,
		) {
			if (!fg('platform_editor_show_diff_scroll_navigation')) {
				return;
			}
			// Check if any transaction contains scroll actions
			const scrollTransaction = transactions.find(
				(tr) =>
					tr.getMeta(showDiffPluginKey)?.action === 'SCROLL_TO_NEXT' ||
					tr.getMeta(showDiffPluginKey)?.action === 'SCROLL_TO_PREVIOUS',
			);

			if (!scrollTransaction) {
				return;
			}

			const pluginState = showDiffPluginKey.getState(newState);
			if (!pluginState || pluginState.decorations.find().length === 0) {
				return;
			}

			const decorations = pluginState.decorations.find();
			const decoration = decorations[pluginState.activeIndex ?? 0];
			if (!decoration) {
				return;
			}

			const { from, to } = decoration;
			const $pos = newState.doc.resolve(from);
			const isNodeSelection =
				$pos.nodeAfter && $pos.nodeAfter.nodeSize === to - from && !$pos.nodeAfter.isInline;

			const tr = newState.tr;
			if (isNodeSelection) {
				tr.setSelection(NodeSelection.create(newState.doc, from));
			} else {
				tr.setSelection(TextSelection.create(newState.doc, from));
			}
			return tr.scrollIntoView();
		},
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
							colourScheme: config?.colourScheme,
							intl: getIntl(),
							activeIndexPos: fg('platform_editor_show_diff_scroll_navigation')
								? newPluginState.activeIndexPos
								: undefined,
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
						const decorations = currentPluginState.decorations.find();
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
								colourScheme: config?.colourScheme,
								intl: getIntl(),
								activeIndexPos: newPluginState.activeIndexPos,
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
