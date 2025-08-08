import React from 'react';

import { backgroundColor } from '@atlaskit/adf-schema';
import type {
	Command,
	FloatingToolbarCustom,
	ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { changeColor } from './editor-commands/change-color';
import type { HighlightPlugin } from './highlightPluginType';
import { keymapPlugin } from './pm-plugins/keymap';
import { createPlugin, highlightPluginKey } from './pm-plugins/main';
import { FloatingToolbarHighlightColorWithIntl as FloatingToolbarHighlightColor } from './ui/FloatingToolbarHighlightColor';
import { PrimaryToolbarHighlightColorWithIntl as PrimaryToolbarHighlightColor } from './ui/PrimaryToolbarHighlightColor';
import { getToolbarComponent } from './ui/toolbar-component';

export const highlightPlugin: HighlightPlugin = ({ api, config: options }) => {
	const editorAnalyticsAPI = api?.analytics?.actions;
	const isToolbarAifcEnabled = expValEquals('platform_editor_toolbar_aifc', 'isEnabled', true);

	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		disabled,
		isToolbarReducedSpacing,
		editorView,
	}) => {
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

	if (!isToolbarAifcEnabled) {
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

		pluginsOptions: !isToolbarAifcEnabled
			? {
					selectionToolbar() {
						const toolbarDocking = fg('platform_editor_use_preferences_plugin')
							? api?.userPreferences?.sharedState.currentState()?.preferences
									?.toolbarDockingPosition
							: api?.selectionToolbar?.sharedState?.currentState()?.toolbarDocking;

						if (
							toolbarDocking === 'none' &&
							editorExperiment('platform_editor_controls', 'variant1', { exposure: true })
						) {
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

							const rank = editorExperiment('platform_editor_controls', 'variant1') ? 5 : -9;

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
