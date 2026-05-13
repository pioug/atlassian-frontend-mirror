import { isCalc } from './is-calc';

const percentageOrEmOrAuto = /(%$)|(\d+em$)|(auto$)/;

export const removePixelSuffix = (value: string | number): string | number => {
	if (typeof value === 'string' && (percentageOrEmOrAuto.test(value) || isCalc(value))) {
		return value;
	}

	return Number(typeof value === 'string' ? value.replace('px', '') : value);
};
