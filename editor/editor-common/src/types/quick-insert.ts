import type Fuse from 'fuse.js';
import type { IntlShape } from 'react-intl-next';

import type { QuickInsertItem, QuickInsertProvider } from '../provider-factory';

import type { EmptyStateHandler } from './empty-state-handler';

export type QuickInsertOptions =
	| boolean
	| {
			provider?: Promise<QuickInsertProvider>;
			prioritySortingFn?: (items: QuickInsertItem[]) => Fuse.FuseSortFunction | undefined;
			onInsert?: (item: QuickInsertItem) => void;
	  };

export type QuickInsertHandlerFn = ((intl: IntlShape) => Array<QuickInsertItem>) & {
	disableMemo?: boolean;
};

export type QuickInsertHandler = Array<QuickInsertItem> | QuickInsertHandlerFn;

export type IconProps = {
	label?: string;
};

export type QuickInsertSearchOptions = {
	query?: string;
	category?: string;
	disableDefaultItems?: boolean;
	featuredItems?: boolean;
	prioritySortingFn?: (items: QuickInsertItem[]) => Fuse.FuseSortFunction | undefined;
};

export type QuickInsertPluginState = {
	isElementBrowserModalOpen: boolean;
	lazyDefaultItems: () => QuickInsertItem[];
	providedItems?: QuickInsertItem[];
	provider?: QuickInsertProvider;
	emptyStateHandler?: EmptyStateHandler;
	searchOptions?: QuickInsertSearchOptions;
};

export type QuickInsertPluginStateKeys = keyof QuickInsertPluginState;

/**
 * @private
 * @deprecated Use {@link QuickInsertPluginOptions} from '@atlaskit/editor-plugin-quick-insert' instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export interface QuickInsertPluginOptions {
	headless?: boolean;
	disableDefaultItems?: boolean;
	enableElementBrowser?: boolean;
	elementBrowserHelpUrl?: string;
	emptyStateHandler?: EmptyStateHandler;
	prioritySortingFn?: (items: QuickInsertItem[]) => Fuse.FuseSortFunction | undefined;
	onInsert?: (item: QuickInsertItem) => void;
}

export type QuickInsertSharedState = {
	lazyDefaultItems: () => QuickInsertItem[];
	emptyStateHandler?: EmptyStateHandler;
	providedItems?: QuickInsertItem[];
	isElementBrowserModalOpen: boolean;
};
