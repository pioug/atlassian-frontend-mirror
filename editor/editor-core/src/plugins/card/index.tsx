import React from 'react';
import { inlineCard, blockCard, embedCard } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { floatingToolbar } from './toolbar';
import { EditorSmartCardEvents } from './ui/EditorSmartCardEvents';
import { CardOptions } from '@atlaskit/editor-common/card';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { cardKeymap } from './pm-plugins/keymap';

const cardPlugin = (
  options: CardOptions & {
    platform: 'mobile' | 'web';
    fullWidthMode?: boolean;
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
  },
): EditorPlugin => {
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

      const plugins = [
        {
          name: 'card',
          plugin: createPlugin({
            ...options,
            allowBlockCards,
            allowResizing,
            useAlternativePreloader,
          }),
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
      return <EditorSmartCardEvents editorView={editorView} />;
    },

    pluginsOptions: {
      floatingToolbar: floatingToolbar(options, options.platform),
    },
  };
};

export default cardPlugin;
