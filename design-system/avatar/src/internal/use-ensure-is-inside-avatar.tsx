import { useContext } from 'react';

import { EnsureIsInsideAvatarContext } from './ensure-is-inside-avatar-context';

export const useEnsureIsInsideAvatar: () => void = (): void => {
	const context = useContext(EnsureIsInsideAvatarContext);
	if (!context) {
		throw new Error('Avatar sub-components must be used within a Avatar component.');
	}
};
