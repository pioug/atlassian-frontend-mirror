import React from 'react';
import { link } from '@atlaskit/adf-schema';

import {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import { createInputRulePlugin } from './pm-plugins/input-rule';

import { createKeymapPlugin } from './pm-plugins/keymap';
import { plugin, stateKey, LinkAction } from './pm-plugins/main';
import fakeCursorToolbarPlugin from './pm-plugins/fake-cursor-for-toolbar';
import {
  toolbarButtonsPlugin,
  prependToolbarButtons,
  PrependToolbarButtons,
} from './pm-plugins/toolbar-buttons';
import {
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';
import { getToolbarConfig } from './Toolbar';
import { tooltip, addLink } from '../../keymaps';
import { IconLink } from '../quick-insert/assets';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import type { HyperlinkPluginOptions } from '@atlaskit/editor-common/types';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

const hyperlinkPlugin: NextEditorPlugin<
  'hyperlink',
  {
    pluginConfiguration: HyperlinkPluginOptions | undefined;
    dependencies: [
      typeof featureFlagsPlugin,
      OptionalPlugin<typeof analyticsPlugin>,
    ];
    actions: {
      /**
       * Add items to the left of the hyperlink floating toolbar
       * @param props
       * -
       * - items: Retrieve floating toolbar items to add
       * - onEscapeCallback (optional): To be called when the link picker is escaped.
       */
      prependToolbarButtons: PrependToolbarButtons;
    };
  }
> = (options = {}, api) => {
  const featureFlags =
    api?.dependencies?.featureFlags?.sharedState.currentState() || {};
  return {
    name: 'hyperlink',

    marks() {
      return [{ name: 'link', mark: link }];
    },

    actions: {
      prependToolbarButtons,
    },

    pmPlugins() {
      // Skip analytics if card provider is available, as they will be
      // sent on handleRejected upon attempting to resolve smart link.
      const skipAnalytics = !!options?.cardOptions?.provider;

      return [
        {
          name: 'hyperlink',
          plugin: ({ dispatch }) => plugin(dispatch, options?.editorAppearance),
        },
        {
          name: 'fakeCursorToolbarPlugin',
          plugin: () => fakeCursorToolbarPlugin,
        },
        {
          name: 'hyperlinkInputRule',
          plugin: ({ schema, featureFlags }) =>
            createInputRulePlugin(schema, skipAnalytics, featureFlags),
        },
        {
          name: 'hyperlinkKeymap',
          plugin: () => createKeymapPlugin(skipAnalytics),
        },

        {
          name: 'hyperlinkToolbarButtons',
          plugin: toolbarButtonsPlugin,
        },
      ];
    },

    pluginsOptions: {
      quickInsert: ({ formatMessage }) => [
        {
          id: 'hyperlink',
          title: formatMessage(messages.link),
          description: formatMessage(messages.linkDescription),
          keywords: ['hyperlink', 'url'],
          priority: 1200,
          keyshortcut: tooltip(addLink),
          icon: () => <IconLink />,
          action(insert, state) {
            const tr = insert(undefined);
            tr.setMeta(stateKey, {
              type: LinkAction.SHOW_INSERT_TOOLBAR,
              inputMethod: INPUT_METHOD.QUICK_INSERT,
            });

            const analyticsAttached =
              api?.dependencies?.analytics?.actions?.attachAnalyticsEvent?.({
                action: ACTION.INVOKED,
                actionSubject: ACTION_SUBJECT.TYPEAHEAD,
                actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
                attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
                eventType: EVENT_TYPE.UI,
              })(tr);

            return analyticsAttached !== false ? tr : false;
          },
        },
      ],
      floatingToolbar: getToolbarConfig(options, featureFlags, api),
    },
  };
};

export type { HyperlinkState } from './pm-plugins/main';

export default hyperlinkPlugin;
