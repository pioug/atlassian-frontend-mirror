import { createContext, useContext } from 'react';

import noop from '@atlaskit/ds-lib/noop';

/**
 * __Is open context__
 *
 * A context for storing the isOpen value of the FlyoutMenuItem.
 */
export const IsOpenContext = createContext(false);

/**
 * __Set is open context__
 *
 * A context for storing a function that sets isOpen value of the FlyoutMenuItem.
 */
export const SetIsOpenContext = createContext<(value: boolean) => void>(noop);
export const useFlyoutMenuOpen = () => useContext(IsOpenContext);
export const useSetFlyoutMenuOpen = () => useContext(SetIsOpenContext);

/**
 * __On close context__
 * 
 * A context for storing the onClose value of the FlyoutMenuItem.
 */
export const OnCloseContext = createContext<(() => void) | null | undefined>(null);

/**
 * __On close provider__
 * 
 * A context provider for supplying the onClose function to the FlyoutHeader.
 */
export const OnCloseProvider = OnCloseContext.Provider;

/**
 * __Title id context__
 * 
 * A context for storing the title id of the FlyoutMenuItem that is displayed in
 * FlyoutHeader, and used as the aria-labelledby on the FlyoutMenuItemContent
 * container.
 */
export const TitleIdContext = createContext<string | undefined>(undefined);
export const useTitleId = () => useContext(TitleIdContext);

/**
 * __Title id provider__
 * 
 * A context provider for supplying the title id to the FlyoutHeader.
 */
export const TitleIdContextProvider = TitleIdContext.Provider;
