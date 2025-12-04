import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export type MenuItemsType = Array<{
	items: MenuItem[];
}>;

export type SelectionExtensionComponentProps = {
	closeExtension: () => void;
	selection: SelectionExtensionSelectionInfo;
};

export type SelectionExtensionCallbackOptions = {
	selectedNodeAdf?: ADFEntity;
	selection?: SelectionExtensionSelectionInfo;
	selectionRanges?: SelectionRange[];
};

export type SelectionExtensionSelectionInfo = {
	coords: SelectionExtensionCoords;
	from: number;
	text: string;
	to: number;
};

export type SelectionCoords = {
	bottom: number;
	left: number;
	right: number;
	top: number;
};

export type SelectionExtension = {
	component?: React.ComponentType<SelectionExtensionComponentProps>;
	icon?: React.ComponentType<React.PropsWithChildren<{ label: string }>>;
	isDisabled?: (params: SelectionExtensionCallbackOptions) => boolean;
	name: string;
	onClick?: (params: SelectionExtensionCallbackOptions) => void;
};

// inspired by content api operation https://bitbucket.org/atlassian/pf-adf-service/src/master/src/lib/update/types.ts
export type SelectionPointer = {
	pointer: string;
	// position only applicable if selection is a text node
	position?: number;
};

export type SelectionRange = {
	end: SelectionPointer;
	start: SelectionPointer;
};

export type SelectionExtensions = {
	external?: SelectionExtension[];
	firstParty?: SelectionExtension[];
};

type SelectionExtensionModes = ViewMode;

export type SelectionExtensionPluginOptions = {
	extensionList?: ExtensionConfiguration[];
	extensions?: SelectionExtensions;
	pageModes?: SelectionExtensionModes | SelectionExtensionModes[];
};

/**
 * @private
 * @deprecated Use {@link SelectionExtensionPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type SelectionExtensionPluginConfiguration = SelectionExtensionPluginOptions;

export type SelectionExtensionCoords = { bottom: number; left: number; right: number; top: number };

export type BoundingBoxOffset = {
	bottom: number;
	top: number;
};

export type InsertPosition = {
	// can set from/to if selection is a text node
	from?: number;
	pointer: string;
	to?: number;
};
export type LinkInsertionOption = {
	insertPosition: InsertPosition;
	link: string;
};

export enum SelectionExtensionActionTypes {
	SET_ACTIVE_EXTENSION = 'set-active-extension',
	UPDATE_ACTIVE_EXTENSION_COORDS = 'update-active-extension-coords',
	CLEAR_ACTIVE_EXTENSION = 'clear-active-extension',
	SET_SELECTED_NODE = 'set-selected-node',
	START_TRACK_CHANGES = 'start-track-changes',
}

export type UpdateActiveExtensionAction =
	| {
			extension: SelectionExtension;
			type: SelectionExtensionActionTypes.SET_ACTIVE_EXTENSION;
	  }
	| {
			coords: SelectionExtensionCoords;
			type: SelectionExtensionActionTypes.UPDATE_ACTIVE_EXTENSION_COORDS;
	  }
	| { type: SelectionExtensionActionTypes.CLEAR_ACTIVE_EXTENSION };

export type SelectionExtensionPluginState = {
	activeExtension?: {
		coords: SelectionExtensionCoords;
		// NEXT PR: extension should become optional
		// extension?: SelectionExtension;
		extension: SelectionExtension | ExtensionMenuItemConfiguration;
		// NEXT PR: content component will be needed to render the new selected extension
		// contentComponent?: React.ComponentType<SelectionExtensionComponentProps>;
		selection: SelectionExtensionSelectionInfo;
	};
	docChangedAfterClick?: boolean;
	nodePos?: number;
	selectedNode?: PMNode;
	startTrackChanges?: boolean;
};

export type ReplaceWithAdfStatus = 'success' | 'document-changed' | 'failed-to-replace';
export type ReplaceWithAdfResult = { status: ReplaceWithAdfStatus };

export type InsertAdfAtEndOfDocResult = { status: 'success' | 'failed' };

export type SelectionAdfResult = {
	selectedNodeAdf?: ADFEntity;
	selectionRanges?: SelectionRange[];
} | null;

export type ExtensionSource = 'first-party' | 'external';

export type ExtensionConfiguration = {
	blockMenu?: BlockMenuExtensionConfiguration;
	inlineToolbar?: ToolbarExtensionConfiguration;
	key: string;
	primaryToolbar?: ToolbarExtensionConfiguration;
	source: ExtensionSource;
};

export type GetToolbarItemFn = () => ExtensionToolbarItemConfiguration;

export type GetMenuItemsFn = () => Array<
	ExtensionMenuItemConfiguration | ExtensionMenuSectionConfiguration
>;

export type GetMenuItemFn = () => Omit<ExtensionMenuItemConfiguration, 'section'>;

export type BlockMenuItemConfiguration = Omit<ExtensionMenuItemConfiguration, 'contentComponent'>;
export type GetBlockMenuItemFn = () => Omit<BlockMenuItemConfiguration, 'section'>;

export type GetBlockMenuNestedItemsFn = () => Array<
	BlockMenuItemConfiguration | ExtensionMenuSectionConfiguration
>;

export type ToolbarExtensionConfiguration = {
	getMenuItems?: GetMenuItemsFn;
	getToolbarItem?: GetToolbarItemFn;
};

export type BlockMenuExtensionConfiguration = {
	getMenuItem: GetBlockMenuItemFn;
	getNestedMenuItems?: GetBlockMenuNestedItemsFn;
};

export type ExtensionToolbarItemConfiguration = {
	icon: React.ComponentType<React.PropsWithChildren<{ label: string }>>;
	isDisabled?: boolean;
	label?: string;
	onClick?: () => void;
	tooltip: string;
};

export type ExtensionMenuItemConfiguration = {
	contentComponent?: React.ComponentType<SelectionExtensionComponentProps>;
	icon: React.ComponentType<React.PropsWithChildren<{ label: string; size?: 'small' | 'medium' }>>;
	isDisabled?: boolean;
	label: string;
	/**
	 * Optional lozenge to display next to the label in the menu
	 */
	lozenge?: {
		label: string;
	};
	onClick?: () => void;
	/**
	 * Optional menu-section to declare grouping - only used for menu items
	 */
	section?: { key: string; rank: number };
};

export type ExtensionMenuSectionConfiguration = {
	key: string;
	rank: number;
	title?: string;
};
