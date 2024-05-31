import type { ImageUploadPluginReferenceEvent } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { ImageUploadPluginAction } from '../types';

import { stateKey } from './plugin-key';

const imageUploadAction = (tr: Transaction, action: ImageUploadPluginAction): Transaction => {
	return tr.setMeta(stateKey, action);
};

export const startUpload = (event?: ImageUploadPluginReferenceEvent) => (tr: Transaction) =>
	imageUploadAction(tr, {
		name: 'START_UPLOAD',
		event,
	});
