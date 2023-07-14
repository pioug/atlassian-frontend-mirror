import classnames from 'classnames';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import {
  TableCssClassName as ClassName,
  ColumnResizingPluginState,
} from '../../types';

import { setResizeHandlePos } from './commands';
import { handleMouseDown } from './event-handlers';
import { createPluginState, getPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';
import { getResizeCellPos } from './utils';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type {
  GetEditorContainerWidth,
  GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';

export function createPlugin(
  dispatch: Dispatch<ColumnResizingPluginState>,
  { lastColumnResizable = true }: ColumnResizingPluginState,
  getEditorContainerWidth: GetEditorContainerWidth,
  getEditorFeatureFlags: GetEditorFeatureFlags,
  editorAnalyticsAPI?: EditorAnalyticsAPI,
) {
  return new SafePlugin({
    key: pluginKey,
    state: createPluginState(dispatch, {
      lastColumnResizable,
      resizeHandlePos: null,
      dragging: null,
      lastClick: null,
    }),

    props: {
      attributes(state) {
        const pluginState = getPluginState(state);

        return {
          class: classnames(ClassName.RESIZING_PLUGIN, {
            [ClassName.RESIZE_CURSOR]: pluginState.resizeHandlePos !== null,
            [ClassName.IS_RESIZING]: !!pluginState.dragging,
          }),
        };
      },

      handleDOMEvents: {
        mousedown(view, event) {
          const { state } = view;
          const resizeHandlePos =
            // we're setting `resizeHandlePos` via command in unit tests
            getPluginState(state).resizeHandlePos ||
            getResizeCellPos(view, event as MouseEvent);

          const { dragging } = getPluginState(state);
          if (resizeHandlePos !== null && !dragging) {
            if (
              handleMouseDown(
                view,
                event as MouseEvent,
                resizeHandlePos,
                getEditorContainerWidth,
                getEditorFeatureFlags,
                editorAnalyticsAPI,
              )
            ) {
              const { state, dispatch } = view;
              return setResizeHandlePos(resizeHandlePos)(state, dispatch);
            }
          }

          return false;
        },
      },
    },
  });
}
