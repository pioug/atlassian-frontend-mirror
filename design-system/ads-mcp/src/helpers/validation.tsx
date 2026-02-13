/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';

import { zodToJsonSchema } from './index';

export interface ValidationErrorResult extends CallToolResult {
	content: [
		{
			isError: true;
			type: 'text';
			text: string;
		},
	];
}

export type ValidationResult<T> =
	| { success: true; data: T }
	| { success: false; error: ValidationErrorResult };

/**
 * Validates arguments against a Zod schema and returns a discriminated union result.
 *
 * @param schema - The Zod schema to validate against
 * @param args - The arguments to validate
 * @returns { success: true; data: T } if validation succeeds, { success: false; error: ValidationErrorResult } if validation fails
 */
export function validateToolArguments<T>(
	schema: z.ZodSchema<T>,
	args: unknown,
): ValidationResult<T> {
	const result = schema.safeParse(args);

	if (result.success) {
		return { success: true, data: result.data };
	}

	// Convert the Zod schema to JSON Schema for the error response
	const jsonSchema = zodToJsonSchema(schema);

	const validationErrors = result.error.errors.map((error) => ({
		path: error.path.join('.'),
		message: error.message,
		code: error.code,
	}));

	const errorMessage = {
		error: 'Invalid arguments provided',
		validationErrors,
		expectedSchema: jsonSchema,
		receivedArguments: args,
	};

	return {
		success: false,
		error: {
			content: [
				{
					isError: true,
					type: 'text',
					text: JSON.stringify(errorMessage, null, 2),
				},
			],
		},
	};
}
