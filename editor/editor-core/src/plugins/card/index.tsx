import React, { Fragment } from 'react';
import { inlineCard, blockCard, embedCard } from '@atlaskit/adf-schema';
import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { createPlugin } from './pm-plugins/main';
import { floatingToolbar } from './toolbar';
import { EditorSmartCardEvents } from './ui/EditorSmartCardEvents';
import { cardKeymap } from './pm-plugins/keymap';
import { CardPluginOptions } from './types';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { EditorSmartCardEventsNext } from './ui/EditorSmartCardEventsNext';

const cardPlugin: NextEditorPlugin<
  'card',
  {
    pluginConfiguration: CardPluginOptions;
    dependencies: [
      typeof featureFlagsPlugin,
      typeof analyticsPlugin,
      typeof widthPlugin,
      typeof decorationsPlugin,
      typeof gridPlugin,
    ];
  }
> = (options, api) => {
  const featureFlags =
    api?.dependencies?.featureFlags?.sharedState.currentState() || {};

  return {
    name: 'card',

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

    contentComponent({ editorView }) {
      const { lpAnalyticsEventsNext } = featureFlags;
      return (
        <Fragment>
          <EditorSmartCardEvents editorView={editorView} />
          {lpAnalyticsEventsNext && (
            <EditorSmartCardEventsNext editorView={editorView} />
          )}
        </Fragment>
      );
    },

    pluginsOptions: {
      floatingToolbar: floatingToolbar(
        options,
        featureFlags,
        options.platform,
        options.linkPicker,
        api,
      ),
    },
  };
};

export default cardPlugin;
