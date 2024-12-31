import type { Command, NextEditorPlugin } from '@atlaskit/editor-common/types';

type ImageUploadActions = {
	startUpload: () => Command;
};

type ImageUploadSharedState = {
	active: boolean;
	enabled: boolean;
	hidden: boolean;
};

export type ImageUploadPlugin = NextEditorPlugin<
	'imageUpload',
	{
		actions: ImageUploadActions;
		sharedState: ImageUploadSharedState | undefined;
	}
>;
