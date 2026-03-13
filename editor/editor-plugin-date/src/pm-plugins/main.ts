import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { EditorState, SafeStateField } from '@atlaskit/editor-prosemirror/state';

import { DateNodeView } from '../nodeviews/DateNodeView';

import { pluginKey } from './plugin-key';
import type { DatePluginState } from './types';
import { mapping, onSelectionChanged, reducer } from './utils';

const dest = pluginFactory(pluginKey, reducer, {
	mapping,
	onSelectionChanged,
});
const createPluginState: (
	dispatch: Dispatch,
	initialState: DatePluginState | ((state: EditorState) => DatePluginState),
) => SafeStateField<DatePluginState> = dest.createPluginState;
const getPluginState: (state: EditorState) => DatePluginState = dest.getPluginState;

const createPlugin = (
	pmPluginFactoryParams: PMPluginFactoryParams,
): SafePlugin<DatePluginState> => {
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
			nodeViews: {
				date: (node, view, getPos, decorations) => {
					return new DateNodeView(node, view, getPos, pmPluginFactoryParams.getIntl(), decorations);
				},
			},
		},
	});
};

export { getPluginState };
export default createPlugin;
