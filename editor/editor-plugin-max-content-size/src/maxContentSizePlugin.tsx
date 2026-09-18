import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { MaxContentSizePlugin, MaxContentSizePluginState } from './maxContentSizePluginType';

export const pluginKey: PluginKey<MaxContentSizePluginState> =
	new PluginKey<MaxContentSizePluginState>('maxContentSizePlugin');

export function createPlugin(dispatch: Dispatch, maxContentSize?: number): SafePlugin | undefined {
	if (!maxContentSize) {
		return;
	}

	let maxContentSizeReached = false;

	return new SafePlugin({
		state: {
			init: () => ({ maxContentSizeReached: false }),

			apply(tr, state) {
				const result = tr.doc && tr.doc.nodeSize > maxContentSize - 1;

				return {
					maxContentSizeReached: result,
				};
			},
		},
		key: pluginKey,
		filterTransaction(tr: Transaction): boolean {
			const result = tr.doc && tr.doc.nodeSize > maxContentSize;

			if (result || result !== maxContentSizeReached) {
				dispatch(pluginKey, { maxContentSizeReached: result });
			}

			maxContentSizeReached = result;

			if (isExperimentEnabled('platform_editor_max_content_size_allow_delete')) {
				// A document can load already over the limit, so only block transactions that grow it
				// further — otherwise there is no way to edit it back under the limit.
				return !result || tr.doc.nodeSize <= tr.before.nodeSize;
			}

			return !result;
		},
	});
}

const maxContentSizePlugin: MaxContentSizePlugin = ({ config: maxContentSize, api }) => {
	return {
		name: 'maxContentSize',
		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}

			return pluginKey.getState(editorState);
		},

		pmPlugins() {
			return [
				{
					name: 'maxContentSize',
					plugin: ({ dispatch }) => createPlugin(dispatch, maxContentSize),
				},
			];
		},
	};
};

export default maxContentSizePlugin;
