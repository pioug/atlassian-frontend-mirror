import { type DefaultValue } from '../types';

export const isDefaultValuePopulated = (value?: DefaultValue): boolean =>
	(value && !Array.isArray(value)) || (Array.isArray(value) && value.length > 0);
