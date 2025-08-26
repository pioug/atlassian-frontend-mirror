import { DefaultExtensionProvider } from '@atlaskit/editor-common/extensions';
import type { Schema } from '@atlaskit/editor-prosemirror/model';

import { getSyncedBlockManifest } from './manifest';

export const getSyncedBlockExtensionProvider = (schema?: Schema) => {
	return new DefaultExtensionProvider([getSyncedBlockManifest(schema)]);
};
