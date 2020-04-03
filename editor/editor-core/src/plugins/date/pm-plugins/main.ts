import { Plugin } from 'prosemirror-state';
import DateNodeView from '../nodeviews/date';
import { ReactNodeView } from '../../../nodeviews';
import { PMPluginFactory } from '../../../types';
import { pluginFactory } from '../../../utils/plugin-state-factory';

import { mapping, onSelectionChanged, reducer } from './utils';
import { pluginKey } from './plugin-key';
import { DateMeta, DateState } from './types';

const { createPluginState, getPluginState } = pluginFactory<
  DateState,
  DateMeta,
  DateState
>(pluginKey, reducer, {
  mapping,
  onSelectionChanged,
});

const createPlugin: PMPluginFactory = ({ dispatch, portalProviderAPI }) =>
  new Plugin({
    state: createPluginState(dispatch, { showDatePickerAt: null }),
    key: pluginKey,
    props: {
      nodeViews: {
        date: ReactNodeView.fromComponent(DateNodeView, portalProviderAPI),
      },
    },
  });

export { getPluginState };
export default createPlugin;
