import { closablePopoverAttribute } from './closable-popover-contract';
import { isNativeElementOpen } from './is-native-element-open';

/**
 * Open popovers inside `within` that have an `onClose` (see `closable-popover-contract`).
 */
export function getOpenClosablePopovers({ within }: { within: ParentNode }): HTMLElement[] {
	return Array.from(within.querySelectorAll<HTMLElement>(`[${closablePopoverAttribute}]`)).filter(
		(element) => isNativeElementOpen({ element }),
	);
}
