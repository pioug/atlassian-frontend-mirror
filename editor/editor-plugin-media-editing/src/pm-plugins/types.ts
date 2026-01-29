import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import type { MediaClientConfig } from '@atlaskit/media-core';

export interface MediaEditingPluginState {
	imageEditorSelectedMedia?: MediaADFAttrs;
	isImageEditorVisible?: boolean;
	mediaClientConfig?: MediaClientConfig;
	uploadMediaClientConfig?: MediaClientConfig;
}
