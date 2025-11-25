import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';

import { DateNodeView } from '../nodeviews/DateNodeView';

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
		isInitialised: true,
	};

	return new SafePlugin({
		state: createPluginState(dispatch, newPluginState),
		key: pluginKey,
		props: {
			// @ts-ignore - Workaround for help-center local consumption

			nodeViews: {
				// @ts-ignore - Workaround for help-center local consumption

				date: (node, view, getPos, decorations) => {
					return new DateNodeView(node, view, getPos, pmPluginFactoryParams.getIntl(), decorations);
				},
			},
		},
	});
};

export { getPluginState };
export default createPlugin;
