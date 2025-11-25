import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { UserIntent } from './types';

export const userIntentPluginKey = new PluginKey('userIntentPlugin');

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

export const createPlugin = () => {
	return new SafePlugin<UserIntentPluginState>({
		key: userIntentPluginKey,
		state: {
			// @ts-ignore - Workaround for help-center local consumption

			init() {
				return initialState;
			},
			// @ts-ignore - Workaround for help-center local consumption

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
