import { PluginKey } from 'prosemirror-state';
import { ImageUploadPluginState } from '../types';

export const stateKey = new PluginKey<ImageUploadPluginState>(
  'imageUploadPlugin',
);
