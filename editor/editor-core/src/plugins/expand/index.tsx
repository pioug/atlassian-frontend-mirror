import React from 'react';
import { expand, nestedExpand } from '@atlaskit/adf-schema';
import type { NextEditorPlugin, EditorProps } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { expandKeymap } from './pm-plugins/keymap';
import { IconExpand } from '@atlaskit/editor-common/quick-insert';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { getToolbarConfig } from './toolbar';
import { createExpandNode, insertExpand } from './commands';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type {
  LongPressSelectionPluginOptions,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { createWrapSelectionTransaction } from '@atlaskit/editor-common/utils';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';

interface ExpandPluginOptions extends LongPressSelectionPluginOptions {
  allowInsertion?: boolean;
  appearance?: EditorProps['appearance'];
}

export type ExpandPlugin = NextEditorPlugin<
  'expand',
  {
    pluginConfiguration: ExpandPluginOptions | undefined;
    dependencies: [
      FeatureFlagsPlugin,
      DecorationsPlugin,
      SelectionPlugin,
      OptionalPlugin<AnalyticsPlugin>,
    ];
    actions: {
      insertExpand: ReturnType<typeof insertExpand>;
    };
  }
>;

const expandPlugin: ExpandPlugin = ({ config: options = {}, api }) => {
  const featureFlags = api?.featureFlags?.sharedState.currentState() || {};
  return {
    name: 'expand',

    nodes() {
      return [
        { name: 'expand', node: expand },
        { name: 'nestedExpand', node: nestedExpand },
      ];
    },

    actions: {
      insertExpand: insertExpand(api?.analytics?.actions),
    },

    pmPlugins() {
      return [
        {
          name: 'expand',
          plugin: ({ dispatch, getIntl }) => {
            return createPlugin(
              dispatch,
              getIntl,
              options.appearance,
              options.useLongPressSelection,
              featureFlags,
              api,
            );
          },
        },
        {
          name: 'expandKeymap',
          plugin: () => expandKeymap(api),
        },
      ];
    },

    pluginsOptions: {
      floatingToolbar: getToolbarConfig(api),

      quickInsert: ({ formatMessage }) => {
        if (options && options.allowInsertion !== true) {
          return [];
        }
        return [
          {
            id: 'expand',
            title: formatMessage(messages.expand),
            description: formatMessage(messages.expandDescription),
            keywords: ['accordion', 'collapse'],
            priority: 600,
            icon: () => <IconExpand />,
            action(insert, state) {
              const node = createExpandNode(state);
              if (!node) {
                return false;
              }
              const tr = state.selection.empty
                ? insert(node)
                : createWrapSelectionTransaction({
                    state,
                    type: node.type,
                  });
              api?.analytics?.actions.attachAnalyticsEvent({
                action: ACTION.INSERTED,
                actionSubject: ACTION_SUBJECT.DOCUMENT,
                actionSubjectId:
                  node.type === state.schema.nodes.nestedExpand
                    ? ACTION_SUBJECT_ID.NESTED_EXPAND
                    : ACTION_SUBJECT_ID.EXPAND,
                attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
                eventType: EVENT_TYPE.TRACK,
              })(tr);
              return tr;
            },
          },
        ];
      },
    },
  };
};

interface ExpandEditorProps {
  allowExpand?: EditorProps['allowExpand'];
}

export default expandPlugin;
export type { ExpandPluginState } from './types';
export function isExpandInsertionEnabled({ allowExpand }: ExpandEditorProps) {
  if (allowExpand && typeof allowExpand === 'object') {
    return !!allowExpand.allowInsertion;
  }

  return false;
}
export { pluginKey } from './pm-plugins/plugin-factory';
