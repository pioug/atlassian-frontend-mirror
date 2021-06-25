import { ADFEntity } from '@atlaskit/adf-utils';

import { ExtensionAPI } from './extension-handler';
import { ExtensionIconModule } from './extension-manifest-common';

export type ToolbarButtonAction = (
  contextNode: ADFEntity,
  api: ExtensionAPI,
) => Promise<void>;

export type ToolbarButton = ExtensionModuleToolbarButtonLabelOrIcon & {
  key: string;
  action: ToolbarButtonAction;
  label: string;
  tooltip?: string;
  icon?: () => ExtensionIconModule;
  display?: 'icon' | 'label' | 'icon-and-label';
  disabled?: boolean;
};

export type ToolbarItem = ToolbarButton;

export type ToolbarContext = ExtensionNodeContext | StandardNodeContext;

export type ContextualToolbar = {
  context: ToolbarContext;
  toolbarItems:
    | ToolbarItem[]
    | ((contextNode: ADFEntity, api: ExtensionAPI) => ToolbarItem[]);
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
  nodeType: 'extension' | 'inlineExtension' | 'bodiedExtension';
  extensionKey: string | string[];
  extensionType?: string;
};

export type StandardNodeContext = {
  type: 'node';
  nodeType: 'table';
};

export type ExtensionToolbarButton = {
  key: string;
  label?: string;
  tooltip?: string;
  icon?: () => ExtensionIconModule;
  action: ToolbarButtonAction;
  disabled?: boolean;
};
