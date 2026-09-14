import { type OptionData, type Promisable } from '../types';

export const isIterable = (a: any): a is Iterable<Promisable<OptionData | OptionData[]>> =>
	typeof a?.[Symbol.iterator] === 'function';
