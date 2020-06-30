import { Plugin } from 'prosemirror-state';

import { Dispatch, EventDispatcher } from '../../../../event-dispatcher';

import { TableRowNodeView } from './nodeviews/tableRow';
import { pluginKey } from './plugin-key';
import { createPluginState } from './plugin-state';

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
