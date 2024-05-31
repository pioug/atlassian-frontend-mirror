import React from 'react';

import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
	ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BackgroundColorPlugin } from '@atlaskit/editor-plugin-background-color';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { TextFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';

import { changeColor } from './commands';
import type { HighlightPluginState } from './pm-plugin';
import { createPlugin, highlightPluginKey } from './pm-plugin';
import { ToolbarHighlightColorWithIntl as ToolbarHighlightColor } from './ui/ToolbarHighlightColor';

export type HighlightPlugin = NextEditorPlugin<
	'highlight',
	{
		dependencies: [
			// We need the mark to be defined before we can use the highlight functionality
			BackgroundColorPlugin,
			// Optional, we won't log analytics if it's not available
			OptionalPlugin<AnalyticsPlugin>,
			// Optional, used to allow clearing highlights when clear
			OptionalPlugin<TextFormattingPlugin>,
			// Optional, you can not have a primary toolbar
			OptionalPlugin<PrimaryToolbarPlugin>,
		];
		sharedState: HighlightPluginState | undefined;
		commands: {
			changeColor: ({ color }: { color: string }) => EditorCommand;
		};
	}
>;

export const highlightPlugin: HighlightPlugin = ({ api }) => {
	const editorAnalyticsAPI = api?.analytics?.actions;

	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		disabled,
		isToolbarReducedSpacing,
		dispatchAnalyticsEvent,
	}) => (
		<ToolbarHighlightColor
			popupsMountPoint={popupsMountPoint}
			popupsBoundariesElement={popupsBoundariesElement}
			popupsScrollableElement={popupsScrollableElement}
			disabled={disabled}
			isToolbarReducedSpacing={isToolbarReducedSpacing}
			dispatchAnalyticsEvent={dispatchAnalyticsEvent}
			pluginInjectionApi={api}
		/>
	);

	return {
		name: 'highlight',

		commands: {
			changeColor: changeColor(editorAnalyticsAPI),
		},

		pmPlugins: () => [
			{
				name: 'highlight',
				plugin: () => createPlugin({ api }),
			},
		],

		getSharedState(editorState) {
			if (!editorState) {
				return;
			}
			return highlightPluginKey.getState(editorState);
		},

		usePluginHook: () => {
			api?.core?.actions.execute(
				api?.primaryToolbar?.commands.registerComponent({
					name: 'highlight',
					component: primaryToolbarComponent,
				}),
			);
		},

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,
	};
};
