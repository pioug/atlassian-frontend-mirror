import type { Mode } from './cache';

export const getCacheKey = (id: string, mode: Mode): string => {
	const resizeMode = mode || 'crop';
	return [id, resizeMode].join('-');
};
