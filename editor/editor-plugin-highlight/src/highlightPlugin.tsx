import React from 'react';

import { backgroundColor } from '@atlaskit/adf-schema';
import type {
	Command,
	FloatingToolbarCustom,
	ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { changeColor } from './editor-commands/change-color';
import type { HighlightPlugin } from './highlightPluginType';
import { keymapPlugin } from './pm-plugins/keymap';
import { createPlugin, highlightPluginKey } from './pm-plugins/main';
import { FloatingToolbarHighlightColorWithIntl as FloatingToolbarHighlightColor } from './ui/FloatingToolbarHighlightColor';
import { PrimaryToolbarHighlightColorWithIntl as PrimaryToolbarHighlightColor } from './ui/PrimaryToolbarHighlightColor';

export const highlightPlugin: HighlightPlugin = ({ api, config: options }) => {
	const editorAnalyticsAPI = api?.analytics?.actions;

	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		disabled,
		isToolbarReducedSpacing,
		editorView,
	}) => (
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
	api?.primaryToolbar?.actions.registerComponent({
		name: 'highlight',
		component: primaryToolbarComponent,
	});

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

		pluginsOptions: {
			selectionToolbar() {
				if (
					!options?.textHighlightingFloatingToolbarExperiment &&
					editorExperiment('contextual_formatting_toolbar', false, { exposure: true })
				) {
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

				const rank = editorExperiment('contextual_formatting_toolbar', true) ? 5 : -9;

				return {
					rank,
					isToolbarAbove: true,
					items: [toolbarCustom],
					pluginName: 'highlight',
				};
			},
		},

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,
	};
};
