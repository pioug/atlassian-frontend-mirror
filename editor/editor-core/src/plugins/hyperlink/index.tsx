import React from 'react';
import { link } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import { createInputRulePlugin } from './pm-plugins/input-rule';
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

const hyperlinkPlugin = (): EditorPlugin => ({
  name: 'hyperlink',

  marks() {
    return [{ name: 'link', mark: link }];
  },

  pmPlugins() {
    return [
      { name: 'hyperlink', plugin: ({ dispatch }) => plugin(dispatch) },
      {
        name: 'fakeCursorToolbarPlugin',
        plugin: () => fakeCursorToolbarPlugin,
      },
      {
        name: 'hyperlinkInputRule',
        plugin: ({ schema }) => createInputRulePlugin(schema),
      },
      {
        name: 'hyperlinkKeymap',
        plugin: () => createKeymapPlugin(),
      },
    ];
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        title: formatMessage(messages.link),
        description: formatMessage(messages.linkDescription),
        keywords: ['url', 'link', 'hyperlink'],
        priority: 1200,
        keyshortcut: tooltip(addLink),
        icon: () => <IconLink label={formatMessage(messages.link)} />,
        action(_insert, state) {
          const pos = state.selection.from;
          const { nodeBefore } = state.selection.$from;
          if (!nodeBefore) {
            return false;
          }
          const tr = state.tr
            .setMeta(stateKey, { type: LinkAction.SHOW_INSERT_TOOLBAR })
            .delete(pos - nodeBefore.nodeSize, pos);

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
    floatingToolbar: getToolbarConfig,
  },
});

export { HyperlinkState } from './pm-plugins/main';

export default hyperlinkPlugin;
