// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling

import { mockAvatarUrl } from './index';

export const withLocalResource = <T extends { avatarUrl?: string }>(options: T[]): T[] => {
	return options.map((option) => ({ ...option, avatarUrl: mockAvatarUrl }));
};
