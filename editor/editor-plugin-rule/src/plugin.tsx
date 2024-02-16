import React from 'react';

import { rule } from '@atlaskit/adf-schema';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconDivider } from '@atlaskit/editor-common/quick-insert';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { insertHorizontalRule } from './commands';
import inputRulePlugin from './pm-plugins/input-rule';
import keymapPlugin from './pm-plugins/keymap';

export type RulePlugin = NextEditorPlugin<
  'rule',
  {
    pluginConfiguration: undefined;
    dependencies: [OptionalPlugin<AnalyticsPlugin>];
    actions: {
      insertHorizontalRule: ReturnType<typeof insertHorizontalRule>;
    };
  }
>;

export const rulePlugin: RulePlugin = ({ api }) => {
  return {
    name: 'rule',

    nodes() {
      return [{ name: 'rule', node: rule }];
    },

    actions: {
      insertHorizontalRule: insertHorizontalRule(api?.analytics?.actions),
    },

    pmPlugins() {
      return [
        {
          name: 'ruleInputRule',
          plugin: ({ schema }) =>
            inputRulePlugin(schema, api?.analytics?.actions),
        },
        {
          name: 'ruleKeymap',
          plugin: () => keymapPlugin(api?.analytics?.actions),
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
            let tr: Transaction | null = insert(
              state.schema.nodes.rule.createChecked(),
            );

            api?.analytics?.actions.attachAnalyticsEvent({
              action: ACTION.INSERTED,
              actionSubject: ACTION_SUBJECT.DOCUMENT,
              actionSubjectId: ACTION_SUBJECT_ID.DIVIDER,
              attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
              eventType: EVENT_TYPE.TRACK,
            })(tr);
            return tr;
          },
        },
      ],
    },
  };
};
