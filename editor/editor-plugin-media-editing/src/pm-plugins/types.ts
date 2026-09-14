import type { MediaADFAttrs } from '@atlaskit/adf-schema/media';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';

export interface MediaEditingPluginState {
	imageEditorSelectedMedia?: MediaADFAttrs;
	isImageEditorVisible?: boolean;
	mediaClientConfig?: MediaClientConfig;
	uploadMediaClientConfig?: MediaClientConfig;
}
