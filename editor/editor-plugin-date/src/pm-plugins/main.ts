import { getInlineNodeViewProducer } from '@atlaskit/editor-common/react-node-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { DateNodeView } from '../nodeviews/date';
import { DateNodeView as DateNodeViewVanilla } from '../nodeviews/DateNodeView';

import { pluginKey } from './plugin-key';
import type { DatePluginState } from './types';
import { mapping, onSelectionChanged, reducer } from './utils';

const { createPluginState, getPluginState } = pluginFactory(pluginKey, reducer, {
	mapping,
	onSelectionChanged,
});

const createPlugin = (pmPluginFactoryParams: PMPluginFactoryParams) => {
	const { dispatch } = pmPluginFactoryParams;
	const newPluginState: DatePluginState = {
		showDatePickerAt: null,
		isNew: false,
		isDateEmpty: false,
		focusDateInput: false,
	};

	return new SafePlugin({
		state: createPluginState(dispatch, newPluginState),
		key: pluginKey,
		props: {
			nodeViews: {
				date: (node, view, getPos, decorations) => {
					if (editorExperiment('platform_editor_vanilla_dom', true, { exposure: true })) {
						return new DateNodeViewVanilla(
							node,
							view,
							getPos,
							pmPluginFactoryParams.getIntl(),
							decorations,
						);
					}
					return getInlineNodeViewProducer({
						pmPluginFactoryParams,
						Component: DateNodeView,
					})(node, view, getPos, decorations);
				},
			},
		},
	});
};

export { getPluginState };
export default createPlugin;
