import type { FocusableInput } from 'final-form-focus';

import { getFirstErrorField } from '../../utils';

describe('getFirstErrorField', () => {
	it('should not focus hidden inputs', () => {
		const testErrors = {
			match: 'ERROR',
		};

		const testInputs = [
			{
				type: 'hidden',
				id: 'match',
				name: 'match',
			},
			{
				type: 'hidden',
				id: 'match',
				name: 'match',
			},
			{
				type: 'hidden',
				id: 'match',
				name: 'match',
			},
		] as unknown as FocusableInput[];

		expect(getFirstErrorField(testInputs, testErrors)).toEqual(undefined);
	});

	it('should match input id with error', () => {
		const testErrors = {
			workType: 'ERROR',
		};

		const testInputs = [
			// === Mimick react-select ===
			{
				type: 'text',
				id: 'project',
			},
			{
				type: 'hidden',
				name: 'project',
			},
			// ===========================
			{
				type: 'text',
				id: 'workType',
			},
			{
				type: 'hidden',
				name: 'workType',
			},
			{
				type: 'text',
				id: 'summary',
				name: 'summary',
			},
		] as unknown as FocusableInput[];

		expect(getFirstErrorField(testInputs, testErrors)).toEqual(testInputs[2]);
	});

	it('should match input name with error', () => {
		const testErrors = {
			summary: 'ERROR',
		};

		const testInputs = [
			{
				type: 'text',
				id: 'project',
			},
			{
				type: 'hidden',
				name: 'project',
			},
			// Additional hidden field with same name
			{
				type: 'hidden',
				name: 'summary',
			},
			{
				type: 'text',
				name: 'summary',
			},
			{
				type: 'text',
				id: 'workType',
			},
			{
				type: 'hidden',
				name: 'workType',
			},
		] as unknown as FocusableInput[];

		expect(getFirstErrorField(testInputs, testErrors)).toEqual(testInputs[3]);
	});

	it('should match first error found', () => {
		const testErrors = {
			summary: 'ERROR',
			workType: 'ANOTHER ERROR',
		};

		const testInputs = [
			{
				type: 'text',
				id: 'project',
			},
			{
				type: 'hidden',
				name: 'project',
			},
			{
				type: 'text',
				id: 'assignee',
			},
			{
				type: 'text',
				id: 'workType',
			},
			{
				type: 'hidden',
				name: 'workType',
			},
			{
				type: 'text',
				id: 'summary',
			},
		] as unknown as FocusableInput[];

		expect(getFirstErrorField(testInputs, testErrors)).toEqual(testInputs[3]);
	});

	it('should not match if there are no matching errors', () => {
		const testErrors = {
			summary: 'ERROR',
		};

		const testInputs = [
			{
				type: 'text',
				id: 'project',
			},
			{
				type: 'hidden',
				name: 'project',
			},
			{
				type: 'text',
				id: 'workType',
			},
			{
				type: 'hidden',
				name: 'workType',
			},
		] as unknown as FocusableInput[];

		expect(getFirstErrorField(testInputs, testErrors)).toEqual(undefined);
	});
});
