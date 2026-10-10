import type { PanelPluginOptions } from '@atlaskit/editor-plugin-panel/panel-plugin-type';

interface Props {
	options: never;
}

export function panelPluginOptions({}: Props): PanelPluginOptions {
	return {
		useLongPressSelection: false,
		allowCustomPanel: true,
		allowCustomPanelEdit: true,
	};
}
