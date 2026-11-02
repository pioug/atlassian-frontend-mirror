import type { ContextPanelPluginOptions } from '@atlaskit/editor-plugin-context-panel/contextPanelPluginType';

interface Props {
	options:
		| {
				objectSideBar: ContextPanelPluginOptions['objectSideBar'];
		  }
		| undefined;
}

export function contextPanelPluginOptions({
	options,
}: Props): ContextPanelPluginOptions | undefined {
	if (!options) {
		return undefined;
	}

	return {
		objectSideBar: options.objectSideBar,
	};
}
