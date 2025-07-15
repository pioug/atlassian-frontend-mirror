import { ChangeSet, simplifyChanges } from 'prosemirror-changeset';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

import { TOGGLE_TRACK_CHANGES_ACTION as ACTION } from './types';

export const trackChangesPluginKey = new PluginKey('trackChangesPlugin');

type TrackChangesPluginState = {
	shouldChangesBeDispalyed: boolean;
	baselineDoc: PMNode;
	changes: ChangeSet;
};

export const createTrackChangesPlugin = () => {
	return new SafePlugin<TrackChangesPluginState>({
		key: trackChangesPluginKey,
		state: {
			init(_, { doc }) {
				return {
					changes: ChangeSet.create(doc),
					shouldChangesBeDispalyed: false,
					baselineDoc: doc,
					numOfChanges: 0,
				};
			},
			apply(tr, state, oldState, newState) {
				const metadata = tr.getMeta(trackChangesPluginKey);
				if (metadata) {
					if (metadata.action === ACTION.TOGGLE_TRACK_CHANGES) {
						return {
							...state,
							baselineDoc: state.shouldChangesBeDispalyed ? tr.doc : state.baselineDoc,
							shouldChangesBeDispalyed: !state.shouldChangesBeDispalyed,
							changes: state.shouldChangesBeDispalyed ? ChangeSet.create(tr.doc) : state.changes,
						};
					}
				}

				if (!tr.docChanged || tr.getMeta('isRemote')) {
					// If no document changes, return the old changeSet
					return state;
				}

				// Create a new ChangeSet based on document changes
				return {
					...state,
					shouldChangesBeDispalyed: false,
					changes: state.changes.addSteps(
						tr.doc, // The new document
						tr.mapping.maps, // The set of changes
						tr.docs[0].content, // The old document
					),
				};
			},
		},
		props: {
			decorations: (state) => {
				const pluginState = trackChangesPluginKey.getState(state);
				if (pluginState && pluginState.shouldChangesBeDispalyed && pluginState.changes) {
					const decoration = DecorationSet.empty;
					const decorations: Decoration[] = [];
					const changes = simplifyChanges(pluginState.changes.changes, state.doc);
					const tr = state.tr;
					changes.forEach((change) => {
						if (change.inserted.length > 0) {
							const style = convertToInlineCss({
								background: token('color.background.accent.purple.subtlest'),
								textDecoration: 'underline',
								textDecorationStyle: 'dotted',
								textDecorationThickness: token('space.025'),
								textDecorationColor: token('color.border.accent.purple'),
							});

							// Inline decoration used for insertions as the content already exists in the document
							// and we just want to style it.
							const insertionInlineDecoration = Decoration.inline(
								change.fromB,
								change.toB,
								{
									style,
								},
								{},
							);
							decorations.push(insertionInlineDecoration);
						}
						if (change.deleted.length > 0) {
							const dom = document.createElement('span');
							const style = convertToInlineCss({
								color: token('color.text.accent.gray'),
								textDecoration: 'line-through',
							});
							dom.setAttribute('style', style);
							dom.appendChild(
								DOMSerializer.fromSchema(tr.doc.type.schema).serializeFragment(
									pluginState?.baselineDoc.slice(change.fromA, change.toA).content,
								),
							);

							// Widget decoration used for deletions as the content is not in the document
							// and we want to display the deleted content with a style.
							const deletionWidgetDecoration = Decoration.widget(change.fromB, dom, {
								marks: [],
							});

							decorations.push(deletionWidgetDecoration);
						}
					});
					return decoration.add(tr.doc, decorations);
				}
				return undefined;
			},
		},
	});
};
