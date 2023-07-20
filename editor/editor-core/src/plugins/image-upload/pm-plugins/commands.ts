import type { InsertedImageProperties } from '@atlaskit/editor-common/provider-factory';
import { safeInsert } from 'prosemirror-utils';
import { createExternalMediaNode } from '../utils';
import type { Command } from '../../../types';
import type { ImageUploadPluginState } from '../types';
import { startUpload } from './actions';
import { stateKey } from './plugin-key';
import type { ImageUploadPluginReferenceEvent } from '@atlaskit/editor-common/types';

export const insertExternalImage: (
  options: InsertedImageProperties,
) => Command = (options) => (state, dispatch) => {
  const pluginState = stateKey.getState(state);
  if (!pluginState?.enabled || !options.src) {
    return false;
  }

  const mediaNode = createExternalMediaNode(options.src, state.schema);
  if (!mediaNode) {
    return false;
  }
  if (dispatch) {
    dispatch(
      safeInsert(mediaNode, state.selection.$to.pos)(state.tr).scrollIntoView(),
    );
  }
  return true;
};

export const startImageUpload: (
  event?: ImageUploadPluginReferenceEvent,
) => Command = (event) => (state, dispatch) => {
  const pluginState: ImageUploadPluginState | undefined =
    stateKey.getState(state);
  if (pluginState && !pluginState.enabled) {
    return false;
  }

  if (dispatch) {
    dispatch(startUpload(event)(state.tr));
  }
  return true;
};
