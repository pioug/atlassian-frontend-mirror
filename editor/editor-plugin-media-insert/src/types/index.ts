import type { InputMethodInsertMedia } from '@atlaskit/editor-common/analytics';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import type { UiComponentFactoryParams, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	type MediaState,
	type MediaStateEventSubscriber,
} from '@atlaskit/editor-plugin-media/types';

import type { MediaInsertPlugin, MediaInsertPluginConfig } from '../mediaInsertPluginType';

export type InsertMediaSingle = (props: {
	mediaState: MediaState;
	inputMethod: InputMethodInsertMedia;
}) => boolean;

export type CustomizedHelperMessage = string;

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
	isOnlyExternalLinks: MediaInsertPluginConfig['isOnlyExternalLinks'];
	customizedUrlValidation?: MediaInsertPluginConfig['customizedUrlValidation'];
	customizedHelperMessage?: MediaInsertPluginConfig['customizedHelperMessage'];
};
