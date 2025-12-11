import { NON_BOOLEAN_VALUE } from '../constants';
import type { FeatureFlagValue } from '../types';

function startsAsObject(value: any): boolean {
	try {
		if (value.charAt(0) === '{') {
			return true;
		}
	} catch {
		return false;
	}
	return false;
}

function isObject(value: any): boolean {
	return value && typeof value === 'object' && value.constructor === Object;
}

function isString(input: any): boolean {
	let result;
	try {
		result = typeof input === 'string' || input instanceof String;
	} catch {
		// swallow any errors
		result = false;
	}
	return result;
}

export function shouldRedactValue(value: any): boolean {
	return (isString(value) && startsAsObject(value)) || isObject(value);
}

export function redactValue(featureFlagValue: FeatureFlagValue): FeatureFlagValue {
	return shouldRedactValue(featureFlagValue) ? NON_BOOLEAN_VALUE : featureFlagValue;
}
