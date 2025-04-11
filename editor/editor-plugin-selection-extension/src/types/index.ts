import { type MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { ContentMode, ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';

export type MenuItemsType = Array<{
	items: MenuItem[];
}>;

export type SelectionExtensionComponentProps = {
	closeExtension: () => void;
	selection: SelectionExtensionSelectionInfo;
};

export type SelectionExtensionCallbackOptions = {
	selection?: SelectionExtensionSelectionInfo;
};

export type SelectionExtensionSelectionInfo = {
	text: string;
	from: number;
	to: number;
	coords: SelectionExtensionCoords;
};

export type SelectionCoords = {
	left: number;
	right: number;
	top: number;
	bottom: number;
};

export type SelectionExtension = {
	name: string;
	icon?: React.ComponentType<React.PropsWithChildren<{ label: string }>>;
	isDisabled?: (params: SelectionExtensionCallbackOptions) => boolean;
	onClick?: (params: SelectionExtensionCallbackOptions) => void;
	component?: React.ComponentType<SelectionExtensionComponentProps>;
};

export type SelectionExtensions = {
	firstParty?: SelectionExtension[];
	external?: SelectionExtension[];
};

type SelectionExtensionModes = ViewMode | ContentMode;

export type SelectionExtensionPluginOptions = {
	pageModes?: SelectionExtensionModes | SelectionExtensionModes[];
	extensions?: SelectionExtensions;
};

/**
 * @private
 * @deprecated Use {@link SelectionExtensionPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type SelectionExtensionPluginConfiguration = SelectionExtensionPluginOptions;

export type SelectionExtensionCoords = { left: number; right: number; top: number; bottom: number };

export enum SelectionExtensionActionTypes {
	SET_ACTIVE_EXTENSION = 'set-active-extension',
	UPDATE_ACTIVE_EXTENSION_COORDS = 'update-active-extension-coords',
	CLEAR_ACTIVE_EXTENSION = 'clear-active-extension',
}

export type UpdateActiveExtensionAction =
	| {
			type: SelectionExtensionActionTypes.SET_ACTIVE_EXTENSION;
			extension: SelectionExtension;
	  }
	| {
			type: SelectionExtensionActionTypes.UPDATE_ACTIVE_EXTENSION_COORDS;
			coords: SelectionExtensionCoords;
	  }
	| { type: SelectionExtensionActionTypes.CLEAR_ACTIVE_EXTENSION };

export type SelectionExtensionPluginState = {
	activeExtension?: {
		extension: SelectionExtension;
		selection: SelectionExtensionSelectionInfo;
		coords: SelectionExtensionCoords;
	};
};
