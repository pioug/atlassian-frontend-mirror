import React from 'react';

import { blockCard, embedCard, inlineCard } from '@atlaskit/adf-schema';
import type { CardPluginActions } from '@atlaskit/editor-common/card';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import {
  IconDatasourceAssetsObjects,
  IconDatasourceJiraIssue,
} from '@atlaskit/editor-common/quick-insert';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import { canRenderDatasource } from '@atlaskit/editor-common/utils';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { GridPlugin } from '@atlaskit/editor-plugin-grid';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import {
  ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
} from '@atlaskit/link-datasource';

import { createEventsQueue } from './analytics/create-events-queue';
import type { CardPluginEvent } from './analytics/types';
import { messages } from './messages';
import { hideLinkToolbar, showDatasourceModal } from './pm-plugins/actions';
import {
  changeSelectedCardToLink,
  queueCardsFromChangedTr,
  setSelectedCardAppearance,
} from './pm-plugins/doc';
import { cardKeymap } from './pm-plugins/keymap';
import { createPlugin } from './pm-plugins/main';
import { mountHyperlinkPlugin } from './pm-plugins/mountHyperlink';
import { pluginKey } from './pm-plugins/plugin-key';
import { floatingToolbar } from './toolbar';
import type { CardPluginOptions, CardPluginState } from './types';
import DatasourceModalWithState from './ui/DatasourceModal/ModalWithState';
import { EditorLinkingPlatformAnalytics } from './ui/EditorLinkingPlatformAnalytics';
import { EditorSmartCardEvents } from './ui/EditorSmartCardEvents';
import LayoutButton from './ui/LayoutButton';

export type CardPlugin = NextEditorPlugin<
  'card',
  {
    pluginConfiguration: CardPluginOptions;
    dependencies: [
      FeatureFlagsPlugin,
      OptionalPlugin<AnalyticsPlugin>,
      WidthPlugin,
      DecorationsPlugin,
      GridPlugin,
      FloatingToolbarPlugin,
      HyperlinkPlugin,
    ];
    sharedState: CardPluginState | null;
    actions: CardPluginActions;
  }
>;

/**
 * Card plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const cardPlugin: CardPlugin = ({ config: options, api }) => {
  const featureFlags = api?.featureFlags?.sharedState.currentState() || {};

  const cardPluginEvents = featureFlags?.lpAnalyticsEventsNext
    ? createEventsQueue<CardPluginEvent>()
    : undefined;

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
            },
            api,
          ),
        },
        {
          name: 'cardHyperlink',
          plugin: () => mountHyperlinkPlugin(api, options),
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
      return (
        <>
          <EditorSmartCardEvents editorView={editorView} />
          {cardPluginEvents && (
            <EditorLinkingPlatformAnalytics
              cardPluginEvents={cardPluginEvents}
              editorView={editorView}
            />
          )}
          <LayoutButton
            api={api}
            editorView={editorView}
            mountPoint={popupsMountPoint}
            scrollableElement={popupsScrollableElement}
            boundariesElement={popupsBoundariesElement}
          />
          <DatasourceModalWithState api={api} editorView={editorView} />
        </>
      );
    },

    actions: {
      hideLinkToolbar,
      queueCardsFromChangedTr,
      changeSelectedCardToLink,
      setSelectedCardAppearance,
    },

    pluginsOptions: {
      floatingToolbar: floatingToolbar(
        options,
        featureFlags,
        options.platform,
        options.linkPicker,
        api,
      ),
      quickInsert: ({ formatMessage }) => {
        const quickInsertArray: Array<QuickInsertItem> = [];
        if (!options.allowDatasource) {
          return quickInsertArray;
        }

        if (canRenderDatasource(JIRA_LIST_OF_LINKS_DATASOURCE_ID)) {
          quickInsertArray.push({
            id: 'datasource',
            title: formatMessage(messages.datasourceJiraIssue),
            description: formatMessage(messages.datasourceJiraIssueDescription),
            categories: ['external-content', 'development'],
            keywords: ['jira'],
            icon: () => <IconDatasourceJiraIssue />,
            action(insert) {
              const tr = insert(undefined);
              showDatasourceModal('jira')(tr);
              return tr;
            },
          });
        }

        if (canRenderDatasource(ASSETS_LIST_OF_LINKS_DATASOURCE_ID)) {
          quickInsertArray.push({
            id: 'datasource',
            title: formatMessage(messages.datasourceAssetsObjects),
            description: formatMessage(
              messages.datasourceAssetsObjectsDescription,
            ),
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

        return quickInsertArray;
      },
    },
  };
};
