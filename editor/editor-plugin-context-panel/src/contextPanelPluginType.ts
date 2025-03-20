import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import type { applyChange } from './pm-plugins/transforms';
import type {
	HideObjectSidebar,
	HideObjectSidebarById,
	ShowObjectSidebar,
} from './types/object-siderbar-types';

export type ContextPanelPluginOptions = {
	objectSideBar: {
		showPanel: ShowObjectSidebar;
		closePanel: HideObjectSidebar;
		closePanelById: HideObjectSidebarById;
	};
};

export type ContextPanelPlugin = NextEditorPlugin<
	'contextPanel',
	{
		pluginConfiguration: ContextPanelPluginOptions | undefined;
		actions: {
			applyChange: typeof applyChange;
			showPanel?: ContextPanelPluginOptions['objectSideBar']['showPanel'];
			closePanel?: ContextPanelPluginOptions['objectSideBar']['closePanel'];
			closePanelById?: ContextPanelPluginOptions['objectSideBar']['closePanelById'];
		};
		sharedState: { contents: React.ReactNode[] | undefined } | undefined;
	}
>;
