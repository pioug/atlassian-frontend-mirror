import React from 'react';

import {
	layoutColumn,
	layoutSection,
	layoutColumnWithLocalId,
	layoutSectionWithLocalId,
} from '@atlaskit/adf-schema';
import {
	layoutSectionWithSingleColumn,
	layoutSectionWithSingleColumnLocalId,
} from '@atlaskit/adf-schema/schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
	FORMAT_MENU_ITEM,
	FORMAT_LAYOUT_MENU_ITEM,
	FORMAT_NESTED_MENU_RANK,
	FORMAT_NESTED_MENU_RANK_REVISED,
} from '@atlaskit/editor-common/block-menu';
import { type EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	layoutMessages,
	toolbarInsertBlockMessages as messages,
} from '@atlaskit/editor-common/messages';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import {
	IconFiveColumnLayout,
	IconFourColumnLayout,
	IconLayout,
	IconOneColumnLayout,
	IconThreeColumnLayout,
	IconTwoColumnLayout,
} from '@atlaskit/editor-common/quick-insert';
import type { FloatingToolbarConfig, PMPlugin } from '@atlaskit/editor-common/types';
import { TextSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { findParentNode } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { LayoutPlugin } from './layoutPluginType';
import {
	createDefaultLayoutSection,
	createMultiColumnLayoutSection,
	insertLayoutColumnsWithAnalytics,
} from './pm-plugins/actions';
import { default as createLayoutPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import { default as createLayoutResizingPlugin } from './pm-plugins/resizing';
import type { LayoutState } from './pm-plugins/types';
import { GlobalStylesWrapper } from './ui/global-styles';
import { createLayoutBlockMenuItem } from './ui/LayoutBlockMenuItem';
import { buildToolbar } from './ui/toolbar';

/**
 * This function is used to set the selection into
 * the first paragraph of the first column of a layout section.
 * This function is only intended to be used after inserting a new layout section.
 * @param tr - transaction
 * @returns - transaction with the selection set to the first paragraph of the first column
 */
export const selectIntoLayoutSection = (tr: Transaction) => {
	if (!editorExperiment('single_column_layouts', true)) {
		return tr;
	}

	const { layoutSection, paragraph } = tr.doc.type.schema.nodes;
	const nodeWithPos = findParentNode((node) => node.type === layoutSection)(tr.selection);

	if (
		!nodeWithPos ||
		!nodeWithPos.node ||
		nodeWithPos.node.type.name !== 'layoutSection' ||
		nodeWithPos.node.firstChild?.firstChild?.type !== paragraph
	) {
		return tr;
	}

	// set text selection at the beginning of the layout section
	// will set the selection to the first column
	tr.setSelection(TextSelection.create(tr.doc, nodeWithPos.pos));
	return tr;
};

export const layoutPlugin: LayoutPlugin = ({ config: options = {}, api }) => {
	const allowAdvancedSingleColumnLayout =
		editorExperiment('advanced_layouts', true) &&
		editorExperiment('single_column_layouts', true, { exposure: true });

	if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
		api?.blockMenu?.actions.registerBlockMenuComponents([
			{
				type: 'block-menu-item',
				key: FORMAT_LAYOUT_MENU_ITEM.key,
				parent: {
					type: 'block-menu-section' as const,
					key: FORMAT_MENU_ITEM.key,
					rank: fg('platform_editor_block_menu_format_rank_revised')
						? FORMAT_NESTED_MENU_RANK_REVISED[FORMAT_LAYOUT_MENU_ITEM.key]
						: FORMAT_NESTED_MENU_RANK[FORMAT_LAYOUT_MENU_ITEM.key],
				},
				component: createLayoutBlockMenuItem(api),
			},
		]);
	}

	return {
		name: 'layout',

		nodes() {
			return [
				{
					name: 'layoutSection',
					node: editorExperiment('advanced_layouts', true)
						? fg('platform_editor_adf_with_localid')
							? layoutSectionWithSingleColumnLocalId
							: layoutSectionWithSingleColumn
						: fg('platform_editor_adf_with_localid')
							? layoutSectionWithLocalId
							: layoutSection,
				},
				{
					name: 'layoutColumn',
					node: fg('platform_editor_adf_with_localid') ? layoutColumnWithLocalId : layoutColumn,
				},
			];
		},

		pmPlugins() {
			const plugins = [
				{
					name: 'layout',
					plugin: () => createLayoutPlugin(options),
				},
			] as Array<PMPlugin>;

			if (
				(options.editorAppearance === 'full-page' || options.editorAppearance === 'full-width') &&
				api &&
				editorExperiment('advanced_layouts', true)
			) {
				plugins.push({
					name: 'layoutResizing',
					plugin: ({
						portalProviderAPI,
						eventDispatcher,
					}: {
						eventDispatcher: EventDispatcher;
						portalProviderAPI: PortalProviderAPI;
					}) => createLayoutResizingPlugin(options, api, portalProviderAPI, eventDispatcher),
				});
			}
			return plugins;
		},

		actions: {
			insertLayoutColumns: insertLayoutColumnsWithAnalytics(api?.analytics?.actions),
		},

		pluginsOptions: {
			floatingToolbar(state, intl): FloatingToolbarConfig | undefined {
				const { pos, allowBreakout, addSidebarLayouts, allowSingleColumnLayout, isResizing } =
					pluginKey.getState(state) as LayoutState;

				const shouldHideToolbar = isResizing && editorExperiment('single_column_layouts', true);

				if (pos !== null && !shouldHideToolbar) {
					return buildToolbar(
						state,
						intl,
						pos,
						allowBreakout,
						addSidebarLayouts,
						allowSingleColumnLayout,
						allowAdvancedSingleColumnLayout,
						api,
					);
				}
				return undefined;
			},
			quickInsert: ({ formatMessage }) => {
				const withInsertLayoutAnalytics = (tr: Transaction, columnCount?: number) => {
					api?.analytics?.actions?.attachAnalyticsEvent({
						action: ACTION.INSERTED,
						actionSubject: ACTION_SUBJECT.DOCUMENT,
						actionSubjectId: ACTION_SUBJECT_ID.LAYOUT,
						attributes: {
							inputMethod: INPUT_METHOD.QUICK_INSERT,
							columnCount,
						},
						eventType: EVENT_TYPE.TRACK,
					})(tr);

					return tr;
				};

				const advancedSingleColumnOption: QuickInsertItem[] = allowAdvancedSingleColumnLayout
					? [
							{
								id: 'onecolumnlayout',
								title: formatMessage(layoutMessages.singleColumnAdvancedLayout),
								description: formatMessage(messages.singleColumnsDescriptionAdvancedLayout),
								keywords: ['layout', 'column', 'section', 'single column'],
								priority: 1100,
								icon: () => <IconOneColumnLayout />,
								action(insert, state, _source) {
									const tr = insert(createMultiColumnLayoutSection(state, 1));
									if (fg('platform_editor_column_count_analytics')) {
										withInsertLayoutAnalytics(tr, 1);
									} else {
										withInsertLayoutAnalytics(tr);
									}

									selectIntoLayoutSection(tr);
									return tr;
								},
							},
						]
					: [];

				if (editorExperiment('advanced_layouts', true)) {
					if (editorExperiment('platform_editor_insertion', 'variant1')) {
						return [
							{
								id: 'threecolumnslayout',
								title: formatMessage(layoutMessages.threeColumnsAdvancedLayout),
								description: formatMessage(messages.columnsDescriptionAdvancedLayout, {
									numberOfColumns: 'three',
								}),
								keywords: ['layout', 'column', 'section', 'three column'],
								priority: 1100,
								icon: () => <IconThreeColumnLayout />,
								action(insert, state) {
									const tr = insert(createMultiColumnLayoutSection(state, 3));
									if (fg('platform_editor_column_count_analytics')) {
										withInsertLayoutAnalytics(tr, 3);
									} else {
										withInsertLayoutAnalytics(tr);
									}
									selectIntoLayoutSection(tr);
									return tr;
								},
							},
						];
					} else {
						return [
							...advancedSingleColumnOption,
							{
								id: 'twocolumnslayout',
								title: formatMessage(layoutMessages.twoColumnsAdvancedLayout),
								description: formatMessage(messages.columnsDescriptionAdvancedLayout, {
									numberOfColumns: 'two',
								}),
								keywords: ['layout', 'column', 'section', 'two column'],
								priority: 1100,
								icon: () => <IconTwoColumnLayout />,
								action(insert, state) {
									const tr = insert(createMultiColumnLayoutSection(state, 2));
									if (fg('platform_editor_column_count_analytics')) {
										withInsertLayoutAnalytics(tr, 2);
									} else {
										withInsertLayoutAnalytics(tr);
									}
									selectIntoLayoutSection(tr);
									return tr;
								},
							},
							{
								id: 'threecolumnslayout',
								title: formatMessage(layoutMessages.threeColumnsAdvancedLayout),
								description: formatMessage(messages.columnsDescriptionAdvancedLayout, {
									numberOfColumns: 'three',
								}),
								keywords: ['layout', 'column', 'section', 'three column'],
								priority: 1100,
								icon: () => <IconThreeColumnLayout />,
								action(insert, state) {
									const tr = insert(createMultiColumnLayoutSection(state, 3));
									if (fg('platform_editor_column_count_analytics')) {
										withInsertLayoutAnalytics(tr, 3);
									} else {
										withInsertLayoutAnalytics(tr);
									}
									selectIntoLayoutSection(tr);
									return tr;
								},
							},
							{
								id: 'fourcolumnslayout',
								title: formatMessage(layoutMessages.fourColumns),
								description: formatMessage(messages.columnsDescriptionAdvancedLayout, {
									numberOfColumns: 'four',
								}),
								keywords: ['layout', 'column', 'section', 'four column'],
								priority: 1100,
								icon: () => <IconFourColumnLayout />,
								action(insert, state) {
									const tr = insert(createMultiColumnLayoutSection(state, 4));
									if (fg('platform_editor_column_count_analytics')) {
										withInsertLayoutAnalytics(tr, 4);
									} else {
										withInsertLayoutAnalytics(tr);
									}
									selectIntoLayoutSection(tr);
									return tr;
								},
							},
							{
								id: 'fivecolumnslayout',
								title: formatMessage(layoutMessages.fiveColumns),
								description: formatMessage(messages.columnsDescriptionAdvancedLayout, {
									numberOfColumns: 'five',
								}),
								keywords: ['layout', 'column', 'section', 'five column'],
								priority: 1100,
								icon: () => <IconFiveColumnLayout />,
								action(insert, state) {
									const tr = insert(createMultiColumnLayoutSection(state, 5));
									if (fg('platform_editor_column_count_analytics')) {
										withInsertLayoutAnalytics(tr, 5);
									} else {
										withInsertLayoutAnalytics(tr);
									}
									selectIntoLayoutSection(tr);
									return tr;
								},
							},
						];
					}
				} else {
					return [
						{
							id: 'layout',
							title: formatMessage(messages.columns),
							description: formatMessage(messages.columnsDescription),
							keywords: ['column', 'section'],
							priority: 1100,
							icon: () => <IconLayout />,
							action(insert, state) {
								const tr = insert(createDefaultLayoutSection(state));
								api?.analytics?.actions?.attachAnalyticsEvent({
									action: ACTION.INSERTED,
									actionSubject: ACTION_SUBJECT.DOCUMENT,
									actionSubjectId: ACTION_SUBJECT_ID.LAYOUT,
									attributes: {
										inputMethod: INPUT_METHOD.QUICK_INSERT,
									},
									eventType: EVENT_TYPE.TRACK,
								})(tr);
								return tr;
							},
						},
					];
				}
			},
		},
		contentComponent() {
			return editorExperiment('advanced_layouts', true) ? <GlobalStylesWrapper /> : null;
		},
	};
};
