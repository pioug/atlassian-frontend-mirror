import type { InputMethodInsertMedia } from '@atlaskit/editor-common/analytics';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import type { UiComponentFactoryParams, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	type MediaState,
	type MediaStateEventSubscriber,
} from '@atlaskit/editor-plugin-media/types';

import type { MediaInsertPlugin, MediaInsertPluginConfig } from '../mediaInsertPluginType';

export type InsertMediaSingle = (props: {
	inputMethod: InputMethodInsertMedia;
	mediaState: MediaState;
}) => boolean;

export type CustomizedHelperMessage = string;

export type InsertExternalMediaSingle = (props: {
	alt: string;
	inputMethod: InputMethodInsertMedia;
	url: string;
}) => boolean;

export type InsertFile = (props: {
	inputMethod: InputMethodInsertMedia;
	mediaState: MediaState;
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
	customizedHelperMessage?: MediaInsertPluginConfig['customizedHelperMessage'];
	customizedUrlValidation?: MediaInsertPluginConfig['customizedUrlValidation'];
	insertExternalMediaSingle: InsertExternalMediaSingle;
	insertFile: InsertFile;
	insertMediaSingle: InsertMediaSingle;
	isOnlyExternalLinks: MediaInsertPluginConfig['isOnlyExternalLinks'];
	mediaProvider?: Providers['mediaProvider'];
};
