import { UserPreferences } from '@atlaskit/editor-common/types';

export type SelectionToolbarPluginOptions = {
	/**
	 * When set to true, placing the toolbar above the selection will be preferenced.
	 */
	preferenceToolbarAboveSelection?: boolean;
};

export type ToolbarDocking = NonNullable<UserPreferences['toolbarDockingInitialPosition']>;
