import type { ADFEntity } from '@atlaskit/adf-utils/types';

import type { Command, FloatingToolbarDropdown, FloatingToolbarItem } from '../../types';

import type { ExtensionAPI } from './extension-handler';
import type { ExtensionIconModule } from './extension-manifest-common';

export type ToolbarButtonAction = (contextNode: ADFEntity, api: ExtensionAPI) => Promise<void>;

export type ToolbarButton = ExtensionModuleToolbarButtonLabelOrIcon & {
	action: ToolbarButtonAction;
	ariaLabel?: string;
	disabled?: boolean;
	display?: 'icon' | 'label' | 'icon-and-label';
	icon?: () => ExtensionIconModule;
	key: string;
	label: string;
	tooltip?: React.ReactNode | string;
	/**
	 * Tooltip Style
	 * This uses the Custom component feature of the Tooltip component.
	 * How to use: https://atlassian.design/components/tooltip/examples#custom-component
	 */
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	tooltipStyle?: React.ForwardRefExoticComponent<any> | React.ComponentType<any>;
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
	display?: 'icon' | 'icon-and-label';
	icon: () => ExtensionIconModule;
};

export type ExtensionModuleToolbarButtonWithLabel = {
	display?: 'label';
};

export type ExtensionNodeContext = {
	extensionKey: string | string[];
	extensionType?: string;
	nodeType: 'extension' | 'inlineExtension' | 'bodiedExtension' | 'multiBodiedExtension';
	shouldExclude?: (node: ADFEntity) => boolean;
	type: 'extension';
};

export type StandardNodeContext = {
	nodeType: 'table';
	type: 'node';
};

export type ExtensionToolbarItem = ExtensionToolbarButton | FloatingToolbarDropdown<Command>;

export type ExtensionToolbarButton = {
	action: ToolbarButtonAction;
	ariaLabel?: string;
	disabled?: boolean;
	icon?: () => ExtensionIconModule;
	key: string;
	label?: string;
	tooltip?: React.ReactNode | string;
	/**
	 * Tooltip Style
	 * This uses the Custom component feature of the Tooltip component.
	 * How to use: https://atlassian.design/components/tooltip/examples#custom-component
	 */
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	tooltipStyle?: React.ForwardRefExoticComponent<any> | React.ComponentType<any>;
};
