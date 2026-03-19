import { createContext, useContext } from 'react';

/**
 * Used to ensure Avatar sub-components are used within a Avatar component,
 * and provide a useful error message if not.
 */
export const EnsureIsInsideAvatarContext: import('react').Context<boolean> =
	createContext<boolean>(false);

export const useEnsureIsInsideAvatar: () => void = (): void => {
	const context = useContext(EnsureIsInsideAvatarContext);
	if (!context) {
		throw new Error('Avatar sub-components must be used within a Avatar component.');
	}
};
