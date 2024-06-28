import React from 'react';

import type { PanelAttributes } from '@atlaskit/adf-schema';
import { extendedPanel, PanelType } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type {
	QuickInsertActionInsert,
	QuickInsertItem,
} from '@atlaskit/editor-common/provider-factory';
import {
	IconCustomPanel,
	IconPanel,
	IconPanelError,
	IconPanelNote,
	IconPanelSuccess,
	IconPanelWarning,
} from '@atlaskit/editor-common/quick-insert';
import type {
	Command,
	ExtractInjectionAPI,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { T50 } from '@atlaskit/theme/colors';

import { insertPanelWithAnalytics } from './actions';
import keymap from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';
import type { PanelPluginOptions } from './types';

export type PanelPlugin = NextEditorPlugin<
	'panel',
	{
		pluginConfiguration: PanelPluginOptions | undefined;
		dependencies: [typeof decorationsPlugin, OptionalPlugin<typeof analyticsPlugin>];
		actions: {
			insertPanel: (inputMethod: INPUT_METHOD) => Command;
		};
	}
>;

const panelPlugin: PanelPlugin = ({ config: options = {}, api }) => ({
	name: 'panel',

	nodes() {
		const panelNode = extendedPanel(!!options.allowCustomPanel);

		return [{ name: 'panel', node: panelNode }];
	},

	pmPlugins() {
		return [
			{
				name: 'panel',
				plugin: ({ providerFactory, dispatch }) => createPlugin(dispatch, providerFactory, options),
			},
			{
				name: 'panelKeyMap',
				plugin: () => keymap(),
			},
		];
	},

	actions: {
		insertPanel(inputMethod: INPUT_METHOD) {
			return insertPanelWithAnalytics(inputMethod, api?.analytics?.actions);
		},
	},

	pluginsOptions: {
		quickInsert: ({ formatMessage }) => {
			let quickInsertOptions: QuickInsertItem[] = [
				{
					id: 'infopanel',
					title: formatMessage(blockTypeMessages.infoPanel),
					keywords: ['panel'],
					description: formatMessage(blockTypeMessages.infoPanelDescription),
					priority: options.getEditorFeatureFlags?.().platformEditorTypeaheadImprovedRelevancy
						? 200
						: 800,
					icon: () => <IconPanel />,
					action(insert, state) {
						return createPanelAction({
							state,
							attributes: { panelType: PanelType.INFO },
							api,
							insert,
						});
					},
				},
				{
					id: 'notepanel',
					title: formatMessage(blockTypeMessages.notePanel),
					description: formatMessage(blockTypeMessages.notePanelDescription),
					priority: 1000,
					icon: () => <IconPanelNote />,
					action(insert, state) {
						return createPanelAction({
							state,
							attributes: { panelType: PanelType.NOTE },
							api,
							insert,
						});
					},
				},
				{
					id: 'successpanel',
					title: formatMessage(blockTypeMessages.successPanel),
					description: formatMessage(blockTypeMessages.successPanelDescription),
					keywords: ['tip'],
					priority: 1000,
					icon: () => <IconPanelSuccess />,
					action(insert, state) {
						return createPanelAction({
							state,
							attributes: { panelType: PanelType.SUCCESS },
							api,
							insert,
						});
					},
				},
				{
					id: 'warningpanel',
					title: formatMessage(blockTypeMessages.warningPanel),
					description: formatMessage(blockTypeMessages.warningPanelDescription),
					priority: 1000,
					icon: () => <IconPanelWarning />,
					action(insert, state) {
						return createPanelAction({
							state,
							attributes: { panelType: PanelType.WARNING },
							api,
							insert,
						});
					},
				},
				{
					id: 'errorpanel',
					title: formatMessage(blockTypeMessages.errorPanel),
					description: formatMessage(blockTypeMessages.errorPanelDescription),
					priority: 1000,
					icon: () => <IconPanelError />,
					action(insert, state) {
						return createPanelAction({
							state,
							attributes: { panelType: PanelType.ERROR },
							api,
							insert,
						});
					},
				},
			];
			if (options.allowCustomPanel && options.allowCustomPanelEdit) {
				quickInsertOptions.push({
					id: 'custompanel',
					title: formatMessage(blockTypeMessages.customPanel),
					description: formatMessage(blockTypeMessages.customPanelDescription),
					priority: 1000,
					icon: () => <IconCustomPanel />,
					action(insert, state) {
						return createPanelAction({
							state,
							attributes: {
								panelType: PanelType.CUSTOM,
								panelIcon: ':rainbow:',
								panelIconId: '1f308',
								panelIconText: '🌈',
								// TODO: https://product-fabric.atlassian.net/browse/DSP-7268
								// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
								panelColor: T50,
							},
							api,
							insert,
						});
					},
				});
			}
			return quickInsertOptions;
		},
		floatingToolbar: (state, intl, providerFactory) =>
			getToolbarConfig(state, intl, options, providerFactory, api),
	},
});

/**
 * Creates panel action and wrap selection transaction with analytics for the panel insertion.
 *
 * @example
 * const tr = createPanelAction({
 *   state: editorState,
 *   attributes: { panelType: 'info' },
 * });
 * if (tr) {
 *   applyTransaction(tr);
 * }
 */
function createPanelAction({
	state,
	attributes,
	api,
	insert,
}: {
	state: EditorState;
	attributes: PanelAttributes;
	api: ExtractInjectionAPI<PanelPlugin> | undefined;
	insert: QuickInsertActionInsert;
}) {
	const { panel } = state.schema.nodes;
	const node = panel.createAndFill(attributes);

	if (!node) {
		return false;
	}

	const tr = state.selection.empty && insert(node);

	if (tr) {
		api?.analytics?.actions.attachAnalyticsEvent({
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.PANEL,
			attributes: {
				inputMethod: INPUT_METHOD.QUICK_INSERT,
				panelType: attributes.panelType,
			},
			eventType: EVENT_TYPE.TRACK,
		})(tr);
	}
	return tr;
}

export default panelPlugin;
