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
  addAnalytics,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../analytics';
import { getToolbarConfig } from './toolbar';
import { createExpandNode } from './commands';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import type { LongPressSelectionPluginOptions } from '../selection/types';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { createWrapSelectionTransaction } from '../block-type/commands/block-type';

interface ExpandPluginOptions extends LongPressSelectionPluginOptions {
  allowInsertion?: boolean;
  appearance?: EditorProps['appearance'];
}

const expandPlugin: NextEditorPlugin<
  'expand',
  {
    pluginConfiguration: ExpandPluginOptions | undefined;
    dependencies: [typeof featureFlagsPlugin, typeof decorationsPlugin];
  }
> = (options = {}, api) => {
  const featureFlags =
    api?.dependencies?.featureFlags?.sharedState.currentState() || {};
  return {
    name: 'expand',

    nodes() {
      return [
        { name: 'expand', node: expand },
        { name: 'nestedExpand', node: nestedExpand },
      ];
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
            );
          },
        },
        {
          name: 'expandKeymap',
          plugin: expandKeymap,
        },
      ];
    },

    pluginsOptions: {
      floatingToolbar: getToolbarConfig(
        api?.dependencies.decorations.actions.hoverDecoration,
      ),

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
              const tr = createWrapSelectionTransaction({
                state,
                type: node.type,
              });
              return addAnalytics(state, tr, {
                action: ACTION.INSERTED,
                actionSubject: ACTION_SUBJECT.DOCUMENT,
                actionSubjectId:
                  node.type === state.schema.nodes.nestedExpand
                    ? ACTION_SUBJECT_ID.NESTED_EXPAND
                    : ACTION_SUBJECT_ID.EXPAND,
                attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
                eventType: EVENT_TYPE.TRACK,
              });
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
