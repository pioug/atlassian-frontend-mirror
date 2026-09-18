import React from 'react';

import { extendedPanel } from '@atlaskit/adf-schema/extended-panel';
import { extendedPanelC1 } from '@atlaskit/adf-schema/extended-panel-c1';
import { extendedPanelC1WithLocalId } from '@atlaskit/adf-schema/extended-panel-c1-with-local-id';
import { extendedPanelWithLocalId } from '@atlaskit/adf-schema/extended-panel-with-local-id';
import { PanelType } from '@atlaskit/adf-schema/panel';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	TRANSFORM_STRUCTURE_PANEL_MENU_ITEM,
	TRANSFORM_STRUCTURE_MENU_SECTION,
	TRANSFORM_STRUCTURE_MENU_SECTION_RANK,
} from '@atlaskit/editor-common/block-menu';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import {
	IconCustomPanel,
	IconPanel,
	IconPanelError,
	IconPanelNote,
	IconPanelSuccess,
	IconPanelWarning,
} from '@atlaskit/editor-common/quick-insert';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { PanelPlugin } from './panelPluginType';
import { createPanelAction } from './pm-plugins/commands/create-panel-action';
import keymap from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
import { createPanelBlockMenuItem } from './ui/panelBlockMenuItem';
import { getPanelQuickInsertComponents } from './ui/quick-insert/getPanelQuickInsertComponents';
import { getToolbarConfig } from './ui/toolbar';

const PANEL_NODE_NAME = 'panel';

const panelPlugin: PanelPlugin = ({
	config: { allowCustomPanel = false, allowCustomPanelEdit = false } = {},
	api,
}) => {
	api?.blockMenu?.actions.registerBlockMenuComponents([
		{
			type: 'block-menu-item',
			key: TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_STRUCTURE_MENU_SECTION.key,
				rank: (TRANSFORM_STRUCTURE_MENU_SECTION_RANK as Record<string, number>)[
					TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key
				],
			},
			component: createPanelBlockMenuItem(api),
			isHidden: () => Boolean(api?.blockMenu?.actions.isTransformOptionDisabled(PANEL_NODE_NAME)),
		},
	]);
	const isRegisteredSlashCommandEnabled = isExperimentEnabled('platform_editor_slash_command');
	if (isRegisteredSlashCommandEnabled) {
		api?.uiControlRegistry?.actions.register(
			getPanelQuickInsertComponents({ allowCustomPanel, allowCustomPanelEdit, api }),
		);
	}

	return {
		name: 'panel',

		nodes() {
			if (fg('platform_editor_adf_with_localid')) {
				return [
					{
						name: 'panel',
						node: {
							...extendedPanelWithLocalId(!!allowCustomPanel),
							definingAsContext: true,
						},
					},
					...(expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
						? [
								{
									name: 'panel_c1',
									node: {
										...extendedPanelC1WithLocalId(!!allowCustomPanel),
										definingAsContext: true,
									},
								},
							]
						: []),
				];
			}
			return [
				{ name: 'panel', node: extendedPanel(!!allowCustomPanel) },
				...(expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
					? [{ name: 'panel_c1', node: extendedPanelC1(!!allowCustomPanel) }]
					: []),
			];
		},

		pmPlugins() {
			return [
				{
					name: 'panel',
					plugin: ({ providerFactory, dispatch, nodeViewPortalProviderAPI }) =>
						createPlugin(
							dispatch,
							providerFactory,
							{ allowCustomPanel, allowCustomPanelEdit },
							api,
							nodeViewPortalProviderAPI,
						),
				},
				{
					name: 'panelKeyMap',
					plugin: () => keymap(),
				},
			];
		},

		actions: {
			insertPanel(
				inputMethod: INPUT_METHOD.INSERT_MENU | INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR,
			) {
				return function (state, dispatch) {
					const tr = createPanelAction({
						state,
						attributes: { panelType: PanelType.INFO },
						api,
						inputMethod,
					});

					if (!tr) {
						return false;
					}

					if (dispatch) {
						dispatch(tr);
					}

					return true;
				};
			},
		},

		pluginsOptions: {
			...(isRegisteredSlashCommandEnabled
				? {}
				: {
						quickInsert: ({ formatMessage }) => {
							const quickInsertOptions: QuickInsertItem[] = [
								{
									id: 'infopanel',
									title: formatMessage(blockTypeMessages.infoPanel),
									keywords: ['panel'],
									description: formatMessage(blockTypeMessages.infoPanelDescription),
									priority: 800,
									icon: () => <IconPanel />,
									action(typeAheadInsert, state) {
										return createPanelAction({
											state,
											attributes: { panelType: PanelType.INFO },
											api,
											typeAheadInsert,
										});
									},
								},
								{
									id: 'notepanel',
									title: formatMessage(blockTypeMessages.notePanel),
									description: formatMessage(blockTypeMessages.notePanelDescription),
									priority: 1000,
									icon: () => <IconPanelNote />,
									action(typeAheadInsert, state) {
										return createPanelAction({
											state,
											attributes: { panelType: PanelType.NOTE },
											api,
											typeAheadInsert,
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
									action(typeAheadInsert, state) {
										return createPanelAction({
											state,
											attributes: { panelType: PanelType.SUCCESS },
											api,
											typeAheadInsert,
										});
									},
								},
								{
									id: 'warningpanel',
									title: formatMessage(blockTypeMessages.warningPanel),
									description: formatMessage(blockTypeMessages.warningPanelDescription),
									priority: 1000,
									icon: () => <IconPanelWarning />,
									action(typeAheadInsert, state) {
										return createPanelAction({
											state,
											attributes: { panelType: PanelType.WARNING },
											api,
											typeAheadInsert,
										});
									},
								},
								{
									id: 'errorpanel',
									title: formatMessage(blockTypeMessages.errorPanel),
									description: formatMessage(blockTypeMessages.errorPanelDescription),
									priority: 1000,
									icon: () => <IconPanelError />,
									action(typeAheadInsert, state) {
										return createPanelAction({
											state,
											attributes: { panelType: PanelType.ERROR },
											api,
											typeAheadInsert,
										});
									},
								},
							];
							if (allowCustomPanel && allowCustomPanelEdit) {
								quickInsertOptions.push({
									id: 'custompanel',
									title: formatMessage(blockTypeMessages.customPanel),
									description: formatMessage(blockTypeMessages.customPanelDescription),
									priority: 1000,
									icon: () => <IconCustomPanel />,
									action(typeAheadInsert, state) {
										return createPanelAction({
											state,
											attributes: {
												panelType: PanelType.CUSTOM,
												panelIcon: ':rainbow:',
												panelIconId: '1f308',
												panelIconText: '🌈',
												// Ignored via go/ees007
												// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
												// TODO: https://product-fabric.atlassian.net/browse/DSP-7268
												// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
												panelColor: '#E6FCFF',
											},
											api,
											typeAheadInsert,
										});
									},
								});
							}
							return quickInsertOptions;
						},
					}),
			floatingToolbar: (state, intl, providerFactory) =>
				getToolbarConfig(
					state,
					intl,
					{ allowCustomPanel, allowCustomPanelEdit },
					providerFactory,
					api,
				),
		},
	};
};

export default panelPlugin;
