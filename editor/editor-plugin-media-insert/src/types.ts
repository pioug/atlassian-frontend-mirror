import type {
	NextEditorPlugin,
	OptionalPlugin,
	UiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

export type MediaInsertPluginState = {
	isOpen?: boolean;
};

export type MediaInsertPlugin = NextEditorPlugin<
	'mediaInsert',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
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
};
