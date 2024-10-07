import { NON_BOOLEAN_VALUE } from '../constants';
import type { FeatureFlagValue } from '../types';

const startsAsObject = (value: any): boolean => {
	try {
		if (value.charAt(0) === '{') {
			return true;
		}
	} catch (e) {
		return false;
	}
	return false;
};

const isObject = (value: any): boolean =>
	value && typeof value === 'object' && value.constructor === Object;

const isString = (input: any): boolean => {
	let result;
	try {
		result = typeof input === 'string' || input instanceof String;
	} catch (err) {
		// swallow any errors
		result = false;
	}
	return result;
};

export const shouldRedactValue = (value: any): boolean =>
	(isString(value) && startsAsObject(value)) || isObject(value);

export const redactValue = (featureFlagValue: FeatureFlagValue) =>
	shouldRedactValue(featureFlagValue) ? NON_BOOLEAN_VALUE : featureFlagValue;
