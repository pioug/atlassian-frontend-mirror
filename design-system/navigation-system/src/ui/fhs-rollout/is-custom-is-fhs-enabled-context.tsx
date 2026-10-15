import { createContext } from 'react';

/**
 * __Is custom is fhs enabled context__
 *
 * @deprecated Full height sidebar (FHS) has been rolled back. This context is no longer used and
 * will be deleted in a future major release.
 */
export const IsCustomIsFhsEnabledContext: import('react').Context<boolean> =
	createContext<boolean>(false);
