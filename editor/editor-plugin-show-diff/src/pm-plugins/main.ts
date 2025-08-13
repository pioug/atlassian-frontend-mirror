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
import { type Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { type DiffParams } from '../showDiffPluginType';

import { createInlineChangedDecoration, createDeletedContentDecoration } from './decorations';
import { getMarkChangeRanges } from './markDecorations';

const calculateDecorations = ({
	state,
	pluginState,
}: {
	state: EditorState;
	pluginState: Omit<ShowDiffPluginState, 'decorations'>;
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
			decorations.push(createDeletedContentDecoration({ change, doc: originalDoc, tr }));
		}
	});
	getMarkChangeRanges(steps).forEach((change) => {
		decorations.push(createInlineChangedDecoration(change));
	});

	return DecorationSet.empty.add(tr.doc, decorations);
};

export const showDiffPluginKey = new PluginKey<ShowDiffPluginState>('showDiffPlugin');

type ShowDiffPluginState = {
	steps: ProseMirrorStep[];
	originalDoc: PMNode | undefined;
	decorations: DecorationSet;
	isDisplayingChanges: boolean;
};

type EditorStateConfig = Parameters<typeof EditorState.create>[0];

export const createPlugin = (config: DiffParams | undefined) => {
	return new SafePlugin<ShowDiffPluginState>({
		key: showDiffPluginKey,
		state: {
			init(_: EditorStateConfig, state: EditorState) {
				const schema = state.schema;
				const isDisplayingChanges = (config?.steps ?? []).length > 0;
				return {
					steps: (config?.steps ?? []).map((step) => ProseMirrorStep.fromJSON(schema, step)),
					originalDoc: config?.originalDoc
						? processRawValue(state.schema, config.originalDoc)
						: undefined,
					decorations: calculateDecorations({
						state,
						pluginState: {
							steps: [],
							originalDoc: config?.originalDoc
								? processRawValue(state.schema, config.originalDoc)
								: undefined,
							isDisplayingChanges,
						},
					}),
					isDisplayingChanges,
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
						newPluginState = {
							...currentPluginState,
							...meta,
							isDisplayingChanges: true,
						};
					} else if (meta?.action === 'HIDE_DIFF') {
						newPluginState = {
							...currentPluginState,
							...meta,
							isDisplayingChanges: false,
						};
					} else {
						newPluginState = { ...currentPluginState, ...meta };
					}
				}

				// Calculate and store decorations in state
				const decorations = calculateDecorations({
					state: newState,
					pluginState: {
						steps: newPluginState.steps,
						originalDoc: newPluginState.originalDoc,
						isDisplayingChanges: newPluginState.isDisplayingChanges,
					},
				});
				return {
					...newPluginState,
					decorations,
				};
			},
		},
		props: {
			decorations: (state: EditorState) => {
				const pluginState = showDiffPluginKey.getState(state);
				return pluginState?.decorations;
			},
		},
	});
};
