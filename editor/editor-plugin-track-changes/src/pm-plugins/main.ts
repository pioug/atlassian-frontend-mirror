import { ChangeSet, simplifyChanges } from 'prosemirror-changeset';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep, type Step } from '@atlaskit/editor-prosemirror/transform';
import { type Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { createInlineChangedDecoration, createDeletedContentDecoration } from './decorations';
import { TOGGLE_TRACK_CHANGES_ACTION as ACTION } from './types';

export const trackChangesPluginKey = new PluginKey<TrackChangesPluginState>('trackChangesPlugin');

type TrackChangesPluginState = {
	shouldChangesBeDisplayed: boolean;
	isShowDiffAvailable: boolean;
	baselineDoc: PMNode;
	changes: ChangeSet;
};

export const createTrackChangesPlugin = () => {
	// Mark the state to be reset on next time the document has a meaningful change
	let resetBaseline = false;

	return new SafePlugin<TrackChangesPluginState>({
		key: trackChangesPluginKey,
		state: {
			init(_, { doc }) {
				return {
					changes: ChangeSet.create(doc),
					shouldChangesBeDisplayed: false,
					isShowDiffAvailable: false,
					baselineDoc: doc,
					numOfChanges: 0,
				};
			},
			apply(tr, state, oldState, newState) {
				const metadata = tr.getMeta(trackChangesPluginKey);
				if (metadata && metadata.action === ACTION.TOGGLE_TRACK_CHANGES) {
					resetBaseline = true;
					return {
						...state,
						shouldChangesBeDisplayed: !state.shouldChangesBeDisplayed,
					};
				}

				const isDocChanged =
					tr.docChanged &&
					tr.steps.some(
						(step: Step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep,
					);

				if (!isDocChanged || tr.getMeta('isRemote') || tr.getMeta('addToHistory') === false) {
					// If no document changes, return the old changeSet
					return state;
				}

				const changes = resetBaseline
					? ChangeSet.create(tr.docs[0]).addSteps(
							tr.doc, // The new document
							tr.mapping.maps, // The set of changes
							tr.docs[0].content, // The old document
						)
					: state.changes.addSteps(
							tr.doc, // The new document
							tr.mapping.maps, // The set of changes
							tr.docs[0].content, // The old document
						);
				const baselineDoc = resetBaseline ? tr.docs[0] : state.baselineDoc;
				resetBaseline = false;

				// Create a new ChangeSet based on document changes
				return {
					...state,
					baselineDoc,
					shouldChangesBeDisplayed: false,
					changes,
					isShowDiffAvailable: true,
				};
			},
		},
		props: {
			decorations: (state) => {
				const pluginState = trackChangesPluginKey.getState(state);
				if (!pluginState?.shouldChangesBeDisplayed || !pluginState.changes) {
					return undefined;
				}
				const decoration = DecorationSet.empty;
				const decorations: Decoration[] = [];
				const changes = simplifyChanges(pluginState.changes.changes, state.doc);
				const tr = state.tr;
				changes.forEach((change) => {
					if (change.inserted.length > 0) {
						decorations.push(createInlineChangedDecoration(change));
					}
					if (change.deleted.length > 0) {
						decorations.push(
							createDeletedContentDecoration({ change, doc: pluginState?.baselineDoc, tr }),
						);
					}
				});
				return decoration.add(tr.doc, decorations);
			},
		},
	});
};
