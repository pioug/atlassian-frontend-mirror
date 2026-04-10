import type { BooleanCallback } from './types';

export const not: <T extends any>(cb: BooleanCallback<T>) => (val: T) => boolean =
	<T extends any>(cb: BooleanCallback<T>) =>
	(val: T): boolean =>
		!cb(val);
