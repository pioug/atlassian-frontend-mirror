/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - SearchableFlyoutMenuItems
 *
 * @codegen <<SignedSource::33315ca4598b1721f5647a1fd5ee8883>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::956ce4482c6294788d7a91427e49339f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/SearchableFlyoutMenuItem.tsx <<SignedSource::920266bd3b50aff1b93be7ae0f045124>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { IconProps } from '../../__generated__/IconProps.codegen';

export type SearchableFlyoutMenuItem = {
	/** The text displayed for the item. */
	primaryLabel: string;
	/** The URL the item links to. */
	href: string;
	/**
	 * The icon to display before the label. Accepts either a UI Kit icon glyph name, or an image source:
	 * a local app asset, a hosted URL (its host must be declared in `permissions.external.images` in the
	 * app manifest), a data URI, or a root-relative path. If omitted, no icon is shown.
	 */
	icon?: IconProps['glyph'] | string;
	/**
	 * The icon to display instead of `icon` when dark mode is selected. Accepts the same values as `icon`
	 * and follows the same rules. If omitted, `icon` is also used in dark mode.
	 */
	iconDark?: IconProps['glyph'] | string;
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
	 * The icon to display before the label. Accepts either a UI Kit icon glyph name, or an image source:
	 * a local app asset, a hosted URL (its host must be declared in `permissions.external.images` in the
	 * app manifest), a data URI, or a root-relative path. If omitted, no icon is shown.
	 */
	icon?: IconProps['glyph'] | string;
	/**
	 * The icon to display instead of `icon` when dark mode is selected. Accepts the same values as `icon`
	 * and follows the same rules. If omitted, `icon` is also used in dark mode.
	 */
	iconDark?: IconProps['glyph'] | string;
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