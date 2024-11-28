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
import type {
	FloatingToolbarConfig,
	NextEditorPlugin,
	OptionalPlugin,
	PMPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	createDefaultLayoutSection,
	createMultiColumnLayoutSection,
	insertLayoutColumnsWithAnalytics,
} from './actions';
import { default as createLayoutPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import { default as createLayoutResizingPlugin } from './pm-plugins/resizing';
import type { LayoutState } from './pm-plugins/types';
import { buildToolbar } from './toolbar';
import type { LayoutPluginOptions } from './types';
import { GlobalStylesWrapper } from './ui/global-styles';
import { isPreRelease2 } from './utils/preRelease';

export { pluginKey };

export type LayoutPlugin = NextEditorPlugin<
	'layout',
	{
		pluginConfiguration: LayoutPluginOptions | undefined;
		dependencies: [
			DecorationsPlugin,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<WidthPlugin>,
			OptionalPlugin<EditorDisabledPlugin>,
		];
		actions: {
			insertLayoutColumns: ReturnType<typeof insertLayoutColumnsWithAnalytics>;
		};
	}
>;

export const layoutPlugin: LayoutPlugin = ({ config: options = {}, api }) => ({
	name: 'layout',

	nodes() {
		return [
			{
				name: 'layoutSection',
				node: isPreRelease2() ? layoutSectionWithSingleColumn : layoutSection,
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
			fg('platform_editor_advanced_layouts_breakout_resizing')
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
			isPreRelease2()
				? [
						{
							id: 'twocolumnslayout',
							title: formatMessage(layoutMessages.twoColumns),
							description: formatMessage(messages.columnsDescription),
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
							title: formatMessage(layoutMessages.threeColumns),
							description: formatMessage(messages.columnsDescription),
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
							description: formatMessage(messages.columnsDescription),
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
							description: formatMessage(messages.columnsDescription),
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
		return isPreRelease2() ? <GlobalStylesWrapper /> : null;
	},
});
