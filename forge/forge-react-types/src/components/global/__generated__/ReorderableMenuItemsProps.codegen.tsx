/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - ReorderableMenuItems
 *
 * @codegen <<SignedSource::259d1c7bad2c78d175827ef9f7aa74d4>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::d821d76600ba855195ee3bae39f60532>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/reorderable-menu-items/types.ts <<SignedSource::2858793078a4cfda4c2bcb9485cc715f>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export interface Item {
	id: string;
	label: string;
	href: string;
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