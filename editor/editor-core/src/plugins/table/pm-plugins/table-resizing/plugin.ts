import classnames from 'classnames';
import { Plugin } from 'prosemirror-state';

import { Dispatch } from '../../../../event-dispatcher';
import {
  TableCssClassName as ClassName,
  ColumnResizingPluginState,
} from '../../types';

import { setResizeHandlePos } from './commands';
import { handleMouseDown } from './event-handlers';
import { createPluginState, getPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';
import { getResizeCellPos } from './utils';

export function createPlugin(
  dispatch: Dispatch<ColumnResizingPluginState>,
  {
    lastColumnResizable = true,
    dynamicTextSizing = false,
  }: ColumnResizingPluginState,
) {
  return new Plugin({
    key: pluginKey,
    state: createPluginState(dispatch, {
      lastColumnResizable,
      dynamicTextSizing,
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
            getResizeCellPos(view, event as MouseEvent, lastColumnResizable);

          const { dragging } = getPluginState(state);
          if (resizeHandlePos !== null && !dragging) {
            if (
              handleMouseDown(
                view,
                event as MouseEvent,
                resizeHandlePos,
                dynamicTextSizing,
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
