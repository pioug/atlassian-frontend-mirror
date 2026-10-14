import type { ReactNode } from 'react';

import type { ADFEntity } from '@atlaskit/adf-utils/types';

import type { QuickInsertPreview } from '../../quick-insert/preview';
import type {
	ExtensionApp,
	ExtensionKey,
	ExtensionModuleActionHandler,
	ExtensionType,
	Icon,
} from './extension-manifest';
import type { Parameters } from './extension-parameters';

export type MenuItem = {
	app?: ExtensionApp;
	categories: string[];
	category?: string;
	description?: string;
	documentationUrl?: string;
	extensionKey: ExtensionKey;
	extensionType: ExtensionType;
	featured: boolean;
	icon: Icon;
	isHidden?: () => boolean;
	key: string;
	keywords: string[];
	lozenge?: ReactNode;
	moduleKey?: string;
	node: ADFEntity | ExtensionModuleActionHandler;
	/** Parameters of the node this item inserts, copied from the quick insert module. */
	parameters?: Parameters;
	preview?: QuickInsertPreview;
	priority?: number;
	summary?: string;
	title: string;
};

export type MenuItemMap = { [key: string]: MenuItem };
