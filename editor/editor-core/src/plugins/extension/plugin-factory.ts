import { pluginFactory } from '../../utils/plugin-state-factory';
import reducer from './reducer';
import { pluginKey } from './plugin-key';

const factory = pluginFactory(pluginKey, reducer);

export const createPluginState = factory.createPluginState;
export const createCommand = factory.createCommand;
export const getPluginState = factory.getPluginState;
