import type { InputMethodInsertMedia } from '@atlaskit/editor-common/analytics';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
	UiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media';
import {
	type MediaState,
	type MediaStateEventSubscriber,
} from '@atlaskit/editor-plugin-media/types';

export type MediaInsertPluginState = {
	isOpen?: boolean;
	mountInfo?: { ref: HTMLElement; mountPoint: HTMLElement };
};

export type InsertMediaSingle = (props: {
	mediaState: MediaState;
	inputMethod: InputMethodInsertMedia;
}) => boolean;

export type MediaInsertPlugin = NextEditorPlugin<
	'mediaInsert',
	{
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			MediaPlugin,
			OptionalPlugin<FeatureFlagsPlugin>,
		];
		sharedState: MediaInsertPluginState;
		commands: {
			showMediaInsertPopup: (mountInfo?: {
				ref: HTMLElement;
				mountPoint: HTMLElement;
			}) => EditorCommand;
		};
	}
>;

export type InsertExternalMediaSingle = (props: {
	url: string;
	alt: string;
	inputMethod: InputMethodInsertMedia;
}) => boolean;

export type InsertFile = (props: {
	mediaState: MediaState;
	inputMethod: InputMethodInsertMedia;
	onMediaStateChanged: MediaStateEventSubscriber;
}) => boolean;

export type MediaInsertPickerProps = Pick<
	UiComponentFactoryParams,
	| 'editorView'
	| 'dispatchAnalyticsEvent'
	| 'popupsMountPoint'
	| 'popupsBoundariesElement'
	| 'popupsScrollableElement'
> & {
	api?: ExtractInjectionAPI<MediaInsertPlugin>;
	closeMediaInsertPicker: () => void;
	mediaProvider?: Providers['mediaProvider'];
	insertMediaSingle: InsertMediaSingle;
	insertExternalMediaSingle: InsertExternalMediaSingle;
	insertFile: InsertFile;
};
