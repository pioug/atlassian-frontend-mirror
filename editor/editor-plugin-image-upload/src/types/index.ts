import type { ImageUploadProvider } from '@atlaskit/editor-common/provider-factory/image-upload-provider';
import type { ImageUploadPluginReferenceEvent } from '@atlaskit/editor-common/types/image-upload-reference-event';

export type ImageUploadPluginAction = {
	event?: ImageUploadPluginReferenceEvent;
	name: 'START_UPLOAD';
};

export type ImageUploadPluginState = {
	active: boolean;
	activeUpload?: {
		event?: ImageUploadPluginReferenceEvent;
	};
	enabled: boolean;
	hidden: boolean;
};

export type UploadHandlerReference = { current: ImageUploadProvider | null };
