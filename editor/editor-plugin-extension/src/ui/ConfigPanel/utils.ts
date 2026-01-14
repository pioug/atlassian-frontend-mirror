import type { FieldDefinition, Option, Parameters } from '@atlaskit/editor-common/extensions';
import type { GroupBase } from '@atlaskit/react-select';
import { isOptionsGrouped } from '@atlaskit/select';

import { ALLOWED_LOGGED_MACRO_PARAMS, ALLOWED_PARAM_TYPES } from './constants';
import { ValidationError } from './types';

export const validate = <T>(
	field: Partial<FieldDefinition>,
	value: T,
): ValidationError | undefined => {
	return validateRequired<T>(field, value);
};

const isEmptyString = <T>(value: T) => typeof value === 'string' && value === '';
const isEmptyArray = <T>(value: T) => Array.isArray(value) && value.length === 0;

type ValidationProps = { isMultiple?: boolean; isRequired?: boolean };

const getUngroupedOptions = (groupedOptions: GroupBase<Option>[]): Option[] => {
	return groupedOptions.flatMap((option) => option.options);
};

export const validateRequired = <T>(
	{ isRequired, isMultiple }: ValidationProps,
	value: T,
): ValidationError | undefined => {
	if (isRequired) {
		const isUndefined = typeof value === 'undefined';
		const isEmpty = isEmptyString<T>(value) || (isMultiple && isEmptyArray<T>(value)) || false;

		return isUndefined || isEmpty ? ValidationError.Required : undefined;
	}

	return undefined;
};

export const getOptionFromValue = (
	options: Option[] | GroupBase<Option>[],
	value: string | string[] | undefined,
): Option | Option[] | undefined => {
	if (!Array.isArray(options) || options.length === 0) {
		return undefined;
	}

	if (Array.isArray(value)) {
		if (isOptionsGrouped(options)) {
			return getUngroupedOptions(options as GroupBase<Option>[]).filter((option) =>
				value.includes(option.value),
			);
		}
		return (options as Option[]).filter((option) => value.includes(option.value));
	}

	if (isOptionsGrouped(options)) {
		return getUngroupedOptions(options as GroupBase<Option>[]).find(
			(option) => value === option.value,
		);
	}

	return (options as Option[]).find((option) => value === option.value);
};

// Atlaskit uses final-form to power the form.
// Final-form will create nesting in the tree if a dot (.) is used in the name of the field.
// A parent is provided from a <Fieldset /> and is appended to the name here for simplicity
export const getSafeParentedName = (name: string, parentName?: string): string => {
	if (parentName && name.indexOf(`${parentName}.`) === -1) {
		return `${parentName}.${name}`;
	}

	return name;
};

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const duplicateFieldRegex = /:[0-9]+$/;

export const isDuplicateField = (key: string) => duplicateFieldRegex.test(key);

export const getNameFromDuplicateField = (key: string): string => key.replace(duplicateFieldRegex, '');

// An overly cautious parser for sanitizing configuration parameters of UGC
export const parseParamType = (paramValue: Parameters[string], paramField?: FieldDefinition) => {
	if (paramValue && paramField) {
		if (paramField.type === 'string') {
			if (paramField.name === 'types') {
				// Parse types field as an array of valid content types
				const contentTypes = ['page', 'blogpost', 'comment', 'attachment'];
				return (
					paramValue &&
					paramValue
						.split(',')
						.map((type: string) => type.trim())
						.filter((type: string) => contentTypes.includes(type))
				);
			}
			if (paramField.name === 'width') {
				return parseFloat(paramValue);
			}
			// Strings are very risky - return empty string in case anything slips through
			return '';
		}
		if (ALLOWED_PARAM_TYPES.includes(paramField.type)) {
			// The param types defined here are already parsed and safe to log
			return paramValue;
		}
	}
	// Safety net
	return null;
};

export const getLoggedParameters = (
	macroKey: string,
	currentParams: Parameters,
	macroFields?: FieldDefinition[],
) => {
	// Get the parameters only defined in the allowlist of logged macro/parameter keys
	return Object.keys(currentParams)
		.filter((paramKey) => ALLOWED_LOGGED_MACRO_PARAMS[macroKey]?.includes(paramKey))
		.reduce((obj, param) => {
			return {
				...obj,
				[param]: parseParamType(
					currentParams[param],
					macroFields?.find((field) => field.name === param),
				),
			};
		}, {});
};
