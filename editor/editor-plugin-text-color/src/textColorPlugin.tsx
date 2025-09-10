import React from 'react';

import { textColor } from '@atlaskit/adf-schema';
import {
	type Command,
	type FloatingToolbarCustom,
	type ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { changeColor as changeColorCommand } from './editor-commands/change-color';
import { changeColor } from './pm-plugins/commands/change-color';
import type { TextColorPluginConfig } from './pm-plugins/main';
import { createPlugin, pluginKey as textColorPluginKey } from './pm-plugins/main';
import type { TextColorPlugin } from './textColorPluginType';
import type { TextColorInputMethod } from './types';
import { FloatingToolbarComponent } from './ui/FloatingToolbarComponent';
import { PrimaryToolbarComponent } from './ui/PrimaryToolbarComponent';
import { getToolbarComponents } from './ui/toolbar-components';

const pluginConfig = (
	textColorConfig?: TextColorPluginConfig | boolean,
): TextColorPluginConfig | undefined => {
	if (!textColorConfig || typeof textColorConfig === 'boolean') {
		return undefined;
	}

	return textColorConfig;
};

export const textColorPlugin: TextColorPlugin = ({ config: textColorConfig, api }) => {
	const isToolbarAIFCEnabled =
		Boolean(api?.toolbar) &&
		editorExperiment('platform_editor_toolbar_aifc', true, { exposure: true });

	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		editorView,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		isToolbarReducedSpacing,
		dispatchAnalyticsEvent,
		disabled,
	}) => {
		return (
			<PrimaryToolbarComponent
				isReducedSpacing={isToolbarReducedSpacing}
				editorView={editorView}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				dispatchAnalyticsEvent={dispatchAnalyticsEvent}
				disabled={disabled}
				api={api}
			/>
		);
	};

	if (isToolbarAIFCEnabled) {
		if (api?.toolbar?.actions.registerComponents) {
			api.toolbar.actions.registerComponents(getToolbarComponents(api));
		}
	} else {
		api?.primaryToolbar?.actions.registerComponent({
			name: 'textColor',
			component: primaryToolbarComponent,
		});
	}

	return {
		name: 'textColor',

		marks() {
			return [{ name: 'textColor', mark: textColor }];
		},

		pmPlugins() {
			return [
				{
					name: 'textColor',
					plugin: ({ dispatch }) => createPlugin(dispatch, pluginConfig(textColorConfig)),
				},
			];
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}
			return textColorPluginKey.getState(editorState);
		},

		actions: {
			changeColor: (color: string, inputMethod?: TextColorInputMethod) => {
				return changeColor(color, api?.analytics?.actions, inputMethod);
			},
		},

		commands: {
			changeColor: (color: string, inputMethod?: TextColorInputMethod) => {
				return changeColorCommand(color, api, inputMethod);
			},
		},

		pluginsOptions: !isToolbarAIFCEnabled
			? {
					selectionToolbar: () => {
						const toolbarDocking = fg('platform_editor_use_preferences_plugin')
							? api?.userPreferences?.sharedState?.currentState()?.preferences
									.toolbarDockingPosition
							: api?.selectionToolbar?.sharedState?.currentState()?.toolbarDocking;

						if (
							toolbarDocking === 'none' &&
							editorExperiment('platform_editor_controls', 'variant1', { exposure: true })
						) {
							const toolbarCustom: FloatingToolbarCustom<Command> = {
								type: 'custom',
								render: (view, _idx, dispatchAnalyticsEvent) => {
									if (!view) {
										return;
									}
									return (
										<FloatingToolbarComponent
											editorView={view}
											dispatchAnalyticsEvent={dispatchAnalyticsEvent}
											api={api}
										/>
									);
								},
								fallback: [],
							};

							return {
								isToolbarAbove: true,
								items: [toolbarCustom],
								rank: 6,
								pluginName: 'textColor',
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
