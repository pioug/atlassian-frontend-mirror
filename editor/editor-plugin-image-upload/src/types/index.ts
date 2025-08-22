import type { ImageUploadProvider } from '@atlaskit/editor-common/provider-factory';
import type { ImageUploadPluginReferenceEvent } from '@atlaskit/editor-common/types';

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
