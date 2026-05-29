import { useContext } from 'react';

import { PopupContext, type TPopupContextValue } from './popup-context';

/**
 * Returns the nearest `Popup` context value.
 *
 * Throws if called outside of a `<Popup>` compound component.
 */
export function usePopupContext(): TPopupContextValue {
	const ctx = useContext(PopupContext);
	if (ctx === null) {
		throw new Error('@atlaskit/top-layer: Popup compound components must be used within <Popup>.');
	}
	return ctx;
}
