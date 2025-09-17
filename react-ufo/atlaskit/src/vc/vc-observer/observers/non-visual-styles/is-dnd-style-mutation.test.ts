import { fg } from '@atlaskit/platform-feature-flags';

import type { MutationRecordWithTimestamp } from '../types';

import isDnDStyleMutation from './is-dnd-style-mutation';

jest.mock('@atlaskit/platform-feature-flags');
jest.mock('@atlaskit/feature-gate-js-client', () => ({
	initializeCompleted: jest.fn(() => true),
	getExperimentValue: jest.fn(() => true),
}));

const mockFg = fg as jest.Mock;

describe('isDnDStyleMutation', () => {
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

		expect(isDnDStyleMutation(mutation)).toBe(false);
	});

	it('should return false when attributeName is not "style"', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'class', // Not 'style'
		} as unknown as MutationRecordWithTimestamp;

		expect(isDnDStyleMutation(mutation)).toBe(false);
	});

	it('should return false when there are no style changes', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'color: red;',
			newValue: 'color: red;', // No change
		} as unknown as MutationRecordWithTimestamp;

		expect(isDnDStyleMutation(mutation)).toBe(false);
	});

	it('should return false when style changes are not related to DnD anchor names', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'color: red; font-size: 14px;',
			newValue: 'color: blue; font-size: 14px;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isDnDStyleMutation(mutation)).toBe(false);
	});

	it('should return false when style changes include non-DnD related anchor name changes', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'color: red;',
			newValue: 'color: red; anchor-name: --test-anchor;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isDnDStyleMutation(mutation)).toBe(false);
	});

	it('should return false when elements with DnD anchor names have visual changes', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'color: red; anchor-name: --node-anchor-123;',
			newValue: 'color: blue; anchor-name: --node-anchor-123;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isDnDStyleMutation(mutation)).toBe(false);
	});

	it('should return true when style changes include only DnD related anchor name changes', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'color: red;',
			newValue: 'color: red; anchor-name: --node-anchor-123;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isDnDStyleMutation(mutation)).toBe(true);
	});

	it('should return true when only DnD anchor name is removed', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'color: red; anchor-name: --node-anchor-123;',
			newValue: 'color: red;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isDnDStyleMutation(mutation)).toBe(true);
	});

	it('should return true when adding DnD anchor name to empty style', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: '',
			newValue: 'anchor-name: --node-anchor-123;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isDnDStyleMutation(mutation)).toBe(true);
	});

	it('should return true when adding DnD anchor name to null style', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: null,
			newValue: 'anchor-name: --node-anchor-123;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isDnDStyleMutation(mutation)).toBe(true);
	});

	it('should return true when adding DnD anchor name to undefined style', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: null,
			newValue: 'anchor-name: --node-anchor-123;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isDnDStyleMutation(mutation)).toBe(true);
	});

	it('should return true when removing DnD anchor name by changing to empty style', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'anchor-name: --node-anchor-123;',
			newValue: '',
		} as unknown as MutationRecordWithTimestamp;

		expect(isDnDStyleMutation(mutation)).toBe(true);
	});

	it('should return true when removing DnD anchor name by changing to null style', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'anchor-name: --node-anchor-123;',
			newValue: null,
		} as unknown as MutationRecordWithTimestamp;

		expect(isDnDStyleMutation(mutation)).toBe(true);
	});

	it('should return true when removing DnD anchor name by changing to undefined style', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'anchor-name: --node-anchor-123;',
			newValue: undefined,
		} as unknown as MutationRecordWithTimestamp;

		expect(isDnDStyleMutation(mutation)).toBe(true);
	});
});
