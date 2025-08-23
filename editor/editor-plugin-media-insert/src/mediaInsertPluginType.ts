import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media';

import type { CustomizedHelperMessage } from './types';

export type MediaInsertPluginState = {
	isOpen?: boolean;
	mountInfo?: { mountPoint: HTMLElement; ref: HTMLElement };
};

export type MediaInsertPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	MediaPlugin,
	OptionalPlugin<FeatureFlagsPlugin>,
];

export type MediaInsertPluginCommands = {
	showMediaInsertPopup: (mountInfo?: {
		mountPoint: HTMLElement;
		ref: HTMLElement;
	}) => EditorCommand;
};

export type MediaInsertPluginConfig = {
	customizedHelperMessage?: CustomizedHelperMessage;
	customizedUrlValidation?: (input: string) => boolean;
	/**
	 * This will only allow users to insert media using URLs, they cannot insert media using files from their computer.
	 * Files that are inserted with a URL will attempt to be uploaded using `editor-plugin-media`
	 *
	 * @example
	 * ```typescript
	 *  createDefaultPreset({ featureFlags: {}, paste: {} })
	 *      .add(listPlugin)
	 *      .add(gridPlugin)
	 *      .add([mediaPlugin, { provider, allowMediaSingle: true, }])
	 *      .add(insertBlockPlugin)
	 *      .add(contentInsertionPlugin)
	 *      .add([mediaInsertPlugin, { isOnlyExternalLinks: true }])
	 * ```
	 *
	 * To disable trying to upload media from the external URLs we also need to disable this auto upload, in the media plugin:
	 *
	 * @example
	 * ```typescript
	 *  createDefaultPreset({ featureFlags: {}, paste: {} })
	 *      .add(listPlugin)
	 *      .add(gridPlugin)
	 *      .add([mediaPlugin, { provider, allowMediaSingle: true, isExternalMediaUploadDisabled: true }])
	 *      .add(insertBlockPlugin)
	 *      .add(contentInsertionPlugin)
	 *      .add([mediaInsertPlugin, { isOnlyExternalLinks: true }])
	 * ```
	 */
	isOnlyExternalLinks?: boolean;
};

export type MediaInsertPlugin = NextEditorPlugin<
	'mediaInsert',
	{
		commands: MediaInsertPluginCommands;
		dependencies: MediaInsertPluginDependencies;
		pluginConfiguration: MediaInsertPluginConfig | undefined;
		sharedState: MediaInsertPluginState;
	}
>;
