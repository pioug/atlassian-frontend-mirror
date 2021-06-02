import { Action } from 'redux';
import {
  isGetForgePluginsFullfilledAction,
  isGetForgePluginsFailedAction,
} from '../actions/getForgePlugins';
import { State } from '../domain';
import { MediaPickerPlugin } from '../../domain/plugin';

export const getForgePluginsStarted = (state: State, action: Action): State => {
  return state;
};

export const getForgePluginsFullfilled = (
  state: State,
  action: Action,
): State => {
  if (isGetForgePluginsFullfilledAction(action)) {
    const { items } = action;
    return {
      ...state,
      plugins: mergePlugins(state.plugins, items),
    };
  }

  return state;
};

const mergePlugins = (
  currentPlugins: MediaPickerPlugin[] | undefined,
  incomingPlugins: MediaPickerPlugin[],
) => {
  if (currentPlugins && currentPlugins.length > 0) {
    const newPlugins = incomingPlugins.filter(
      (incomingPlugin) =>
        !currentPlugins.some(
          (currentPlugin) => currentPlugin.name === incomingPlugin.name,
        ),
    );
    return currentPlugins.concat(newPlugins);
  } else {
    return incomingPlugins;
  }
};

export const getForgePluginsFailed = (state: State, action: Action): State => {
  if (isGetForgePluginsFailedAction(action)) {
    return {
      ...state,
      view: {
        ...state.view,
        hasError: true,
        isLoading: false,
      },
    };
  }

  return state;
};
