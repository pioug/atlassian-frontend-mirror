import { createContext } from 'react';

/**
 * __Is custom is fhs enabled context__
 *
 * Tracks if a custom value has been provided for `IsFhsEnabledContext`.
 * Used to prevent nesting of the `IsFhsEnabledProvider`.
 */
export const IsCustomIsFhsEnabledContext = createContext<boolean>(false);
