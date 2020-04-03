import { ExtensionState, ExtensionAction } from './types';

export default (
  pluginState: ExtensionState,
  action: ExtensionAction,
): ExtensionState => {
  switch (action.type) {
    case 'UPDATE_STATE':
      return {
        ...pluginState,
        ...action.data,
      };

    default:
      return pluginState;
  }
};
