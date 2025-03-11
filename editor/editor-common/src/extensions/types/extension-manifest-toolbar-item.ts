import type { ADFEntity } from '@atlaskit/adf-utils/types';

import type { Command, FloatingToolbarDropdown, FloatingToolbarItem } from '../../types';

import type { ExtensionAPI } from './extension-handler';
import type { ExtensionIconModule } from './extension-manifest-common';

export type ToolbarButtonAction = (contextNode: ADFEntity, api: ExtensionAPI) => Promise<void>;

export type ToolbarButton = ExtensionModuleToolbarButtonLabelOrIcon & {
	key: string;
	action: ToolbarButtonAction;
	label: string;
	ariaLabel?: string;
	tooltip?: React.ReactNode | string;
	/**
	 * Tooltip Style
	 * This uses the Custom component feature of the Tooltip component.
	 * How to use: https://atlassian.design/components/tooltip/examples#custom-component
	 */
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	tooltipStyle?: React.ForwardRefExoticComponent<any> | React.ComponentType<any>;
	icon?: () => ExtensionIconModule;
	display?: 'icon' | 'label' | 'icon-and-label';
	disabled?: boolean;
};

export type ToolbarItem = ToolbarButton | FloatingToolbarItem<Command>;

export type ToolbarContext = ExtensionNodeContext | StandardNodeContext;

export type ContextualToolbar = {
	context: ToolbarContext;
	toolbarItems: ToolbarItem[] | ((contextNode: ADFEntity, api: ExtensionAPI) => ToolbarItem[]);
};

export type ExtensionModuleToolbarButtonLabelOrIcon =
	| ExtensionModuleToolbarButtonWithIcon
	| ExtensionModuleToolbarButtonWithLabel;

export type ExtensionModuleToolbarButtonWithIcon = {
	icon: () => ExtensionIconModule;
	display?: 'icon' | 'icon-and-label';
};

export type ExtensionModuleToolbarButtonWithLabel = {
	display?: 'label';
};

export type ExtensionNodeContext = {
	type: 'extension';
	nodeType: 'extension' | 'inlineExtension' | 'bodiedExtension' | 'multiBodiedExtension';
	extensionKey: string | string[];
	extensionType?: string;
	shouldExclude?: (node: ADFEntity) => boolean;
};

export type StandardNodeContext = {
	type: 'node';
	nodeType: 'table';
};

export type ExtensionToolbarItem = ExtensionToolbarButton | FloatingToolbarDropdown<Command>;

export type ExtensionToolbarButton = {
	key: string;
	label?: string;
	ariaLabel?: string;
	tooltip?: React.ReactNode | string;
	/**
	 * Tooltip Style
	 * This uses the Custom component feature of the Tooltip component.
	 * How to use: https://atlassian.design/components/tooltip/examples#custom-component
	 */
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	tooltipStyle?: React.ForwardRefExoticComponent<any> | React.ComponentType<any>;
	icon?: () => ExtensionIconModule;
	action: ToolbarButtonAction;
	disabled?: boolean;
};
