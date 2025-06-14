import { fg } from '@atlaskit/platform-feature-flags';

import type { MutationRecordWithTimestamp } from '../types';

import isNonVisualStyleMutation from './is-non-visual-style-mutation';

jest.mock('@atlaskit/platform-feature-flags');

const mockFg = fg as jest.Mock;

describe('isNonVisualStyleMutation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockFg.mockReturnValue(true);
	});

	it('should return false when target is not an HTMLElement', () => {
		const mutation = {
			type: 'attributes',
			target: null, // Not an HTMLElement
			attributeName: 'class',
		};

		expect(isNonVisualStyleMutation(mutation)).toBe(false);
	});

	it('should return false when data-vc-nvs attribute is not "true"', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'class',
		};

		// data-vc-nvs attribute is not set to "true"
		element.setAttribute('data-vc-nvs', 'false');

		expect(isNonVisualStyleMutation(mutation)).toBe(false);
	});

	it('should return false when data-vc-nvs attribute is not specified', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'class',
		};

		// data-vc-nvs attribute is not set at all
		expect(isNonVisualStyleMutation(mutation)).toBe(false);
	});

	it('should return false when attributeName is not "class" or "style"', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'id', // Not 'class' or 'style'
		} as unknown as MutationRecordWithTimestamp;

		// Set data-vc-nvs attribute to true
		element.setAttribute('data-vc-nvs', 'true');

		expect(isNonVisualStyleMutation(mutation)).toBe(false);
	});

	it('should return true when all conditions are met with class attribute', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'class',
		} as unknown as MutationRecordWithTimestamp;

		// Set data-vc-nvs attribute to true
		element.setAttribute('data-vc-nvs', 'true');

		expect(isNonVisualStyleMutation(mutation)).toBe(true);
	});

	it('should return true when all conditions are met with style attribute', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
		} as unknown as MutationRecordWithTimestamp;

		// Set data-vc-nvs attribute to true
		element.setAttribute('data-vc-nvs', 'true');

		expect(isNonVisualStyleMutation(mutation)).toBe(true);
	});
});
