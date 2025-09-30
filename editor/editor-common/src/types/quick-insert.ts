import type Fuse from 'fuse.js';
import type { IntlShape } from 'react-intl-next';

import type { QuickInsertItem, QuickInsertProvider } from '../provider-factory';

import type { EmptyStateHandler } from './empty-state-handler';

export type QuickInsertOptions =
	| boolean
	| {
			disableDefaultItems?: boolean;
			onInsert?: (item: QuickInsertItem) => void;
			prioritySortingFn?: (items: QuickInsertItem[]) => Fuse.FuseSortFunction | undefined;
			provider?: Promise<QuickInsertProvider>;
	  };

export type QuickInsertHandlerFn = ((intl: IntlShape) => Array<QuickInsertItem>) & {
	disableMemo?: boolean;
};

export type QuickInsertHandler = Array<QuickInsertItem> | QuickInsertHandlerFn;

export type IconProps = {
	label?: string;
};

export type QuickInsertSearchOptions = {
	category?: string;
	disableDefaultItems?: boolean;
	featuredItems?: boolean;
	prioritySortingFn?: (items: QuickInsertItem[]) => Fuse.FuseSortFunction | undefined;
	query?: string;
};

export type QuickInsertPluginState = {
	emptyStateHandler?: EmptyStateHandler;
	isElementBrowserModalOpen: boolean;
	lazyDefaultItems: () => QuickInsertItem[];
	providedItems?: QuickInsertItem[];
	provider?: QuickInsertProvider;
	searchOptions?: QuickInsertSearchOptions;
};

export type QuickInsertPluginStateKeys = keyof QuickInsertPluginState;

/**
 * @private
 * @deprecated Use {@link QuickInsertPluginOptions} from '@atlaskit/editor-plugin-quick-insert' instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export interface QuickInsertPluginOptions {
	disableDefaultItems?: boolean;
	elementBrowserHelpUrl?: string;
	emptyStateHandler?: EmptyStateHandler;
	enableElementBrowser?: boolean;
	headless?: boolean;
	onInsert?: (item: QuickInsertItem) => void;
	prioritySortingFn?: (items: QuickInsertItem[]) => Fuse.FuseSortFunction | undefined;
}

export type QuickInsertSharedState = {
	emptyStateHandler?: EmptyStateHandler;
	isElementBrowserModalOpen: boolean;
	lazyDefaultItems: () => QuickInsertItem[];
	providedItems?: QuickInsertItem[];
};
