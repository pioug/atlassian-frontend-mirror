import React from 'react';
import { layoutColumn, layoutSection } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import { FloatingToolbarConfig } from '../floating-toolbar/types';
import { default as createLayoutPlugin } from './pm-plugins/main';
import { buildToolbar } from './toolbar';
import { createDefaultLayoutSection } from './actions';
import { IconLayout } from '../quick-insert/assets';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../analytics';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { pluginKey } from './pm-plugins/plugin-key';
import { LayoutState } from './pm-plugins/types';
import { LayoutPluginOptions } from './types';

export { pluginKey };

const layoutPlugin = (options: LayoutPluginOptions = {}): EditorPlugin => ({
  name: 'layout',

  nodes() {
    return [
      { name: 'layoutSection', node: layoutSection },
      { name: 'layoutColumn', node: layoutColumn },
    ];
  },

  pmPlugins() {
    return [
      {
        name: 'layout',
        plugin: () => createLayoutPlugin(options),
      },
    ];
  },
  pluginsOptions: {
    floatingToolbar(state, intl): FloatingToolbarConfig | undefined {
      const {
        pos,
        allowBreakout,
        addSidebarLayouts,
        allowSingleColumnLayout,
      } = pluginKey.getState(state) as LayoutState;
      if (pos !== null) {
        return buildToolbar(
          state,
          intl,
          pos,
          allowBreakout,
          addSidebarLayouts,
          allowSingleColumnLayout,
        );
      }
      return undefined;
    },
    quickInsert: ({ formatMessage }) => [
      {
        id: 'layout',
        title: formatMessage(messages.columns),
        description: formatMessage(messages.columnsDescription),
        keywords: ['column', 'section'],
        priority: 1100,
        icon: () => <IconLayout />,
        action(insert, state) {
          const tr = insert(createDefaultLayoutSection(state));
          return addAnalytics(state, tr, {
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.LAYOUT,
            attributes: {
              inputMethod: INPUT_METHOD.QUICK_INSERT,
            },
            eventType: EVENT_TYPE.TRACK,
          });
        },
      },
    ],
  },
});

export default layoutPlugin;
