import type { ManifestEditorToolbarActions, EditorToolbarAction, BuiltinToolbarKey } from './types';

/**
 * Generic utility to update parameters on a native embed extension node.
 * Preserves existing parameters and merges in the new ones.
 */
export function updateParameters(
	current: { attrs?: Record<string, unknown> },
	parameterUpdates: Record<string, unknown>,
): { attrs: Record<string, unknown> } {
	const existingParams =
		current.attrs && 'parameters' in current.attrs && typeof current.attrs.parameters === 'object'
			? (current.attrs.parameters as Record<string, unknown>)
			: {};
	return {
		attrs: {
			...current.attrs,
			parameters: {
				...existingParams,
				...parameterUpdates,
			},
		},
	};
}

/**
 * Helper function to create a type-safe ManifestEditorToolbarActions config.
 * Automatically infers custom action keys from the customActions object.
 *
 * @example
 * ```ts
 * const config = createEditorToolbarActions({
 *   customActions: {
 *     myAction: { type: 'button', key: 'myAction', ... },
 *   },
 *   items: ['refresh', 'myAction', 'separator'], // 'myAction' is type-checked
 *   moreItems: ['copyLink', 'myAction', 'separator', 'delete'], // 'myAction' is type-checked
 * });
 * ```
 */
export const createEditorToolbarActions = <
	const TCustomActions extends Record<string, EditorToolbarAction>,
>(config: {
	customActions: TCustomActions;
	items: (BuiltinToolbarKey | keyof TCustomActions)[];
	moreItems?: (BuiltinToolbarKey | keyof TCustomActions)[];
}): ManifestEditorToolbarActions<TCustomActions> => config;
