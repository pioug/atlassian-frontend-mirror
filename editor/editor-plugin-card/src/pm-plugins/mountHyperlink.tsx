import React from 'react';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  Command,
  ExtractInjectionAPI,
  FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { cardPlugin } from '../index';
import type { CardPluginOptions } from '../types';
import { HyperlinkToolbarAppearance } from '../ui/HyperlinkToolbarAppearance';
import { ToolbarViewedEvent } from '../ui/ToolbarViewedEvent';

const getToolbarViewedItem = (link: string): FloatingToolbarItem<Command>[] => {
  if (getBooleanFF('platform.linking-platform.editor.toolbar-viewed-event')) {
    return [
      {
        type: 'custom',
        fallback: [],
        render: editorView => (
          <ToolbarViewedEvent
            key="edit.link.menu.viewed"
            url={link}
            display="url"
            editorView={editorView}
          />
        ),
      },
    ];
  }

  return [];
};

export const mountHyperlinkPlugin = (
  pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined,
  options: CardPluginOptions,
) => {
  return new SafePlugin({
    view(editorView) {
      requestAnimationFrame(() => {
        pluginInjectionApi?.hyperlink?.actions?.prependToolbarButtons({
          items: (state, intl, providerFactory, link) => [
            ...getToolbarViewedItem(link),
            {
              type: 'custom',
              fallback: [],
              render: editorView => {
                return (
                  <HyperlinkToolbarAppearance
                    key="link-appearance"
                    url={link}
                    intl={intl}
                    editorView={editorView}
                    editorState={state}
                    cardOptions={options}
                    providerFactory={providerFactory}
                    platform={options?.platform}
                    editorAnalyticsApi={pluginInjectionApi?.analytics?.actions}
                    cardActions={pluginInjectionApi?.card?.actions}
                  />
                );
              },
            },
          ],
          onEscapeCallback: pluginInjectionApi?.card.actions.hideLinkToolbar,
          onInsertLinkCallback:
            pluginInjectionApi?.card.actions.queueCardsFromChangedTr,
          view: editorView,
        });
      });
      return {};
    },
  });
};
