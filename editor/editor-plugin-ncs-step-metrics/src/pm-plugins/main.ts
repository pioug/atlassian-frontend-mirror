import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const ncsStepMetricsPluginKey = new PluginKey('ncsStepMetricsPlugin');

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type NcsStepMetricsPluginState = {};

export const createPlugin = () => {
	return new SafePlugin<NcsStepMetricsPluginState>({
		key: ncsStepMetricsPluginKey,
		state: {
			init() {
				return {};
			},
			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(ncsStepMetricsPluginKey);
				if (meta) {
					return meta;
				}
				return currentPluginState;
			},
		},
	});
};
