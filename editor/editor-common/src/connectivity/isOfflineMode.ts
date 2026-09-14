import type { Mode } from './mode';

/**
 * Check if the connectivity mode represents ANY offline state
 */
export const isOfflineMode = (mode: Mode | undefined): boolean => {
	return mode === 'offline' || mode === 'collab-offline' || mode === 'internet-offline';
};
