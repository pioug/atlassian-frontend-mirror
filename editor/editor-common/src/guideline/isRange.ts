import type { Range } from './types';

export const isRange = (range: unknown): range is Range =>
	!!(typeof range === 'object' && range && 'start' in range && 'end' in range);
