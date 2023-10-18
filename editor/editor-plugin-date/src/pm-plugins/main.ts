import { getInlineNodeViewProducer } from '@atlaskit/editor-common/react-node-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactory } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';

import { DateNodeView } from '../nodeviews/date';

import { pluginKey } from './plugin-key';
import type { DatePluginState } from './types';
import { mapping, onSelectionChanged, reducer } from './utils';

const { createPluginState, getPluginState } = pluginFactory(
  pluginKey,
  reducer,
  {
    mapping,
    onSelectionChanged,
  },
);

const createPlugin: PMPluginFactory = pmPluginFactoryParams => {
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
