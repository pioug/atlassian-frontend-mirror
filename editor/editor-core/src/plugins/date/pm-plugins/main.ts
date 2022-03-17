import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { DateNodeView } from '../nodeviews/date';
import { getInlineNodeViewProducer } from '../../../nodeviews/getInlineNodeViewProducer';
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

const createPlugin: PMPluginFactory = (pmPluginFactoryParams) => {
  const newPluginState: DatePluginState = {
    showDatePickerAt: null,
    isNew: false,
    isDateEmpty: false,
    focusDateInput: false,
  };
  return new SafePlugin({
    state: createPluginState(pmPluginFactoryParams.dispatch, newPluginState),
    key: pluginKey,
    props: {
      nodeViews: {
        date: getInlineNodeViewProducer({
          pmPluginFactoryParams,
          Component: DateNodeView,
        }),
      },
    },
  });
};

export { getPluginState };
export default createPlugin;
