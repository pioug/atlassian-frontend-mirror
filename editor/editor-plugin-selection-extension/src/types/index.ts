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

export type UpdateActiveExtensionAction =
	| { type: 'set-active-extension'; extension: SelectionExtensionContract }
	| { type: 'update-active-extension-coords'; coords: SelectionExtensionCoords }
	| { type: 'clear-active-extension' };

export type SelectionExtensionPluginState = {
	activeExtension?: {
		extension: SelectionExtensionContract;
		selection: SelectionExtensionSelectType;
		coords: SelectionExtensionCoords;
	};
};
