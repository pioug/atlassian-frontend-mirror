import React from 'react';
import { layoutColumn, layoutSection } from '@atlaskit/adf-schema';
import type {
  NextEditorPlugin,
  OptionalPlugin,
  FloatingToolbarConfig,
} from '@atlaskit/editor-common/types';
import { default as createLayoutPlugin } from './pm-plugins/main';
import { buildToolbar } from './toolbar';
import { createDefaultLayoutSection } from './actions';
import { IconLayout } from '@atlaskit/editor-common/quick-insert';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { pluginKey } from './pm-plugins/plugin-key';
import type { LayoutState } from './pm-plugins/types';
import type { LayoutPluginOptions } from './types';
import type { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

export { pluginKey };

const layoutPlugin: NextEditorPlugin<
  'layout',
  {
    pluginConfiguration: LayoutPluginOptions | undefined;
    dependencies: [
      typeof decorationsPlugin,
      OptionalPlugin<typeof analyticsPlugin>,
    ];
  }
> = ({ config: options = {}, api }) => ({
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
      const { pos, allowBreakout, addSidebarLayouts, allowSingleColumnLayout } =
        pluginKey.getState(state) as LayoutState;
      if (pos !== null) {
        return buildToolbar(
          state,
          intl,
          pos,
          allowBreakout,
          addSidebarLayouts,
          allowSingleColumnLayout,
          api?.decorations.actions?.hoverDecoration,
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
          api?.analytics?.actions?.attachAnalyticsEvent({
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.LAYOUT,
            attributes: {
              inputMethod: INPUT_METHOD.QUICK_INSERT,
            },
            eventType: EVENT_TYPE.TRACK,
          })(tr);
          return tr;
        },
      },
    ],
  },
});

export default layoutPlugin;
