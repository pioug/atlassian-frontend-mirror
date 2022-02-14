import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import DateNodeView from '../nodeviews/date';
import { ReactNodeView } from '../../../nodeviews';
import { PMPluginFactory } from '../../../types';
import { pluginFactory } from '../../../utils/plugin-state-factory';

import { reducer, mapping, onSelectionChanged } from './utils';
import { pluginKey } from './plugin-key';
import { DatePluginState } from './types';

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
}) => {
  const newPluginState: DatePluginState = {
    showDatePickerAt: null,
    isNew: false,
    isDateEmpty: false,
    focusDateInput: false,
  };
  const hasIntlContext = true;
  return new SafePlugin({
    state: createPluginState(dispatch, newPluginState),
    key: pluginKey,
    props: {
      nodeViews: {
        date: ReactNodeView.fromComponent(
          DateNodeView,
          portalProviderAPI,
          eventDispatcher,
          undefined,
          undefined,
          hasIntlContext,
        ),
      },
    },
  });
};

export { getPluginState };
export default createPlugin;
