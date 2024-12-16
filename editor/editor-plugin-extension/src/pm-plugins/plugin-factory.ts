import { pluginFactory } from '@atlaskit/editor-common/utils';

import type { ExtensionState } from '../extensionPluginType';

import { pluginKey } from './plugin-key';
import reducer from './reducer';

const factory = pluginFactory(pluginKey, reducer, {
	mapping(tr, state) {
		const { positions: previousPositions } = state as ExtensionState;
		if (!previousPositions) {
			return state;
		}

		const positions = { ...previousPositions };
		// eslint-disable-next-line guard-for-in
		for (const key in positions) {
			positions[key] = tr.mapping.map(positions[key]);
		}

		return {
			...state,
			positions,
		};
	},
});

export const createPluginState = factory.createPluginState;
export const createCommand = factory.createCommand;
export const getPluginState = factory.getPluginState;
