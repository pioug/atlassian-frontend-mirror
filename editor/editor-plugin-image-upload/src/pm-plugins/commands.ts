import type { InsertedImageProperties } from '@atlaskit/editor-common/provider-factory';
import type {
  Command,
  ImageUploadPluginReferenceEvent,
} from '@atlaskit/editor-common/types';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';

import type { ImageUploadPluginState } from '../types';
import { createExternalMediaNode } from '../utils';

import { startUpload } from './actions';
import { stateKey } from './plugin-key';

export const insertExternalImage: (
  options: InsertedImageProperties,
) => Command = options => (state, dispatch) => {
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
) => Command = event => (state, dispatch) => {
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
