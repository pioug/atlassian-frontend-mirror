import { useId } from '@atlaskit/ds-lib/use-id';
/**
 * Returns a stable HTML `id` used to wire a trigger element to its popover
 * via ARIA (`aria-controls`) and the Popover API (`popovertarget`).
 *
 * The returned value is intended for the `id` attribute on the popover and
 * for the matching `aria-controls` / `popovertarget` references on the
 * trigger. It is NOT a CSS `anchor-name` value: CSS anchor positioning is
 * handled internally by `useAnchorPosition`, which mints and applies its
 * own `anchor-name` on the trigger element.
 */
export function usePopoverId(): string {
	// prefixing for debug clarity in the DOM
	return `popover-${useId()}`;
}
