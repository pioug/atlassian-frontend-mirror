import type { ComponentType, ReactNode } from 'react';

import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media';

import type { CustomizedHelperMessage, InsertMediaSingle } from './types';

/**
 * Props provided to a registered insert tab inside the media insert picker.
 *
 * The picker owns the popup chrome and provides the editor-side context
 * needed to insert media; the registering plugin provides the actual UI.
 */
export type MediaInsertTabProps = {
	closeMediaInsertPicker: () => void;
	dispatchAnalyticsEvent?: (payload: AnalyticsEventPayload) => void;
	insertMediaSingle: InsertMediaSingle;
	mediaProvider: MediaProvider;
};

/**
 * Descriptor for an insert tab registered onto the media insert picker via
 * `api.mediaInsert.actions.registerInsertTab(...)`.
 *
 * Other plugins (typically private `@atlassian/*` plugins like
 * `editor-plugin-ai-image-generation`) call `registerInsertTab` from inside
 * their own setup so the public `editor-plugin-media-insert` package never
 * needs to import them directly.
 */
export type RegisterInsertTab = {
	/**
	 * Stable identifier for this tab. Used to de-duplicate registrations so
	 * calling `registerInsertTab` with the same key twice replaces the prior
	 * registration rather than appending a duplicate tab.
	 */
	key: string;
	/**
	 * Label rendered inside the tab. Typically a `<FormattedMessage />` so the
	 * registering plugin owns its own i18n.
	 */
	label: ReactNode;
	/**
	 * Component rendered inside the picker when this tab is active.
	 */
	component: ComponentType<MediaInsertTabProps>;
};

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

export type MediaInsertPluginActions = {
	/**
	 * Returns the list of insert tabs that have been registered with the
	 * picker. Order matches registration order.
	 */
	getInsertTabs: () => RegisterInsertTab[];
	/**
	 * Register an additional tab inside the media insert picker. Idempotent
	 * by `key`: re-registering with the same key replaces the prior entry.
	 *
	 * Intended to be called from another plugin's setup, e.g.:
	 *
	 * ```tsx
	 * // inside aiImageGenerationPlugin
	 * api?.mediaInsert?.actions.registerInsertTab({
	 *   key: 'ai-image-generation',
	 *   label: <FormattedMessage {...messages.generateTabTitle} />,
	 *   component: MediaInsertImageGenerationTab,
	 * });
	 * ```
	 */
	registerInsertTab: (tab: RegisterInsertTab) => void;
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
		actions: MediaInsertPluginActions;
		commands: MediaInsertPluginCommands;
		dependencies: MediaInsertPluginDependencies;
		pluginConfiguration: MediaInsertPluginConfig | undefined;
		sharedState: MediaInsertPluginState;
	}
>;
