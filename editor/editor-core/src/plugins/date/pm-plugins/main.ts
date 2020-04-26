import { Plugin } from 'prosemirror-state';
import DateNodeView from '../nodeviews/date';
import { ReactNodeView } from '../../../nodeviews';
import { PMPluginFactory } from '../../../types';
import { pluginFactory } from '../../../utils/plugin-state-factory';

import { reducer, mapping, onSelectionChanged } from './utils';
import { pluginKey } from './plugin-key';

const { createPluginState, getPluginState } = pluginFactory(
  pluginKey,
  reducer,
  {
    mapping,
    onSelectionChanged,
  },
);

const createPlugin: PMPluginFactory = ({
  dispatch,
  portalProviderAPI,
  eventDispatcher,
}) =>
  new Plugin({
    state: createPluginState(dispatch, { showDatePickerAt: null }),
    key: pluginKey,
    props: {
      nodeViews: {
        date: ReactNodeView.fromComponent(
          DateNodeView,
          portalProviderAPI,
          eventDispatcher,
        ),
      },
    },
  });

export { getPluginState };
export default createPlugin;
