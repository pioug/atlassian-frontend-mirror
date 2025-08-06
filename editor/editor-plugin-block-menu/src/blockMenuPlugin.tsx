import React from 'react';

import type { BlockMenuPlugin } from './blockMenuPluginType';
import { createPlugin } from './pm-plugins/main';
import BlockMenu from './ui/block-menu';

export const blockMenuPlugin: BlockMenuPlugin = ({ api }) => ({
	name: 'blockMenu',

	pmPlugins() {
		return [
			{
				name: 'blockMenuPlugin',
				plugin: createPlugin,
			},
		];
	},

	contentComponent({
		editorView,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
	}) {
		return (
			<BlockMenu
				editorView={editorView}
				api={api}
				mountTo={popupsMountPoint}
				boundariesElement={popupsBoundariesElement}
				scrollableElement={popupsScrollableElement}
			/>
		);
	},
});
