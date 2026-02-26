/**
 * All alignment values (for dropdowns / iteration). Single source of truth for alignment options.
 */
export const ALIGNMENT_VALUES = ['left', 'center', 'right', 'wrap-left', 'wrap-right'] as const;

/**
 * Alignment value for native embed extension parameters.
 * Used by the editor floating toolbar when the user changes alignment;
 * the editor calls extensionApi.doc.update(localId, (current) => createAlignmentUpdate(current, alignment)).
 */
export type AlignmentValue = (typeof ALIGNMENT_VALUES)[number];

/** Default alignment when not set in parameters. */
export const DEFAULT_ALIGNMENT: AlignmentValue = 'center';

/**
 * Builds the attrs update for setting alignment on a native embed extension node.
 */
export function createAlignmentUpdate(
	current: { attrs?: Record<string, unknown> },
	alignment: AlignmentValue,
): { attrs: Record<string, unknown> } {
	const existingParams =
		current.attrs && 'parameters' in current.attrs && typeof current.attrs.parameters === 'object'
			? (current.attrs.parameters as Record<string, unknown>)
			: {};
	return {
		attrs: {
			...(current.attrs ?? {}),
			parameters: {
				...existingParams,
				alignment,
			},
		},
	};
}
