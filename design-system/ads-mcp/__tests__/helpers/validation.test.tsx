import { z } from 'zod';

import { validateToolArguments } from '../../src/helpers/validation';

describe('validateToolArguments', () => {
	const testSchema = z.object({
		name: z.string(),
		count: z.number().optional(),
	});

	it('returns success with data when validation succeeds', () => {
		const validArgs = {
			name: 'test',
			count: 42,
		};

		const result = validateToolArguments(testSchema, validArgs);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual(validArgs);
		}
	});

	it('returns validation error when required field is missing', () => {
		const invalidArgs = {
			count: 42,
			// name is missing
		};

		const result = validateToolArguments(testSchema, invalidArgs);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.content).toHaveLength(1);
			expect(result.error.content[0].type).toBe('text');

			const errorData = JSON.parse(result.error.content[0].text);
			expect(errorData.error).toBe('Invalid arguments provided');
			expect(errorData.validationErrors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						path: 'name',
						message: 'Required',
						code: 'invalid_type',
					}),
				]),
			);
			expect(errorData.expectedSchema).toBeDefined();
			expect(errorData.receivedArguments).toEqual(invalidArgs);
		}
	});

	it('includes JSON schema in error response', () => {
		const result = validateToolArguments(testSchema, {});
		expect(result.success).toBe(false);
		if (!result.success) {
			const errorData = JSON.parse(result.error.content[0].text);
			expect(errorData.expectedSchema).toMatchObject({
				type: 'object',
				properties: expect.objectContaining({
					name: { type: 'string' },
					count: { type: 'number' },
				}),
				required: ['name'],
			});
		}
	});
});
