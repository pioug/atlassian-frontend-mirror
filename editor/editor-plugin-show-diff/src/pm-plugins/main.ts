// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { ChangeSet, simplifyChanges } from 'prosemirror-changeset';

import { processRawValue } from '@atlaskit/editor-common/process-raw-value';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	PluginKey,
	type EditorState,
	type ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { type Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { type DiffParams } from '../showDiffPluginType';

import { createInlineChangedDecoration, createDeletedContentDecoration } from './decorations';
import { getMarkChangeRanges } from './markDecorations';
import { NodeViewSerializer } from './NodeViewSerializer';

const calculateDecorations = ({
	state,
	pluginState,
	nodeViewSerializer,
}: {
	nodeViewSerializer: NodeViewSerializer;
	pluginState: Omit<ShowDiffPluginState, 'decorations'>;
	state: EditorState;
}): DecorationSet => {
	const { originalDoc, steps } = pluginState;
	if (!originalDoc || !pluginState.isDisplayingChanges) {
		return DecorationSet.empty;
	}

	const { tr } = state;
	let steppedDoc = originalDoc;

	let changeset = ChangeSet.create(originalDoc);
	for (const step of steps) {
		const result = step.apply(steppedDoc);
		if (result.failed === null && result.doc) {
			steppedDoc = result.doc;
			changeset = changeset.addSteps(steppedDoc, [step.getMap()], tr.doc);
		}
	}
	if (!steppedDoc.eq(tr.doc)) {
		return DecorationSet.empty;
	}
	const changes = simplifyChanges(changeset.changes, tr.doc);
	const decorations: Decoration[] = [];
	changes.forEach((change) => {
		if (change.inserted.length > 0) {
			decorations.push(createInlineChangedDecoration(change));
		}
		if (change.deleted.length > 0) {
			const decoration = createDeletedContentDecoration({
				change,
				doc: originalDoc,
				nodeViewSerializer,
			});
			if (decoration) {
				decorations.push(decoration);
			}
		}
	});
	getMarkChangeRanges(steps).forEach((change) => {
		decorations.push(createInlineChangedDecoration(change));
	});

	return DecorationSet.empty.add(tr.doc, decorations);
};

export const showDiffPluginKey = new PluginKey<ShowDiffPluginState>('showDiffPlugin');

type ShowDiffPluginState = {
	decorations: DecorationSet;
	isDisplayingChanges: boolean;
	originalDoc: PMNode | undefined;
	steps: ProseMirrorStep[];
};

type EditorStateConfig = Parameters<typeof EditorState.create>[0];

export const createPlugin = (config: DiffParams | undefined) => {
	const nodeViewSerializer = new NodeViewSerializer({});
	const setNodeViewSerializer = (editorView: EditorView) => {
		nodeViewSerializer.init({ editorView });
	};

	return new SafePlugin<ShowDiffPluginState>({
		key: showDiffPluginKey,
		state: {
			init(_: EditorStateConfig, state: EditorState) {
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
						};
						// Calculate and store decorations in state
						const decorations = calculateDecorations({
							state: newState,
							pluginState: newPluginState,
							nodeViewSerializer,
						});
						// Update the decorations
						newPluginState.decorations = decorations;
					} else if (meta?.action === 'HIDE_DIFF') {
						newPluginState = {
							...currentPluginState,
							...meta,
							decorations: DecorationSet.empty,
							isDisplayingChanges: false,
						};
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
