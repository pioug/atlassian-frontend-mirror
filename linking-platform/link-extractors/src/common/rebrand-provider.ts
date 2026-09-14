import type { LinkProvider } from '../types';

const GOOGLE_DRIVE = 'Google Drive';

export const rebrandProvider = (provider?: LinkProvider): LinkProvider | undefined => {
	switch (provider?.text) {
		case 'Google':
			return {
				...provider,
				...{ iconLabel: GOOGLE_DRIVE },
				text: GOOGLE_DRIVE,
			};
		default:
			return provider;
	}
};
