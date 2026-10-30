import { useId } from '@atlaskit/ds-lib/use-id';

/**
 * A stable `id` for wiring a trigger to its popover: the popover's `id`, and the
 * trigger's matching `aria-controls` / `popovertarget`.
 *
 * It is NOT a CSS `anchor-name`: `useAnchoredPopover` creates and writes its own.
 */
export function usePopoverId(): string {
	// `@atlaskit/ds-lib/use-id`, not React's `useId`: React's output can contain `:`, `«` and `»`,
	// which break CSS selectors such as `document.querySelector('#id')`.
	return `popover-${useId()}`;
}
