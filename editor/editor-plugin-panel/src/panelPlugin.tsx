import React from 'react';

import type { PanelAttributes } from '@atlaskit/adf-schema';
import { extendedPanel, extendedPanelWithLocalId, PanelType } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
	TRANSFORM_STRUCTURE_PANEL_MENU_ITEM,
	TRANSFORM_STRUCTURE_MENU_SECTION,
	TRANSFORM_STRUCTURE_MENU_SECTION_RANK,
} from '@atlaskit/editor-common/block-menu';
import { insertSelectedItem } from '@atlaskit/editor-common/insert';
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
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { createWrapSelectionTransaction } from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { T50 } from '@atlaskit/theme/colors';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { insertPanelWithAnalytics } from './editor-actions/actions';
import { type PanelPlugin } from './panelPluginType';
import keymap from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
import { createPanelBlockMenuItem } from './ui/panelBlockMenuItem';
import { getToolbarConfig } from './ui/toolbar';

const PANEL_NODE_NAME = 'panel';

const panelPlugin: PanelPlugin = ({ config: options = {}, api }) => {
	if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
		api?.blockMenu?.actions.registerBlockMenuComponents([
			{
				type: 'block-menu-item',
				key: TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key,
				parent: {
					type: 'block-menu-section' as const,
					key: TRANSFORM_STRUCTURE_MENU_SECTION.key,
					rank: TRANSFORM_STRUCTURE_MENU_SECTION_RANK[TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key],
				},
				component: createPanelBlockMenuItem(api),
				isHidden: () => Boolean(api?.blockMenu?.actions.isTransformOptionDisabled(PANEL_NODE_NAME)),
			},
		]);
	}

	return {
		name: 'panel',

		nodes() {
			if (fg('platform_editor_adf_with_localid')) {
				if (fg('platform_editor_ai_generic_prep_for_aifc_2')) {
					return [
						{
							name: 'panel',
							node: {
								...extendedPanelWithLocalId(!!options.allowCustomPanel),
								definingAsContext: true,
							},
						},
					];
				}
				return [{ name: 'panel', node: extendedPanelWithLocalId(!!options.allowCustomPanel) }];
			}
			return [{ name: 'panel', node: extendedPanel(!!options.allowCustomPanel) }];
		},

		pmPlugins() {
			return [
				{
					name: 'panel',
					plugin: ({ providerFactory, dispatch, nodeViewPortalProviderAPI }) =>
						createPlugin(dispatch, providerFactory, options, api, nodeViewPortalProviderAPI),
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
				if (expValEquals('platform_editor_fix_quick_insert_consistency_exp', 'isEnabled', true)) {
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
				} else {
					return insertPanelWithAnalytics(inputMethod, api?.analytics?.actions);
				}
			},
		},

		pluginsOptions: {
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
				if (options.allowCustomPanel && options.allowCustomPanelEdit) {
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
									panelColor: T50,
								},
								api,
								typeAheadInsert,
							});
						},
					});
				}
				return quickInsertOptions;
			},
			floatingToolbar: (state, intl, providerFactory) =>
				getToolbarConfig(state, intl, options, providerFactory, api),
		},
	};
};

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
	typeAheadInsert,
	inputMethod = INPUT_METHOD.QUICK_INSERT,
}: {
	api: ExtractInjectionAPI<PanelPlugin> | undefined;
	attributes: PanelAttributes;
	inputMethod?: INPUT_METHOD.INSERT_MENU | INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR;
	state: EditorState;
	typeAheadInsert?: QuickInsertActionInsert;
}) {
	const { panel } = state.schema.nodes;
	let tr;
	/*
		During investigation of go/j/ED-26928 I found that the behaviour of this experience was very
		inconsistent. I reached out to Nicole* for a design review, and she confirmed that the desired
		behaviour is to insert the panel on a new line if the selection is empty.
		 *Confluence Editor Lead Product Designer
	 */
	if (expValEquals('platform_editor_fix_quick_insert_consistency_exp', 'isEnabled', true)) {
		// If the selection is empty, we want to insert the panel on a new line
		if (state.selection.empty) {
			const node = panel.createAndFill({ ...attributes });

			if (!node) {
				return false;
			}

			if (typeAheadInsert !== undefined) {
				// If the type-ahead insert is provided, we should use that to insert the node
				tr = typeAheadInsert(node);
			} else {
				// Otherwise we can use insertSelectedItem to insert the node
				tr = insertSelectedItem(node)(state, state.tr, state.selection.head)?.scrollIntoView();
			}
		} else {
			tr = createWrapSelectionTransaction({
				state,
				type: panel,
				nodeAttributes: { ...attributes },
			});
		}
	} else {
		// Panels should wrap content by default when inserted, the quickInsert `insert` method
		// will insert the node on a newline
		if (editorExperiment('platform_editor_controls', 'variant1')) {
			tr =
				state.selection.empty &&
				createWrapSelectionTransaction({
					state,
					type: panel,
					nodeAttributes: { ...attributes },
				});
		} else {
			const node = panel.createAndFill({ ...attributes });

			if (!node) {
				return false;
			}
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- This is only optional within the experiment, so safe to assume non-null here
			tr = state.selection.empty && typeAheadInsert!(node);
		}
	}

	if (tr) {
		api?.analytics?.actions.attachAnalyticsEvent({
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.PANEL,
			attributes: {
				inputMethod,
				panelType: attributes.panelType,
			},
			eventType: EVENT_TYPE.TRACK,
		})(tr);
	}
	return tr ?? false;
}

export default panelPlugin;
