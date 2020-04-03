import { ExpandPluginState, ExpandPluginAction } from './types';

export default (
  pluginState: ExpandPluginState,
  action: ExpandPluginAction,
): ExpandPluginState => {
  switch (action.type) {
    case 'SET_EXPAND_REF':
      return { ...pluginState, expandRef: action.data.ref };
    default:
      return pluginState;
  }
};
