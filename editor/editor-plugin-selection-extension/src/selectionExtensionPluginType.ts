import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import { type MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type {
	ContentMode,
	EditorViewModePlugin,
	ViewMode,
} from '@atlaskit/editor-plugin-editor-viewmode';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';

export type MenuItemsType = Array<{
	items: MenuItem[];
}>;

export type SelectionExtensionContract = {
	name: string;
	onClick: (params: { text: string; selection: { from: number; to: number } }) => void;
	validator?: (value: unknown) => boolean;
};

type SelectionExtensionModes = ViewMode | ContentMode;

type SelectionExtensionPluginConfiguration = {
	pageModes?: SelectionExtensionModes | SelectionExtensionModes[];
	extensions?: SelectionExtensionContract[];
};

export type SelectionExtensionPlugin = NextEditorPlugin<
	'selectionExtension',
	{
		pluginConfiguration: SelectionExtensionPluginConfiguration | undefined;
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			SelectionToolbarPlugin,
		];
	}
>;
