import React from 'react';

import { layoutColumn, layoutSection } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconLayout } from '@atlaskit/editor-common/quick-insert';
import type {
	FloatingToolbarConfig,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';

import { createDefaultLayoutSection, insertLayoutColumnsWithAnalytics } from './actions';
import { default as createLayoutPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import type { LayoutState } from './pm-plugins/types';
import { buildToolbar } from './toolbar';
import type { LayoutPluginOptions } from './types';

export { pluginKey };

export type LayoutPlugin = NextEditorPlugin<
	'layout',
	{
		pluginConfiguration: LayoutPluginOptions | undefined;
		dependencies: [DecorationsPlugin, OptionalPlugin<AnalyticsPlugin>];
		actions: {
			insertLayoutColumns: ReturnType<typeof insertLayoutColumnsWithAnalytics>;
		};
	}
>;

export const layoutPlugin: LayoutPlugin = ({ config: options = {}, api }) => ({
	name: 'layout',

	nodes() {
		return [
			{ name: 'layoutSection', node: layoutSection },
			{ name: 'layoutColumn', node: layoutColumn },
		];
	},

	pmPlugins() {
		return [
			{
				name: 'layout',
				plugin: () => createLayoutPlugin(options),
			},
		];
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
		quickInsert: ({ formatMessage }) => [
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
});
