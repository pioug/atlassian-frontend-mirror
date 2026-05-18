import { createContext } from 'react';

/**
 * Used to ensure Avatar sub-components are used within a Avatar component,
 * and provide a useful error message if not.
 */
export const EnsureIsInsideAvatarContext: import('react').Context<boolean> =
	createContext<boolean>(false);
