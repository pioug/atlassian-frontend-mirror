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
