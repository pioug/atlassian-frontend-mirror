import type { AppearanceType } from './types';

const getAppearanceForAppType = (appType: string | null | undefined): AppearanceType => {
	switch (appType) {
		case 'agent':
			return 'hexagon';
		case 'user':
		case 'system':
		default:
			return 'circle';
	}
};

export default getAppearanceForAppType;
