import type { UserPreferences } from '@atlaskit/editor-common/types/user-preferences';

export type SelectionToolbarPluginOptions = {
	/**
	 * When set to true, placing the toolbar above the selection will be preferenced.
	 */
	preferenceToolbarAboveSelection?: boolean;
};

export type ToolbarDocking = NonNullable<UserPreferences['toolbarDockingInitialPosition']>;
