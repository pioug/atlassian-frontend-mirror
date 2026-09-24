import memoizeOne, { type MemoizedFn } from 'memoize-one';

import { type Option, type OptionData, type Value, type DefaultValue } from '../types';
import { optionToSelectableOption } from './optionToSelectableOption';

export const getOptions: MemoizedFn<(options: OptionData[]) => Option[]> = memoizeOne(
	(options: OptionData[]): Option[] => options.map(optionToSelectableOption),
);

export interface OptionToSelectableOptions {
	(defaultValue: OptionData): Option;
	(defaultValue: OptionData[]): Option[];
	(defaultValue?: null): null;
	(defaultValue?: DefaultValue): Option | Option[] | null | undefined;
}

export const optionToSelectableOptions = memoizeOne((defaultValue: Value) => {
	if (!defaultValue) {
		return null;
	}
	if (Array.isArray(defaultValue)) {
		return defaultValue.map(optionToSelectableOption);
	}
	return optionToSelectableOption(defaultValue);
}) as OptionToSelectableOptions;
