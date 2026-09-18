import type Fuse from 'fuse.js';
import type { IntlShape } from 'react-intl';

import type { QuickInsertItem, QuickInsertProvider } from '../provider-factory';
import type { IsRecommendedItem } from '../quick-insert/is-recommended-item';
import type { EmptyStateHandler } from './empty-state-handler';

export type QuickInsertOptions =
	| boolean
	| {
			disableDefaultItems?: boolean;
			/**
			 * EDITOR-6558: Optional predicate for filtering quick-insert items
			 * before they are surfaced to the user. Items returning `false` are
			 * hidden from the typeahead and category lists.
			 *
			 * Used by Markdown Mode to allowlist only items whose corresponding
			 * node/mark types have a clean GFM round-trip.
			 */
			itemFilter?: (item: QuickInsertItem) => boolean;
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
	/** @see QuickInsertOptions.itemFilter */
	itemFilter?: (item: QuickInsertItem) => boolean;
	prioritySortingFn?: (items: QuickInsertItem[]) => Fuse.FuseSortFunction | undefined;
	query?: string;
};

export type QuickInsertPluginState = {
	emptyStateHandler?: EmptyStateHandler;
	/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-62138 Internal documentation for deprecation (no external access)} Tracked by EDITOR-8422. Use `isElementBrowserOpen` instead. */
	isElementBrowserModalOpen: boolean;
	isElementBrowserOpen: boolean;
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
	/**
	 * EDITOR-6558: Optional predicate for filtering quick-insert items
	 * before they're shown. Items returning `false` are hidden from the
	 * `/` menu. Used by Markdown Mode to allowlist only items whose
	 * underlying node/mark has a clean GFM round-trip.
	 */
	isRecommendedItem?: IsRecommendedItem;
	itemFilter?: (item: QuickInsertItem) => boolean;
	onInsert?: (item: QuickInsertItem) => void;
	prioritySortingFn?: (items: QuickInsertItem[]) => Fuse.FuseSortFunction | undefined;
}

export type QuickInsertSharedState = {
	emptyStateHandler?: EmptyStateHandler;
	/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-62138 Internal documentation for deprecation (no external access)} Tracked by EDITOR-8422. Use `isElementBrowserOpen` instead. */
	isElementBrowserModalOpen: boolean;
	isElementBrowserOpen: boolean;
	lazyDefaultItems: () => QuickInsertItem[];
	providedItems?: QuickInsertItem[];
};
