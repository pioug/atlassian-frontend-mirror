import { type Validator, type ValidatorMap } from '../../../common/types';

import { validateFormData } from './index';

// Mock validator functions
const isNotEmpty: Validator = {
	isValid: (value: unknown): boolean => {
		return (
			value !== null &&
			value !== undefined &&
			typeof value === 'string' &&
			value.toString().trim().length > 0
		);
	},
	errorMessage: 'Field cannot be empty',
};

const isNumber: Validator = {
	isValid: (value: unknown): boolean => {
		return !isNaN(Number(value));
	},
	errorMessage: 'Field must be a number',
};

describe('validateFormData', () => {
	it('returns no errors for valid input', () => {
		const data = {
			name: 'John Doe',
			age: 25,
		};

		const validators: ValidatorMap = {
			name: [isNotEmpty],
			age: [isNumber],
		};

		const result = validateFormData({ data, validators });

		expect(result.name).toBeUndefined();
		expect(result.age).toBeUndefined();
	});

	it('returns error for empty input', () => {
		const data = {
			name: '',
			age: 25,
		};

		const validators: ValidatorMap = {
			name: [isNotEmpty],
			age: [isNumber],
		};

		const result = validateFormData({ data, validators });

		expect(result.name).toEqual(isNotEmpty.errorMessage);
		expect(result.age).toBeUndefined();
	});

	it('returns error for non-number input', () => {
		const data = {
			name: 'John Doe',
			age: 'not a number',
		};

		const validators: ValidatorMap = {
			name: [isNotEmpty],
			age: [isNumber],
		};

		const result = validateFormData({ data, validators });

		expect(result.name).toBeUndefined();
		expect(result.age).toEqual(isNumber.errorMessage);
	});

	it('returns multiple errors for multiple invalid inputs', () => {
		const data = {
			name: '',
			age: 'not a number',
		};

		const validators: ValidatorMap = {
			name: [isNotEmpty],
			age: [isNumber],
		};

		const result = validateFormData({ data, validators });

		expect(result.name).toEqual(isNotEmpty.errorMessage);
		expect(result.age).toEqual(isNumber.errorMessage);
	});
});
