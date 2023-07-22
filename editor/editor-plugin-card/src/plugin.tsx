import React from 'react';

import { blockCard, embedCard, inlineCard } from '@atlaskit/adf-schema';
import type { CardPluginActions } from '@atlaskit/editor-common/card';
import { IconDatasourceJiraIssue } from '@atlaskit/editor-common/quick-insert';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import { canRenderDatasource } from '@atlaskit/editor-common/utils';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { gridPlugin } from '@atlaskit/editor-plugin-grid';
import type { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import type { widthPlugin } from '@atlaskit/editor-plugin-width';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource';

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
import { EditorSmartCardEvents } from './ui/EditorSmartCardEvents';
import { EditorSmartCardEventsNext } from './ui/EditorSmartCardEventsNext';
import LayoutButton from './ui/LayoutButton';

export const cardPlugin: NextEditorPlugin<
  'card',
  {
    pluginConfiguration: CardPluginOptions;
    dependencies: [
      typeof featureFlagsPlugin,
      OptionalPlugin<typeof analyticsPlugin>,
      typeof widthPlugin,
      typeof decorationsPlugin,
      typeof gridPlugin,
      FloatingToolbarPlugin,
      typeof hyperlinkPlugin,
    ];
    sharedState: CardPluginState | null;
    actions: CardPluginActions;
  }
> = (options, api) => {
  const featureFlags =
    api?.dependencies?.featureFlags?.sharedState.currentState() || {};

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
      const { lpAnalyticsEventsNext } = featureFlags;

      return (
        <>
          <EditorSmartCardEvents editorView={editorView} />
          {lpAnalyticsEventsNext && (
            <EditorSmartCardEventsNext editorView={editorView} />
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
        if (
          options.allowDatasource &&
          canRenderDatasource(JIRA_LIST_OF_LINKS_DATASOURCE_ID)
        ) {
          return [
            {
              id: 'datasource',
              title: formatMessage(messages.datasourceJiraIssue),
              description: formatMessage(
                messages.datasourceJiraIssueDescription,
              ),
              keywords: ['jira'],
              icon: () => <IconDatasourceJiraIssue />,
              action(insert) {
                const tr = insert(undefined);
                showDatasourceModal('jira')(tr);
                return tr;
              },
            },
          ];
        }

        return [];
      },
    },
  };
};
