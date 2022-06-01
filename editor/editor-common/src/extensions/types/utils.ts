import type { ADFEntity } from '@atlaskit/adf-utils/types';

import {
  ExtensionModuleActionHandler,
  ExtensionType,
  Icon,
} from './extension-manifest';

export type MenuItem = {
  key: string;
  extensionType: ExtensionType;
  title: string;
  description?: string;
  summary?: string;
  documentationUrl?: string;
  featured: boolean;
  keywords: string[];
  categories: string[];
  icon: Icon;
  node: ADFEntity | ExtensionModuleActionHandler;
};

export type MenuItemMap = { [key: string]: MenuItem };
