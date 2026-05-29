import { useContext } from 'react';

import { PopupContext, type TPopupContextValue } from './popup-context';

/**
 * Returns the popup context if available, or `null` when used outside `<Popup>`.
 *
 * Used by `PopupContent` to support standalone usage (e.g. tooltip)
 * where values are passed as props instead of coming from a compound component.
 */
export function useMaybePopupContext(): TPopupContextValue | null {
	return useContext(PopupContext);
}
