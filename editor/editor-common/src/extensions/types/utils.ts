import type { ADFEntity } from '@atlaskit/adf-utils/types';

import type {
	ExtensionKey,
	ExtensionModuleActionHandler,
	ExtensionType,
	Icon,
} from './extension-manifest';

export type MenuItem = {
	categories: string[];
	description?: string;
	documentationUrl?: string;
	extensionKey: ExtensionKey;
	extensionType: ExtensionType;
	featured: boolean;
	icon: Icon;
	key: string;
	keywords: string[];
	node: ADFEntity | ExtensionModuleActionHandler;
	summary?: string;
	title: string;
};

export type MenuItemMap = { [key: string]: MenuItem };
