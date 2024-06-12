import type { FocusEventHandler, ReactElement } from 'react';

export interface FocusEventHandlers {
	onFocus: FocusEventHandler;
	onBlur: FocusEventHandler;
}

export type FocusState = 'on' | 'off';

export interface FocusRingProps {
	/**
	 * Makes the `FocusRing` a controlled component (opting out of native focus behavior). The focus ring
	 * will apply the visual focus indicator when the `focus` prop is set to `on`. This prop should be used
	 * in conjunction with `useFocusRing`.
	 */
	focus?: FocusState;
	/**
	 * Controls whether the focus ring should be applied around or within the composed element.
	 */
	isInset?: boolean;
	/**
	 * The focusable element to be rendered within the `FocusRing`.
	 */
	children: ReactElement;
}
