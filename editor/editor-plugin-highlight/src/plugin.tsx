import React from 'react';

import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	Command,
	EditorCommand,
	FloatingToolbarCustom,
	NextEditorPlugin,
	OptionalPlugin,
	ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BackgroundColorPlugin } from '@atlaskit/editor-plugin-background-color';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { TextFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import { fg } from '@atlaskit/platform-feature-flags';

import { changeColor } from './commands';
import { keymapPlugin } from './pm-plugins/keymap';
import type { HighlightPluginState } from './pm-plugins/main';
import { createPlugin, highlightPluginKey } from './pm-plugins/main';
import { FloatingToolbarHighlightColorWithIntl as FloatingToolbarHighlightColor } from './ui/FloatingToolbarHighlightColor';
import { PrimaryToolbarHighlightColorWithIntl as PrimaryToolbarHighlightColor } from './ui/PrimaryToolbarHighlightColor';
import { ToolbarHighlightColorWithIntl as ToolbarHighlightColor } from './ui/ToolbarHighlightColor';

export type HighlightPluginOptions = {
	textHighlightingFloatingToolbarExperiment?: boolean;
};

export type HighlightPlugin = NextEditorPlugin<
	'highlight',
	{
		pluginConfiguration?: HighlightPluginOptions;
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
			changeColor: ({ color }: { color: string; inputMethod: INPUT_METHOD }) => EditorCommand;
		};
	}
>;

export const highlightPlugin: HighlightPlugin = ({ api, config: options }) => {
	const editorAnalyticsAPI = api?.analytics?.actions;

	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		disabled,
		isToolbarReducedSpacing,
		editorView,
	}) =>
		fg('platform.editor.refactor-highlight-toolbar_mo0pj') ? (
			<PrimaryToolbarHighlightColor
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				disabled={disabled}
				isToolbarReducedSpacing={isToolbarReducedSpacing}
				pluginInjectionApi={api}
				editorView={editorView}
			/>
		) : (
			<ToolbarHighlightColor
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				disabled={disabled}
				isToolbarReducedSpacing={isToolbarReducedSpacing}
				pluginInjectionApi={api}
				editorView={editorView}
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
				plugin: () =>
					createPlugin({
						api,
					}),
			},
			{
				name: 'highlightKeymap',
				plugin: () => keymapPlugin({ api }),
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

		pluginsOptions: {
			selectionToolbar() {
				if (!options?.textHighlightingFloatingToolbarExperiment) {
					return;
				}

				const toolbarCustom: FloatingToolbarCustom<Command> = {
					type: 'custom',
					render: (_view, _idx, dispatchAnalyticsEvent) => (
						<FloatingToolbarHighlightColor
							dispatchAnalyticsEvent={dispatchAnalyticsEvent}
							pluginInjectionApi={api}
						/>
					),
					fallback: [],
				};

				return {
					rank: -9,
					isToolbarAbove: true,
					items: [toolbarCustom],
				};
			},
		},

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,
	};
};
