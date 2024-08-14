import type { Providers } from '@atlaskit/editor-common/provider-factory';
import type {
	NextEditorPlugin,
	OptionalPlugin,
	UiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media';

export type MediaInsertPluginState = {
	isOpen?: boolean;
};

export type MediaInsertPlugin = NextEditorPlugin<
	'mediaInsert',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>, MediaPlugin];
		sharedState: MediaInsertPluginState;
	}
>;

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
};
