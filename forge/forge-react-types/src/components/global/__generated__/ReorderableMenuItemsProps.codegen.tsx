/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - ReorderableMenuItems
 *
 * @codegen <<SignedSource::d312b56abc54f98b565425a37c038c15>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::956ce4482c6294788d7a91427e49339f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/reorderable-menu-items/types.ts <<SignedSource::ad6a16c2947d833ce99a45d1aeb09f54>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { IconProps } from '../../__generated__/IconProps.codegen';

export interface Item {
	id: string;
	label: string;
	href: string;
	/**
	 * The icon to display before the label. Accepts either a UI Kit icon glyph name, or an image source:
	 * a local app asset, a hosted URL (its host must be declared in `permissions.external.images` in the
	 * app manifest), a data URI, or a root-relative path. If omitted, a default icon is used.
	 */
	icon?: IconProps['glyph'] | string;
	/**
	 * The icon to display instead of `icon` when dark mode is selected. Accepts the same values as `icon`
	 * and follows the same rules. If omitted, `icon` is also used in dark mode.
	 */
	iconDark?: IconProps['glyph'] | string;
	/**
	 * Route-path pattern(s) that highlight this item when the current
	 * route matches, written relative to the app root.
	 */
	activePath?: string | string[];
}

export type ReorderableMenuItemsProps = {
	/**
	 * The ordered list of sidebar items to render. Each item must have a stable unique `id`
	 * (used as the React key and drag identity), a display `label`, and an `href` for navigation.
	 */
	items: Array<Item>;
	/**
	 * Called after the user completes a drag. Receives the new item order.
	 * Failures are caught and surfaced via `onError`; the local reorder is not reverted automatically.
	 */
	onReorder?: (newItems: Array<Item>) => void | Promise<void>;
	/**
	 * Called if `onReorder` throws or rejects. The component automatically reverts
	 * the local item order back to what it was before the drag. Use this callback
	 * to surface an error to the user (e.g. show a flag or toast).
	 * `previousItems` is the order before the drag; `newItems` is the order that
	 * failed to persist.
	 */
	onError?: (error: unknown, previousItems: Array<Item>, newItems: Array<Item>) => void;
};

export type TReorderableMenuItems<T> = (props: ReorderableMenuItemsProps) => T;