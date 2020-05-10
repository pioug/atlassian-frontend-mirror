import { ADFEntity } from '@atlaskit/adf-utils';
import {
  ExtensionType,
  Icon,
  ExtensionModuleActionHandler,
} from './extension-manifest';

export type MenuItem = {
  key: string;
  extensionType: ExtensionType;
  title: string;
  description: string;
  icon: Icon;
  node: ADFEntity | ExtensionModuleActionHandler;
};

export type MenuItemMap = { [key: string]: MenuItem };
