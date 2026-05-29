import { type Provider } from 'react';

import { PopupContext, type TPopupContextValue } from './popup-context';

/**
 * __Popup provider__
 *
 * Provides shared popup state (placement, popoverId, triggerRef,
 * isOpen, onClose) to compound child components such as `Popup.Trigger` and
 * `Popup.Content`.
 */
export const PopupProvider: Provider<TPopupContextValue | null> = PopupContext.Provider;
