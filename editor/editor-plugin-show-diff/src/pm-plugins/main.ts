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

import type { DiffParams } from '../showDiffPluginType';

import { createInlineChangedDecoration, createDeletedContentDecoration } from './decorations';

export const showDiffPluginKey = new PluginKey<ShowDiffPluginState>('showDiffPlugin');

type ShowDiffPluginState = {
	steps: ProseMirrorStep[];
	originalDoc: PMNode | undefined;
};

type EditorStateConfig = Parameters<typeof EditorState.create>[0];

export const createPlugin = (config: DiffParams | undefined) => {
	return new SafePlugin<ShowDiffPluginState>({
		key: showDiffPluginKey,
		state: {
			init(_: EditorStateConfig, state: EditorState) {
				const schema = state.schema;
				return {
					steps: (config?.steps ?? []).map((step) => ProseMirrorStep.fromJSON(schema, step)),
					originalDoc: config?.originalDoc
						? processRawValue(state.schema, config.originalDoc)
						: undefined,
				};
			},
			apply: (tr: ReadonlyTransaction, currentPluginState: ShowDiffPluginState) => {
				const meta = tr.getMeta(showDiffPluginKey);
				if (meta) {
					return meta;
				}
				return currentPluginState;
			},
		},
		props: {
			decorations: (state: EditorState) => {
				const pluginState = showDiffPluginKey.getState(state);
				if (!pluginState) {
					return undefined;
				}
				const { originalDoc, steps } = pluginState;
				if (!originalDoc) {
					return undefined;
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
					return undefined;
				}
				const changes = simplifyChanges(changeset.changes, tr.doc);
				const decoration = DecorationSet.empty;
				const decorations: Decoration[] = [];
				changes.forEach((change) => {
					if (change.inserted.length > 0) {
						decorations.push(createInlineChangedDecoration(change));
					}
					if (change.deleted.length > 0) {
						decorations.push(createDeletedContentDecoration({ change, doc: originalDoc, tr }));
					}
				});
				return decoration.add(tr.doc, decorations);
			},
		},
	});
};
