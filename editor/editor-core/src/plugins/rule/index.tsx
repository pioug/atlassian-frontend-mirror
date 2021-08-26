import React from 'react';

import { Transaction } from 'prosemirror-state';

import { rule } from '@atlaskit/adf-schema';

import { EditorPlugin } from '../../types';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../analytics';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { IconDivider } from '../quick-insert/assets';

import inputRulePlugin from './pm-plugins/input-rule';
import keymapPlugin from './pm-plugins/keymap';

const rulePlugin = (): EditorPlugin => ({
  name: 'rule',

  nodes() {
    return [{ name: 'rule', node: rule }];
  },

  pmPlugins() {
    return [
      {
        name: 'ruleInputRule',
        plugin: ({ schema, featureFlags }) =>
          inputRulePlugin(schema, featureFlags),
      },
      {
        name: 'ruleKeymap',
        plugin: () => keymapPlugin(),
      },
    ];
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        id: 'rule',
        title: formatMessage(messages.horizontalRule),
        description: formatMessage(messages.horizontalRuleDescription),
        keywords: ['horizontal', 'rule', 'line', 'hr'],
        priority: 1200,
        keyshortcut: '---',
        icon: () => <IconDivider />,
        action(insert, state) {
          let tr: Transaction<any> | null = insert(
            state.schema.nodes.rule.createChecked(),
          );

          return addAnalytics(state, tr, {
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.DIVIDER,
            attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
            eventType: EVENT_TYPE.TRACK,
          });
        },
      },
    ],
  },
});

export default rulePlugin;
