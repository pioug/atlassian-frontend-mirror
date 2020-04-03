import { ImageUploadPluginAction } from '../types';
import { Transaction } from 'prosemirror-state';
import { stateKey } from './plugin-key';

const imageUploadAction = (
  tr: Transaction,
  action: ImageUploadPluginAction,
): Transaction => {
  return tr.setMeta(stateKey, action);
};

export const startUpload = (event: any) => (tr: Transaction) =>
  imageUploadAction(tr, {
    name: 'START_UPLOAD',
    event,
  });
