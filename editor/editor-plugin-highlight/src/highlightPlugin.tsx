import React from 'react';

import { backgroundColor } from '@atlaskit/adf-schema/background-color';
import type { Command } from '@atlaskit/editor-common/types/command';
import type { FloatingToolbarCustom } from '@atlaskit/editor-common/types/floating-toolbar';
import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types/toolbar';

import { changeColor } from './editor-commands/change-color';
import type { HighlightPlugin } from './highlightPluginType';
import { createHighlightPaddingPlugin } from './pm-plugins/highlight-padding';
import { keymapPlugin } from './pm-plugins/keymap';
import { createPlugin, highlightPluginKey } from './pm-plugins/main';
import { FloatingToolbarHighlightColorWithIntl as FloatingToolbarHighlightColor } from './ui/FloatingToolbarHighlightColor';
import { PrimaryToolbarHighlightColorWithIntl as PrimaryToolbarHighlightColor } from './ui/PrimaryToolbarHighlightColor';
import { getToolbarComponent } from './ui/toolbar-component';

export const highlightPlugin: HighlightPlugin = ({ api }) => {
	const editorAnalyticsAPI = api?.analytics?.actions;
	const isToolbarAIFCEnabled = Boolean(api?.toolbar);

	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		disabled,
		isToolbarReducedSpacing,
		editorView,
	}) => {
		if (!editorView) {
			return null;
		}

		return (
			<PrimaryToolbarHighlightColor
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				disabled={disabled}
				isToolbarReducedSpacing={isToolbarReducedSpacing}
				pluginInjectionApi={api}
				editorView={editorView}
			/>
		);
	};

	if (!isToolbarAIFCEnabled) {
		api?.primaryToolbar?.actions.registerComponent({
			name: 'highlight',
			component: primaryToolbarComponent,
		});
	} else {
		api?.toolbar?.actions.registerComponents(getToolbarComponent(api));
	}

	return {
		name: 'highlight',

		marks() {
			return [{ name: 'backgroundColor', mark: backgroundColor }];
		},

		commands: {
			changeColor: changeColor(editorAnalyticsAPI),
		},

		pmPlugins: () => {
			const plugins = [
				{
					name: 'highlight',
					plugin: () => createPlugin(),
				},
				{
					name: 'highlightKeymap',
					plugin: () => keymapPlugin({ api }),
				},
				{
					name: 'highlightPadding',
					plugin: () => createHighlightPaddingPlugin(),
				},
			];
			return plugins;
		},
		getSharedState(editorState) {
			if (!editorState) {
				return;
			}
			return highlightPluginKey.getState(editorState);
		},

		pluginsOptions: !isToolbarAIFCEnabled
			? {
					selectionToolbar() {
						const toolbarDocking =
							api?.userPreferences?.sharedState.currentState()?.preferences?.toolbarDockingPosition;

						if (toolbarDocking === 'none') {
							const toolbarCustom: FloatingToolbarCustom<Command> = {
								type: 'custom',
								render: (view, _idx, dispatchAnalyticsEvent) => (
									<FloatingToolbarHighlightColor
										dispatchAnalyticsEvent={dispatchAnalyticsEvent}
										pluginInjectionApi={api}
										editorView={view}
									/>
								),
								fallback: [],
							};

							const rank = 5;

							return {
								rank,
								isToolbarAbove: true,
								items: [toolbarCustom],
								pluginName: 'highlight',
							};
						} else {
							return undefined;
						}
					},
				}
			: {},

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,
	};
};
