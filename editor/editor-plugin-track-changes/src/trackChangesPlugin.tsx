import React from 'react';

import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { keymapPlugin } from './pm-plugins/keymaps';
import { createTrackChangesPlugin, trackChangesPluginKey } from './pm-plugins/main';
import { TOGGLE_TRACK_CHANGES_ACTION as ACTION } from './pm-plugins/types';
import type { TrackChangesPlugin } from './trackChangesPluginType';
import { getToolbarComponents } from './ui/toolbar-components';
import { TrackChangesToolbarButton } from './ui/TrackChangesToolbarButton';

export const trackChangesPlugin: TrackChangesPlugin = ({ api, config: options }) => {
	const isToolbarAIFCEnabled = Boolean(api?.toolbar);

	const primaryToolbarComponent = () => {
		return <TrackChangesToolbarButton api={api} />;
	};

	if (options?.showOnToolbar === true) {
		if (isToolbarAIFCEnabled) {
			api?.toolbar?.actions.registerComponents(getToolbarComponents(api, options));
		} else {
			api?.primaryToolbar?.actions?.registerComponent({
				name: 'trackChanges',
				component: primaryToolbarComponent,
			});
		}
	}

	return {
		name: 'trackChanges',
		pmPlugins() {
			return [
				{
					name: 'trackChangesKeyMap',
					plugin: () => keymapPlugin(api),
				},
				{
					name: 'trackChangesPlugin',
					plugin: () => createTrackChangesPlugin(api),
				},
			];
		},
		commands: {
			toggleChanges: ({ tr }: { tr: Transaction }) => {
				return tr.setMeta(trackChangesPluginKey, {
					action: ACTION.TOGGLE_TRACK_CHANGES,
				});
			},
			resetBaseline: ({ tr }: { tr: Transaction }) => {
				if (!api?.trackChanges?.sharedState.currentState()?.isShowDiffAvailable) {
					return null;
				}
				return tr.setMeta(trackChangesPluginKey, {
					action: ACTION.RESET_BASELINE,
				});
			},
		},
		getSharedState: (editorState: EditorState | undefined) => {
			if (!editorState) {
				return {
					isDisplayingChanges: false,
					isShowDiffAvailable: false,
				};
			}
			return {
				isDisplayingChanges: Boolean(
					trackChangesPluginKey.getState(editorState)?.shouldChangesBeDisplayed,
				),
				isShowDiffAvailable: Boolean(
					trackChangesPluginKey.getState(editorState)?.isShowDiffAvailable,
				),
			};
		},
	};
};
