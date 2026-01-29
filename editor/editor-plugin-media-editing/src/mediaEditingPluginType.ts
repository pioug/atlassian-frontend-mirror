import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import type {
	NextEditorPlugin,
	EditorCommand,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { MediaClientConfig } from '@atlaskit/media-core';

import type { MediaEditingPluginState } from './pm-plugins/types';

// Forward reference to avoid circular dependency
// MediaPlugin depends on MediaEditingPlugin, and MediaEditingPlugin depends on MediaPlugin
// We only need the mediaClientConfig from MediaPlugin's shared state
type MediaPluginForwardRef = NextEditorPlugin<
	'media',
	{
		sharedState: {
			uploadMediaClientConfig?: MediaClientConfig;
		} | null;
	}
>;

export type MediaEditingPlugin = NextEditorPlugin<
	'mediaEditing',
	{
		commands: {
			hideImageEditor: EditorCommand;
			showImageEditor: (media: MediaADFAttrs) => EditorCommand;
		};
		dependencies: [OptionalPlugin<MediaPluginForwardRef>];
		sharedState: MediaEditingPluginState | null;
	}
>;
