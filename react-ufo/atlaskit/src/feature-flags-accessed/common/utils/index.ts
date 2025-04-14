import { withProfiling } from '../../../self-measurements';
import { NON_BOOLEAN_VALUE } from '../constants';
import type { FeatureFlagValue } from '../types';

const startsAsObject = withProfiling(function startsAsObject(value: any): boolean {
	try {
		if (value.charAt(0) === '{') {
			return true;
		}
	} catch (e) {
		return false;
	}
	return false;
});

const isObject = withProfiling(function isObject(value: any): boolean {
	return value && typeof value === 'object' && value.constructor === Object;
});

const isString = withProfiling(function isString(input: any): boolean {
	let result;
	try {
		result = typeof input === 'string' || input instanceof String;
	} catch (err) {
		// swallow any errors
		result = false;
	}
	return result;
});

export const shouldRedactValue = withProfiling(function shouldRedactValue(value: any): boolean {
	return (isString(value) && startsAsObject(value)) || isObject(value);
});

export const redactValue = withProfiling(function redactValue(featureFlagValue: FeatureFlagValue) {
	return shouldRedactValue(featureFlagValue) ? NON_BOOLEAN_VALUE : featureFlagValue;
});
