import { type AtlaskitSelectValue, type Option } from '../types';

export const isSingleValue = (value?: AtlaskitSelectValue): value is Option =>
	!!value && !Array.isArray(value);
