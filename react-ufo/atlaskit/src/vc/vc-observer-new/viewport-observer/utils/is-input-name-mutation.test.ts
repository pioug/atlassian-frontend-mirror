import { fg } from '@atlaskit/platform-feature-flags';

import { isInputNameMutation } from './is-input-name-mutation';

jest.mock('@atlaskit/platform-feature-flags');
const mockFg = fg as jest.Mock;

describe('isInputNameMutation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('when feature flag is disabled', () => {
		beforeEach(() => {
			mockFg.mockReturnValue(false);
		});

		it('should return false when feature flag is disabled', () => {
			const input = document.createElement('input');
			const result = isInputNameMutation({
				target: input,
				attributeName: 'name',
				oldValue: '',
				newValue: 'test',
			});

			expect(result).toBe(false);
		});

		it('should return false regardless of target type when feature flag is disabled', () => {
			const div = document.createElement('div');
			const result = isInputNameMutation({
				target: div,
				attributeName: 'name',
				oldValue: '',
				newValue: 'test',
			});

			expect(result).toBe(false);
		});
	});

	describe('when feature flag is enabled', () => {
		beforeEach(() => {
			mockFg.mockReturnValue(true);
		});

		describe('with valid input name mutation', () => {
			it('should return true for input element with name attribute when oldValue is empty string', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'name',
					oldValue: '',
					newValue: 'test-name',
				});

				expect(result).toBe(true);
			});

			it('should return true for input element with name attribute when newValue is empty string', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'name',
					oldValue: 'test-name',
					newValue: '',
				});

				expect(result).toBe(true);
			});

			it('should return true for input element when both oldValue and newValue are empty strings', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'name',
					oldValue: '',
					newValue: '',
				});

				expect(result).toBe(true);
			});
		});

		describe('with input element but invalid attribute', () => {
			it('should return false when attribute is not "name"', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'class',
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(false);
			});

			it('should return false when attribute is "id"', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'id',
					oldValue: '',
					newValue: 'input-id',
				});

				expect(result).toBe(false);
			});

			it('should return false when attribute is "value"', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'value',
					oldValue: '',
					newValue: 'some-value',
				});

				expect(result).toBe(false);
			});
		});

		describe('with input element but invalid oldValue/newValue', () => {
			it('should return false when neither oldValue nor newValue is empty string', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'name',
					oldValue: 'old-name',
					newValue: 'new-name',
				});

				expect(result).toBe(false);
			});

			it('should return false when oldValue is null and newValue is not empty', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'name',
					oldValue: null,
					newValue: 'test-name',
				});

				expect(result).toBe(false);
			});

			it('should return false when oldValue is undefined and newValue is not empty', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'name',
					oldValue: undefined,
					newValue: 'test-name',
				});

				expect(result).toBe(false);
			});
		});

		describe('with non-input HTML elements', () => {
			it('should return false for div element', () => {
				const div = document.createElement('div');
				const result = isInputNameMutation({
					target: div,
					attributeName: 'name',
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(false);
			});

			it('should return false for button element', () => {
				const button = document.createElement('button');
				const result = isInputNameMutation({
					target: button,
					attributeName: 'name',
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(false);
			});

			it('should return false for textarea element', () => {
				const textarea = document.createElement('textarea');
				const result = isInputNameMutation({
					target: textarea,
					attributeName: 'name',
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(false);
			});

			it('should return false for select element', () => {
				const select = document.createElement('select');
				const result = isInputNameMutation({
					target: select,
					attributeName: 'name',
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(false);
			});
		});

		describe('with null or undefined target', () => {
			it('should return false when target is null', () => {
				const result = isInputNameMutation({
					target: null,
					attributeName: 'name',
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(false);
			});

			it('should return false when target is undefined', () => {
				const result = isInputNameMutation({
					target: undefined,
					attributeName: 'name',
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(false);
			});
		});

		describe('with null or undefined attributeName', () => {
			it('should return false when attributeName is null', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: null,
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(false);
			});

			it('should return false when attributeName is undefined', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: undefined,
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(false);
			});
		});

		describe('with different input types', () => {
			it('should return true for input[type="text"] with name mutation', () => {
				const input = document.createElement('input');
				input.type = 'text';
				const result = isInputNameMutation({
					target: input,
					attributeName: 'name',
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(true);
			});

			it('should return true for input[type="email"] with name mutation', () => {
				const input = document.createElement('input');
				input.type = 'email';
				const result = isInputNameMutation({
					target: input,
					attributeName: 'name',
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(true);
			});

			it('should return true for input[type="checkbox"] with name mutation', () => {
				const input = document.createElement('input');
				input.type = 'checkbox';
				const result = isInputNameMutation({
					target: input,
					attributeName: 'name',
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(true);
			});

			it('should return true for input[type="hidden"] with name mutation', () => {
				const input = document.createElement('input');
				input.type = 'hidden';
				const result = isInputNameMutation({
					target: input,
					attributeName: 'name',
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(true);
			});
		});

		describe('edge cases with empty values', () => {
			it('should return true when oldValue is empty string and newValue is empty string', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'name',
					oldValue: '',
					newValue: '',
				});

				expect(result).toBe(true);
			});

			it('should return true when oldValue is whitespace and newValue is empty string', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'name',
					oldValue: 'test',
					newValue: '',
				});

				expect(result).toBe(true);
			});

			it('should return false when oldValue and newValue are both non-empty strings', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'name',
					oldValue: 'old-value',
					newValue: 'new-value',
				});

				expect(result).toBe(false);
			});
		});

		describe('case sensitivity', () => {
			it('should return false when attributeName is "Name" (case-sensitive)', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'Name',
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(false);
			});

			it('should return false when attributeName is "NAME" (case-sensitive)', () => {
				const input = document.createElement('input');
				const result = isInputNameMutation({
					target: input,
					attributeName: 'NAME',
					oldValue: '',
					newValue: 'test',
				});

				expect(result).toBe(false);
			});
		});
	});

	describe('feature flag check', () => {
		it('should check the correct feature flag name', () => {
			mockFg.mockReturnValue(true);
			const input = document.createElement('input');

			isInputNameMutation({
				target: input,
				attributeName: 'name',
				oldValue: '',
				newValue: 'test',
			});

			expect(mockFg).toHaveBeenCalledWith('platform_ufo_ttvc_v4_exclude_input_name_mutation');
		});

		it('should not perform checks if feature flag is not called first', () => {
			mockFg.mockReturnValue(false);

			const result = isInputNameMutation({
				target: null,
				attributeName: 'name',
				oldValue: '',
				newValue: 'test',
			});

			expect(result).toBe(false);
			expect(mockFg).toHaveBeenCalled();
		});
	});
});
