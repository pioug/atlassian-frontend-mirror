import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { UserIntent } from './types';

export const userIntentPluginKey: PluginKey = new PluginKey('userIntentPlugin');

type UserIntentPluginState = {
	currentUserIntent: UserIntent;
};

const initialState: UserIntentPluginState = {
	currentUserIntent: 'default',
};

type SetCurrentUserIntentMeta = {
	data: {
		currentUserIntent: UserIntent;
	};
	type: 'setCurrentUserIntent';
};

export const createPlugin = (): SafePlugin<UserIntentPluginState> => {
	return new SafePlugin<UserIntentPluginState>({
		key: userIntentPluginKey,
		state: {
			init() {
				return initialState;
			},
			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(userIntentPluginKey) as SetCurrentUserIntentMeta | undefined;

				if (meta) {
					// If the incoming currentUserIntent is the same as the existing one, return the existing state
					if (meta.data.currentUserIntent === currentPluginState.currentUserIntent) {
						return currentPluginState;
					}

					return { currentUserIntent: meta.data.currentUserIntent };
				}

				return currentPluginState;
			},
		},
	});
};
