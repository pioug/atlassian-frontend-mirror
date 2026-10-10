import type { Command } from '@atlaskit/editor-common/types/command';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

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
