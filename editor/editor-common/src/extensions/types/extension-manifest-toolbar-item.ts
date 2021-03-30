import { ADFEntity } from '@atlaskit/adf-utils';

import { ExtensionIconModule } from './extension-manifest-common';

export type ExtensionModuleToolbarItem = ExtensionModuleToolbarButton;

export type ToolbarButtonAction = (adf: ADFEntity) => Promise<void>;

export type ExtensionModuleToolbarButton = ExtensionModuleToolbarItemCommon &
  ExtensionModuleToolbarButtonLabelOrIcon & {
    tooltip?: string;
    action: ToolbarButtonAction;
    label: string;
    icon?: () => ExtensionIconModule;
    display?: 'icon' | 'label' | 'icon-and-label';
  };

export type ExtensionModuleToolbarItemCommon = {
  context: ExtensionNodeContext | StandardNodeContext;
  key: string;
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
};
