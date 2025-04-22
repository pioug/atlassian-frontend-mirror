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
	type: 'setCurrentUserIntent';
	data: {
		currentUserIntent: UserIntent;
	};
};

export const createPlugin = () => {
	return new SafePlugin<UserIntentPluginState>({
		key: userIntentPluginKey,
		state: {
			init() {
				return initialState;
			},
			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(userIntentPluginKey) as SetCurrentUserIntentMeta | undefined;

				if (meta) {
					return { currentUserIntent: meta.data.currentUserIntent };
				}

				return currentPluginState;
			},
		},
	});
};
