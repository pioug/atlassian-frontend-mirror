import React from 'react';

import { status } from '@atlaskit/adf-schema';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconStatus } from '@atlaskit/editor-common/quick-insert';
import type {
	ExtractInjectionAPI,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type { UpdateStatus } from './actions';
import {
	commitStatusPicker,
	insertStatus,
	removeStatus,
	updateStatusWithAnalytics,
} from './actions';
import { keymapPlugin } from './pm-plugins/keymap';
import createStatusPlugin from './pm-plugins/plugin';
import { pluginKey } from './pm-plugins/plugin-key';
import type { StatusPluginOptions, StatusState } from './types';
import { ContentComponent } from './ui/ContentComponent';

export type StatusPlugin = NextEditorPlugin<
	'status',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
		pluginConfiguration: StatusPluginOptions | undefined;
		actions: {
			commitStatusPicker: typeof commitStatusPicker;
			updateStatus: UpdateStatus;
		};
		commands: {
			removeStatus: typeof removeStatus;
			insertStatus: ReturnType<typeof insertStatus>;
		};
		sharedState: StatusState | undefined;
	}
>;

const baseStatusPlugin: StatusPlugin = ({ config: options, api }) => ({
	name: 'status',

	nodes() {
		return [{ name: 'status', node: status }];
	},

	pmPlugins() {
		return [
			{
				name: 'status',
				plugin: (pmPluginFactoryParams) => createStatusPlugin(pmPluginFactoryParams, options),
			},
			{ name: 'statusKeymap', plugin: keymapPlugin },
		];
	},

	actions: {
		commitStatusPicker,
		updateStatus: updateStatusWithAnalytics(api?.analytics?.actions),
	},

	commands: {
		removeStatus,
		insertStatus: insertStatus(api?.analytics?.actions),
	},

	getSharedState(state) {
		if (!state) {
			return undefined;
		}
		const pluginState = pluginKey.getState(state);

		return pluginState
			? {
					isNew: pluginState.isNew,
					showStatusPickerAt: pluginState.showStatusPickerAt,
					focusStatusInput: pluginState.focusStatusInput,
				}
			: undefined;
	},

	contentComponent({
		editorView,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
	}) {
		const domAtPos = editorView.domAtPos.bind(editorView);

		return (
			<ContentComponent
				domAtPos={domAtPos}
				api={api}
				editorView={editorView}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
			/>
		);
	},
});

const decorateWithPluginOptions = (
	plugin: ReturnType<StatusPlugin>,
	options: StatusPluginOptions | undefined,
	api: ExtractInjectionAPI<StatusPlugin> | undefined,
) => {
	if (options?.menuDisabled === true) {
		return plugin;
	}
	plugin.pluginsOptions = {
		quickInsert: ({ formatMessage }) => [
			{
				id: 'status',
				title: formatMessage(messages.status),
				description: formatMessage(messages.statusDescription),
				priority: 700,
				keywords: ['lozenge'],
				icon: () => <IconStatus />,
				action(insert, state) {
					return (
						insertStatus(api?.analytics?.actions)(INPUT_METHOD.QUICK_INSERT)({ tr: state.tr }) ??
						state.tr
					);
				},
			},
		],
	};
	return plugin;
};

export const statusPlugin: StatusPlugin = ({ config: options, api }) =>
	decorateWithPluginOptions(baseStatusPlugin({ config: options, api }), options, api);
