import type { BooleanCallback } from './types';

export const or: <T extends any>(...fns: BooleanCallback<T>[]) => (val: T) => boolean =
	<T extends any>(...fns: BooleanCallback<T>[]) =>
	(val: T): boolean =>
		fns.some((fn) => fn(val));
