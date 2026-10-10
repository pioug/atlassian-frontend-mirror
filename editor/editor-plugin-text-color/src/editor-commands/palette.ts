import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';

import { pluginKey, ACTIONS } from '../pm-plugins/main';
import type { TextColorPlugin } from '../textColorPluginType';

export const togglePalette =
	(api: ExtractInjectionAPI<TextColorPlugin> | undefined): EditorCommand =>
	({ tr }) => {
		const pluginState = api?.textColor.sharedState.currentState();
		const isPaletteOpen = pluginState?.isPaletteOpen;
		tr.setMeta(pluginKey, { action: ACTIONS.SET_PALETTE, isPaletteOpen: !isPaletteOpen });
		return tr;
	};

export const setPalette =
	(isPaletteOpen: boolean): EditorCommand =>
	({ tr }) => {
		tr.setMeta(pluginKey, { action: ACTIONS.SET_PALETTE, isPaletteOpen });
		return tr;
	};
