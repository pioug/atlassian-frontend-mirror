import { ImageUploadPluginAction } from '../types';
import { Transaction } from 'prosemirror-state';
import { stateKey } from './plugin-key';
import { ImageUploadPluginReferenceEvent } from '@atlaskit/editor-common/types';

const imageUploadAction = (
  tr: Transaction,
  action: ImageUploadPluginAction,
): Transaction => {
  return tr.setMeta(stateKey, action);
};

export const startUpload =
  (event?: ImageUploadPluginReferenceEvent) => (tr: Transaction) =>
    imageUploadAction(tr, {
      name: 'START_UPLOAD',
      event,
    });
