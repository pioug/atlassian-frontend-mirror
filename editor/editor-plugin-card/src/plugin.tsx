import React from 'react';

import { blockCard, embedCard, inlineCard } from '@atlaskit/adf-schema';
import type { CardPluginActions } from '@atlaskit/editor-common/card';
import { cardMessages as messages } from '@atlaskit/editor-common/messages';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import {
	IconDatasourceAssetsObjects,
	IconDatasourceConfluenceSearch,
	IconDatasourceJiraIssue,
} from '@atlaskit/editor-common/quick-insert';
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import { canRenderDatasource } from '@atlaskit/editor-common/utils';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { GridPlugin } from '@atlaskit/editor-plugin-grid';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import {
	ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
	CONFLUENCE_SEARCH_DATASOURCE_ID,
} from '@atlaskit/link-datasource';
import { fg } from '@atlaskit/platform-feature-flags';

import { createEventsQueue } from './analytics/create-events-queue';
import type { CardPluginEvent } from './analytics/types';
import { hideLinkToolbar, showDatasourceModal } from './pm-plugins/actions';
import { queueCardsFromChangedTr } from './pm-plugins/doc';
import { cardKeymap } from './pm-plugins/keymap';
import { createPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import { floatingToolbar, getEndingToolbarItems, getStartingToolbarItems } from './toolbar';
import type { CardPluginOptions, CardPluginState } from './types';
import DatasourceModalWithState from './ui/DatasourceModal/ModalWithState';
import { EditorLinkingPlatformAnalytics } from './ui/EditorLinkingPlatformAnalytics';
import { EditorSmartCardEvents } from './ui/EditorSmartCardEvents';
import LayoutButton from './ui/LayoutButton';
import { isDatasourceConfigEditable } from './utils';

export type CardPlugin = NextEditorPlugin<
	'card',
	{
		pluginConfiguration: CardPluginOptions;
		dependencies: [
			OptionalPlugin<FeatureFlagsPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			WidthPlugin,
			DecorationsPlugin,
			GridPlugin,
			FloatingToolbarPlugin,
			OptionalPlugin<EditorDisabledPlugin>,
		];
		sharedState: CardPluginState | null;
		actions: CardPluginActions;
	}
>;

export const cardPlugin: CardPlugin = ({ config: options, api }) => {
	const cardPluginEvents = createEventsQueue<CardPluginEvent>();

	return {
		name: 'card',

		getSharedState(editorState) {
			if (!editorState) {
				return null;
			}
			return pluginKey.getState(editorState) || null;
		},

		nodes() {
			const nodes = [
				{ name: 'inlineCard', node: inlineCard },
				{ name: 'blockCard', node: blockCard },
			];

			if (options.allowEmbeds) {
				nodes.push({
					name: 'embedCard',
					node: embedCard,
				});
			}

			return nodes;
		},

		pmPlugins() {
			const allowBlockCards = options.allowBlockCards ?? true;
			const allowResizing = options.allowResizing ?? true;
			const useAlternativePreloader = options.useAlternativePreloader ?? true;
			const allowWrapping = options.allowWrapping ?? true;
			const allowAlignment = options.allowAlignment ?? true;
			const allowDatasource = options.allowDatasource ?? false;
			const showUpgradeDiscoverability = options.showUpgradeDiscoverability ?? true;

			const plugins = [
				{
					name: 'card',
					plugin: createPlugin(
						{
							...options,
							allowBlockCards,
							allowResizing,
							useAlternativePreloader,
							allowWrapping,
							allowAlignment,
							allowDatasource,
							cardPluginEvents,
							showUpgradeDiscoverability,
						},
						api,
					),
				},
			];

			plugins.push({
				name: 'cardKeymap',
				plugin: ({ featureFlags }) => {
					return cardKeymap(featureFlags);
				},
			});

			return plugins;
		},

		contentComponent({
			editorView,
			popupsMountPoint,
			popupsScrollableElement,
			popupsBoundariesElement,
		}) {
			const breakoutEnabled = options.editorAppearance === 'full-page';
			return (
				<>
					<EditorSmartCardEvents editorView={editorView} />
					<EditorLinkingPlatformAnalytics
						cardPluginEvents={cardPluginEvents}
						editorView={editorView}
					/>
					{breakoutEnabled && (
						<LayoutButton
							api={api}
							editorView={editorView}
							mountPoint={popupsMountPoint}
							scrollableElement={popupsScrollableElement}
							boundariesElement={popupsBoundariesElement}
						/>
					)}
					<DatasourceModalWithState api={api} editorView={editorView} />
				</>
			);
		},

		actions: {
			hideLinkToolbar,
			queueCardsFromChangedTr,
			getStartingToolbarItems: getStartingToolbarItems(options, api),
			getEndingToolbarItems: getEndingToolbarItems(options, api),
		},

		pluginsOptions: {
			floatingToolbar: floatingToolbar(
				options,
				options.lpLinkPicker ?? false,
				options.platform,
				options.linkPicker,
				api,
				options.disableFloatingToolbar,
			),
			quickInsert: ({ formatMessage }) => {
				const quickInsertArray: Array<QuickInsertItem> = [];
				if (!options.allowDatasource) {
					return quickInsertArray;
				}

				quickInsertArray.push({
					id: 'datasource',
					title: formatMessage(messages.datasourceJiraIssue),
					description: formatMessage(messages.datasourceJiraIssueDescription),
					categories: ['external-content', 'development'],
					keywords: ['jira'],
					featured: true,
					icon: () => <IconDatasourceJiraIssue />,
					action(insert) {
						const tr = insert(undefined);
						showDatasourceModal('jira')(tr);
						return tr;
					},
				});

				if (canRenderDatasource(ASSETS_LIST_OF_LINKS_DATASOURCE_ID)) {
					quickInsertArray.push({
						id: 'datasource',
						title: fg('platform.linking-platform.datasource-assets_objects_remove_beta')
							? formatMessage(messages.datasourceAssetsObjectsGeneralAvailability)
							: formatMessage(messages.datasourceAssetsObjects),
						description: formatMessage(messages.datasourceAssetsObjectsDescription),
						categories: ['external-content', 'development'],
						keywords: ['assets'],
						icon: () => <IconDatasourceAssetsObjects />,
						action(insert) {
							const tr = insert(undefined);
							showDatasourceModal('assets')(tr);
							return tr;
						},
					});
				}

				if (isDatasourceConfigEditable(CONFLUENCE_SEARCH_DATASOURCE_ID)) {
					quickInsertArray.push({
						id: 'datasource',
						title: formatMessage(messages.datasourceConfluenceSearch),
						description: formatMessage(messages.datasourceConfluenceSearchDescription),
						categories: ['external-content', 'development'],
						keywords: ['confluence'],
						featured: true,
						icon: () => <IconDatasourceConfluenceSearch />,
						action(insert) {
							const tr = insert(undefined);
							showDatasourceModal('confluence-search')(tr);
							return tr;
						},
					});
				}

				return quickInsertArray;
			},
		},
	};
};
