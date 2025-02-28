import { type MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { ContentMode, ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';

export type MenuItemsType = Array<{
	items: MenuItem[];
}>;

export type SelectionExtensionComponentProps = {
	closeExtension: () => void;
	selection: SelectionExtensionSelectType;
};

export type SelectionExtensionSelectType = {
	text: string;
	selection: { from: number; to: number };
	coords: SelectionExtensionCoords;
};

export type SelectionExtensionContract = {
	name: string;
	onClick?: (params: SelectionExtensionSelectType) => void;
	component?: React.ComponentType<SelectionExtensionComponentProps>;
};

type SelectionExtensionModes = ViewMode | ContentMode;

export type SelectionExtensionPluginConfiguration = {
	pageModes?: SelectionExtensionModes | SelectionExtensionModes[];
	extensions?: SelectionExtensionContract[];
};

export type SelectionExtensionCoords = { left: number; right: number; top: number; bottom: number };

export enum SelectionExtensionActionTypes {
	SET_ACTIVE_EXTENSION = 'set-active-extension',
	UPDATE_ACTIVE_EXTENSION_COORDS = 'update-active-extension-coords',
	CLEAR_ACTIVE_EXTENSION = 'clear-active-extension',
}

export type UpdateActiveExtensionAction =
	| {
			type: SelectionExtensionActionTypes.SET_ACTIVE_EXTENSION;
			extension: SelectionExtensionContract;
	  }
	| {
			type: SelectionExtensionActionTypes.UPDATE_ACTIVE_EXTENSION_COORDS;
			coords: SelectionExtensionCoords;
	  }
	| { type: SelectionExtensionActionTypes.CLEAR_ACTIVE_EXTENSION };

export type SelectionExtensionPluginState = {
	activeExtension?: {
		extension: SelectionExtensionContract;
		selection: SelectionExtensionSelectType;
		coords: SelectionExtensionCoords;
	};
};
