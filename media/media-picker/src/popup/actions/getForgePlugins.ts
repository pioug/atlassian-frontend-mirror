import { Action } from 'redux';
import { MediaPickerPlugin } from '../../domain/plugin';

export const GET_FORGE_PLUGINS = 'GET_FORGE_PLUGINS';

export interface GetForgePluginsAction extends Action {
  type: 'GET_FORGE_PLUGINS';
}

export const isGetForgePluginsAction = (
  action: Action,
): action is GetForgePluginsAction => {
  return action.type === GET_FORGE_PLUGINS;
};

export const getForgePlugins = (): GetForgePluginsAction => {
  return {
    type: GET_FORGE_PLUGINS,
  };
};

export const GET_FORGE_PLUGINS_FULLFILLED = 'GET_FORGE_PLUGINS_FULLFILLED';

export interface GetForgePluginsFullfilledAction {
  readonly type: 'GET_FORGE_PLUGINS_FULLFILLED';
  readonly items: MediaPickerPlugin[];
}

export const isGetForgePluginsFullfilledAction = (
  action: Action,
): action is GetForgePluginsFullfilledAction => {
  return action.type === GET_FORGE_PLUGINS_FULLFILLED;
};

export function getForgePluginsFullfilled(
  items: MediaPickerPlugin[],
): GetForgePluginsFullfilledAction {
  return {
    type: GET_FORGE_PLUGINS_FULLFILLED,
    items,
  };
}

export const GET_FORGE_PLUGINS_FAILED = 'GET_FORGE_PLUGINS_FAILED';

export interface GetForgePluginsFailedAction {
  readonly type: 'GET_FORGE_PLUGINS_FAILED';
}

export const isGetForgePluginsFailedAction = (
  action: Action,
): action is GetForgePluginsFailedAction => {
  return action.type === GET_FORGE_PLUGINS_FAILED;
};

export function getForgePluginsFailed(): GetForgePluginsFailedAction {
  return {
    type: GET_FORGE_PLUGINS_FAILED,
  };
}
