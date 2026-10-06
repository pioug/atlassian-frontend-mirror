import React from 'react';

import { breakout } from '@atlaskit/adf-schema/breakout';

import type { BreakoutPlugin } from './breakoutPluginType';
import { createResizingPlugin, resizingPluginKey } from './pm-plugins/resizing-plugin';
import { GuidelineLabel } from './ui/GuidelineLabel';

export const breakoutPlugin: BreakoutPlugin = ({ config: options, api }) => ({
	name: 'breakout',

	pmPlugins() {
		return [
			{
				name: 'breakout-resizing',
				plugin: ({ getIntl, nodeViewPortalProviderAPI }) =>
					createResizingPlugin(api, getIntl, nodeViewPortalProviderAPI, options),
			},
		];
	},

	marks() {
		return [{ name: 'breakout', mark: breakout }];
	},

	getSharedState(editorState) {
		if (!editorState) {
			return {
				breakoutNode: undefined,
			};
		}

		const resizingPluginState = resizingPluginKey.getState(editorState);

		if (!resizingPluginState) {
			return {
				breakoutNode: undefined,
				activeGuidelineKey: undefined,
			};
		}

		return resizingPluginState;
	},

	contentComponent({
		editorView,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
	}) {
		if (!editorView) {
			return null;
		}

		return (
			<GuidelineLabel
				api={api}
				editorView={editorView}
				mountPoint={popupsMountPoint}
				boundariesElement={popupsBoundariesElement}
				scrollableElement={popupsScrollableElement}
			/>
		);
	},
});
