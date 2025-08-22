import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import type { applyChange } from './pm-plugins/transforms';
import type {
	HideObjectSidebar,
	HideObjectSidebarById,
	ShowObjectSidebar,
} from './types/object-siderbar-types';

export type ContextPanelPluginOptions = {
	objectSideBar: {
		closePanel: HideObjectSidebar;
		closePanelById: HideObjectSidebarById;
		showPanel: ShowObjectSidebar;
	};
};

export type ContextPanelPlugin = NextEditorPlugin<
	'contextPanel',
	{
		actions: {
			applyChange: typeof applyChange;
			closePanel?: ContextPanelPluginOptions['objectSideBar']['closePanel'];
			closePanelById?: ContextPanelPluginOptions['objectSideBar']['closePanelById'];
			showPanel?: ContextPanelPluginOptions['objectSideBar']['showPanel'];
		};
		pluginConfiguration: ContextPanelPluginOptions | undefined;
		sharedState: { contents: React.ReactNode[] | undefined } | undefined;
	}
>;
