import type { FloatingToolbarPluginData } from '../../floatingToolbarPluginType';

import type { FloatingToolbarPluginAction } from './types';

export const reducer = (
	pluginState: FloatingToolbarPluginData,
	action: FloatingToolbarPluginAction,
): FloatingToolbarPluginData => {
	switch (action.type) {
		case 'SHOW_CONFIRM_DIALOG':
			return {
				...pluginState,
				confirmDialogForItem: action.data.buttonIndex,
				confirmDialogForItemOption: action.data.optionIndex,
			};

		case 'HIDE_CONFIRM_DIALOG':
			return {
				...pluginState,
				confirmDialogForItem: undefined,
			};

		default:
			return pluginState;
	}
};
