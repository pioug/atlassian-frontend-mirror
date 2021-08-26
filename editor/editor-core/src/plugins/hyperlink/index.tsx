import React from 'react';
import { link } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import { createInputRulePlugin } from './pm-plugins/input-rule';
import { CardOptions } from '@atlaskit/editor-common';
import { createKeymapPlugin } from './pm-plugins/keymap';
import { plugin, stateKey, LinkAction } from './pm-plugins/main';
import fakeCursorToolbarPlugin from './pm-plugins/fake-cursor-for-toolbar';
import {
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../analytics';
import { getToolbarConfig } from './Toolbar';
import { tooltip, addLink } from '../../keymaps';
import { IconLink } from '../quick-insert/assets';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';

const hyperlinkPlugin = (options?: CardOptions): EditorPlugin => ({
  name: 'hyperlink',

  marks() {
    return [{ name: 'link', mark: link }];
  },

  pmPlugins() {
    // Skip analytics if card provider is available, as they will be
    // sent on handleRejected upon attempting to resolve smart link.
    const skipAnalytics = !!options && !!options.provider;
    return [
      { name: 'hyperlink', plugin: ({ dispatch }) => plugin(dispatch) },
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
          });

          return addAnalytics(state, tr, {
            action: ACTION.INVOKED,
            actionSubject: ACTION_SUBJECT.TYPEAHEAD,
            actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
            attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
            eventType: EVENT_TYPE.UI,
          });
        },
      },
    ],
    floatingToolbar: (state, intl, providerFactory) => {
      return getToolbarConfig(state, intl, providerFactory, options);
    },
  },
});

export type { HyperlinkState } from './pm-plugins/main';

export default hyperlinkPlugin;
