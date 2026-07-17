/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - ReorderableMenuItems
 *
 * @codegen <<SignedSource::fe9b23ba28a6555fdf3292663a5ab5f7>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::d821d76600ba855195ee3bae39f60532>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/reorderable-menu-items/types.ts <<SignedSource::32dcff8c7f4f76e98ba391524aa41276>>
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