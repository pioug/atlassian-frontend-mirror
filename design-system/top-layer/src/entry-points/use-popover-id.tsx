import { useId } from '@atlaskit/ds-lib/use-id';

/**
 * A stable `id` for wiring a trigger to its popover: the popover's `id`, and the
 * trigger's matching `aria-controls` / `popovertarget`.
 *
 * NOT a CSS `anchor-name` - `useAnchoredPopover` mints and writes its own.
 */
export function usePopoverId(): string {
	// `@atlaskit/ds-lib/use-id`, not React's `useId`: React's output contains
	// `:`, `«` and `»`, which are invalid in an HTML id token.
	return `popover-${useId()}`;
}
