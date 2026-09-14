/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - ReorderableMenuItems
 *
 * @codegen <<SignedSource::e803c1afbf3ed793ea9268f09cf502aa>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::3217debf5ba68e84ca5ef7cdbf6ebb43>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/reorderable-menu-items/types.ts <<SignedSource::c4a5138ef88fa4afdfc33dcd5314731f>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { IconProps } from '../../__generated__/IconProps.codegen';

export interface Item {
	id: string;
	label: string;
	href: string;
	/**
	 * The name of the icon to display before the label. If omitted, a default icon is used.
	 */
	icon?: IconProps['glyph'];
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