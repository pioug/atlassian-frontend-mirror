import { Plugin } from 'prosemirror-state';

import { Dispatch, EventDispatcher } from '../../../../event-dispatcher';

import { pluginKey } from './plugin-key';
import { createPluginState } from './plugin-state';
import { TableRowNodeView } from './nodeviews/tableRow';

export const createPlugin = (
  dispatch: Dispatch,
  eventDispatcher: EventDispatcher,
  initialState = () => [],
) => {
  return new Plugin({
    state: createPluginState(dispatch, initialState),
    key: pluginKey,
    props: {
      nodeViews: {
        tableRow: (node, view, getPos) => {
          return new TableRowNodeView(node, view, getPos, eventDispatcher);
        },
      },
    },
  });
};
