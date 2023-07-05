import React from 'react';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type cardPlugin from '..';
import { CardPluginOptions } from '../types';
import { HyperlinkToolbarAppearance } from '../ui/HyperlinkToolbarAppearance';

export const mountHyperlinkPlugin = (
  pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined,
  options: CardPluginOptions,
) => {
  return new SafePlugin({
    view(editorView) {
      requestAnimationFrame(() => {
        pluginInjectionApi?.dependencies.hyperlink?.actions?.prependToolbarButtons(
          {
            items: (state, intl, providerFactory, link) => [
              {
                type: 'custom',
                fallback: [],
                render: (editorView) => {
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
                      editorAnalyticsApi={
                        pluginInjectionApi?.dependencies.analytics?.actions
                      }
                      cardActions={
                        pluginInjectionApi?.dependencies.card?.actions
                      }
                    />
                  );
                },
              },
            ],
            onEscapeCallback:
              pluginInjectionApi?.dependencies.card.actions.hideLinkToolbar,
            view: editorView,
          },
        );
      });
      return {};
    },
  });
};
