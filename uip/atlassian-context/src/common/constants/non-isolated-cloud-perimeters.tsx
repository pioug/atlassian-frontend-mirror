import { COMMERCIAL, FEDRAMP_MODERATE } from './index';

export const NON_ISOLATED_CLOUD_PERIMETERS: readonly ['commercial', 'fedramp-moderate'] = [
	COMMERCIAL,
	FEDRAMP_MODERATE,
] as const;
