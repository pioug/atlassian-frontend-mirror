/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - SearchableFlyoutMenuItems
 *
 * @codegen <<SignedSource::bcb87cc159b7011a85a5ab1f7d68e95e>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::956ce4482c6294788d7a91427e49339f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/SearchableFlyoutMenuItem.tsx <<SignedSource::5b6e06bdeb32d0c238821a93c571b062>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export type SearchableFlyoutMenuItem = {
	/** The text displayed for the item. */
	primaryLabel: string;
	/** The URL the item links to. */
	href: string;
};

export type SearchableFlyoutMenuItemsSection = {
	/** Heading displayed above this group. */
	header?: string;
	/** Link items displayed in this group. */
	items: SearchableFlyoutMenuItem[];
};

export type SearchableFlyoutMenuItemsSearchParams = {
	/** The text entered by the user to filter the results list. */
	searchText?: string;
};

export type SearchableFlyoutMenuItemsProps = {
	/**
	 * The display label for the searchable flyout menu item.
	 */
	label: string;
	/**
	 * The exact sections and items currently displayed in the flyout.
	 */
	items: SearchableFlyoutMenuItemsSection[];
	/**
	 * Invoked whenever the user changes the search input. Use this to update `items`.
	 */
	onSearchTextChanged: (params: SearchableFlyoutMenuItemsSearchParams) => void;
	/**
	 * Optional placeholder text for the search field. Defaults to "Search".
	 */
	searchPlaceholder?: string;
};

export type TSearchableFlyoutMenuItems<T> = (props: SearchableFlyoutMenuItemsProps) => T;