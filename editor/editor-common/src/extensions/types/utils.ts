import type { ReactNode } from 'react';

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
	lozenge?: ReactNode;
	node: ADFEntity | ExtensionModuleActionHandler;
	priority?: number;
	summary?: string;
	title: string;
};

export type MenuItemMap = { [key: string]: MenuItem };
