import React from 'react';
import { inlineCard, blockCard, embedCard } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { floatingToolbar } from './toolbar';
import { CardOptions } from '@atlaskit/editor-common';
import { EditorSmartCardEvents } from './ui/EditorSmartCardEvents';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

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
      const allowResizing = options.allowResizing ?? true;
      const useAlternativePreloader = options.useAlternativePreloader ?? true;
      return [
        {
          name: 'card',
          plugin: createPlugin(
            options.platform,
            allowResizing,
            useAlternativePreloader,
            options.fullWidthMode,
            options.createAnalyticsEvent,
          ),
        },
      ];
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
