import { PluginKey } from 'prosemirror-state';
import { pluginFactory } from '../../utils/plugin-state-factory';
import { MobileScrollPluginState } from './types';
import { MobileScrollAction } from './actions';
import reducer from './reducer';

export const mobileScrollPluginKey = new PluginKey('mobileScroll');

export const {
  createPluginState,
  getPluginState,
  createCommand,
} = pluginFactory<
  MobileScrollPluginState,
  MobileScrollAction,
  MobileScrollPluginState
>(mobileScrollPluginKey, reducer);
