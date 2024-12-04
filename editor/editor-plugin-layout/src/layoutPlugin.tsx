import React from 'react';

import { layoutColumn, layoutSection } from '@atlaskit/adf-schema';
import { layoutSectionWithSingleColumn } from '@atlaskit/adf-schema/schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { type EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	layoutMessages,
	toolbarInsertBlockMessages as messages,
} from '@atlaskit/editor-common/messages';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import {
	IconFiveColumnLayout,
	IconFourColumnLayout,
	IconLayout,
	IconThreeColumnLayout,
	IconTwoColumnLayout,
} from '@atlaskit/editor-common/quick-insert';
import type { FloatingToolbarConfig, PMPlugin } from '@atlaskit/editor-common/types';
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
import { buildToolbar } from './ui/toolbar';

export { pluginKey };

export const layoutPlugin: LayoutPlugin = ({ config: options = {}, api }) => ({
	name: 'layout',

	nodes() {
		return [
			{
				name: 'layoutSection',
				node: editorExperiment('advanced_layouts', true)
					? layoutSectionWithSingleColumn
					: layoutSection,
			},
			{ name: 'layoutColumn', node: layoutColumn },
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
					portalProviderAPI: PortalProviderAPI;
					eventDispatcher: EventDispatcher;
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
			const { pos, allowBreakout, addSidebarLayouts, allowSingleColumnLayout } = pluginKey.getState(
				state,
			) as LayoutState;
			if (pos !== null) {
				return buildToolbar(
					state,
					intl,
					pos,
					allowBreakout,
					addSidebarLayouts,
					allowSingleColumnLayout,
					api,
				);
			}
			return undefined;
		},
		quickInsert: ({ formatMessage }) =>
			editorExperiment('advanced_layouts', true)
				? [
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
								return tr;
							},
						},
					]
				: [
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
					],
	},
	contentComponent() {
		return editorExperiment('advanced_layouts', true) ? <GlobalStylesWrapper /> : null;
	},
});
