import React from 'react';

import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { CardPluginActions } from '@atlaskit/editor-common/card';
import { cardMessages as messages } from '@atlaskit/editor-common/messages';
import type { CardProvider, QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import {
	IconDatasourceAssetsObjects,
	IconDatasourceConfluenceSearch,
	IconDatasourceJiraIssue,
} from '@atlaskit/editor-common/quick-insert';
import type { NextEditorPlugin, OptionalPlugin, Command } from '@atlaskit/editor-common/types';
import { canRenderDatasource } from '@atlaskit/editor-common/utils';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { InlineCommentPluginState } from '@atlaskit/editor-plugin-annotation';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { GridPlugin } from '@atlaskit/editor-plugin-grid';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import {
	ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
	CONFLUENCE_SEARCH_DATASOURCE_ID,
} from '@atlaskit/link-datasource';

import { createEventsQueue } from './analytics/create-events-queue';
import type { CardPluginEvent } from './analytics/types';
import { hideLinkToolbar, setProvider, showDatasourceModal } from './pm-plugins/actions';
import { queueCardsFromChangedTr } from './pm-plugins/doc';
import { cardKeymap } from './pm-plugins/keymap';
import { createPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import { blockCardSpecWithFixedToDOM } from './toDOM-fixes/blockCard';
import { embedCardSpecWithFixedToDOM } from './toDOM-fixes/embedCard';
import { inlineCardSpecWithFixedToDOM } from './toDOM-fixes/inlineCard';
import { floatingToolbar, getEndingToolbarItems, getStartingToolbarItems } from './toolbar';
import type { CardPluginOptions, CardPluginState } from './types';
import DatasourceModalWithState from './ui/DatasourceModal/ModalWithState';
import { EditorLinkingPlatformAnalytics } from './ui/EditorLinkingPlatformAnalytics';
import { EditorSmartCardEvents } from './ui/EditorSmartCardEvents';
import LayoutButton from './ui/LayoutButton';
import { isDatasourceConfigEditable } from './utils';

// Dummpy type of AnnotationPlugin
// This is used to avoid editor universal preset's inferred type maximum length error
// TODO: Remove this when the issue is fixed
type DummyAnnotationPlugin = NextEditorPlugin<
	'annotation',
	{
		sharedState: InlineCommentPluginState;
		actions: {
			setInlineCommentDraftState: (isDraft: boolean, inputMethod: INPUT_METHOD) => Command;
		};
	}
>;

export type CardPlugin = NextEditorPlugin<
	'card',
	{
		pluginConfiguration: CardPluginOptions | undefined;
		dependencies: [
			OptionalPlugin<FeatureFlagsPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			WidthPlugin,
			DecorationsPlugin,
			GridPlugin,
			FloatingToolbarPlugin,
			OptionalPlugin<EditorDisabledPlugin>,
			OptionalPlugin<SelectionPlugin>,
			OptionalPlugin<DummyAnnotationPlugin>,
		];
		sharedState: CardPluginState | null;
		actions: CardPluginActions;
	}
>;

export const cardPlugin: CardPlugin = ({ config: options = {} as CardPluginOptions, api }) => {
	let previousCardProvider: CardProvider | undefined;
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
				{ name: 'inlineCard', node: inlineCardSpecWithFixedToDOM() },
				{ name: 'blockCard', node: blockCardSpecWithFixedToDOM() },
			];

			if (options.allowEmbeds) {
				nodes.push({
					name: 'embedCard',
					node: embedCardSpecWithFixedToDOM(),
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
			setProvider: async (providerPromise) => {
				const provider = await providerPromise;
				// Prevent someone trying to set the exact same provider twice for performance reasons
				if (previousCardProvider === provider || options?.provider === providerPromise) {
					return false;
				}
				previousCardProvider = provider;
				return api?.core.actions.execute(({ tr }) => setProvider(provider)(tr)) ?? false;
			},
			hideLinkToolbar,
			queueCardsFromChangedTr,
			getStartingToolbarItems: getStartingToolbarItems(options, api),
			getEndingToolbarItems: getEndingToolbarItems(options, api),
		},

		pluginsOptions: {
			floatingToolbar: floatingToolbar(
				options,
				options.lpLinkPicker ?? false,
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
						title: formatMessage(messages.datasourceAssetsObjectsGeneralAvailability),
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
