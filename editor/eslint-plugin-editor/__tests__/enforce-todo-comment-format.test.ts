/* eslint-disable */
import { tsRuleTester } from './utils/_tester';
import { rule } from '../rules/enforce-todo-comment-format';

describe('enforce-todo-comment-format', () => {
	tsRuleTester.run('invalid-todo-comment-format', rule, {
		valid: [
			{
				code: '// TODO: EDF-123 - Implement feature',
				filename: 'test.ts',
			},
			{
				code: '// TODO: A-1 - Implement feature',
				filename: 'test.ts',
			},
			{
				code: '// TODO: AAAAAAA-1234567890 - Implement feature',
				filename: 'test.ts',
			},
			{
				code: '// NOTE: This is a note',
				filename: 'test.ts',
			},
			{
				code: '// This is a comment',
				filename: 'test.ts',
			},
			{
				code: '//  // This is a comment',
				filename: 'test.ts',
			},
		],

		invalid: [
			{
				code: '// TODO: Implement feature', // Missing ticket number
				filename: 'test.ts',
				errors: [
					{
						messageId: 'invalidTodoFormat',
					},
				],
			},
			{
				code: '// TODO Implement feature', // Missing ticket number and colon
				filename: 'test.ts',
				errors: [
					{
						messageId: 'invalidTodoFormat',
					},
				],
			},
			{
				code: '// TODO: - Implement feature', // Missing ticket number
				filename: 'test.ts',
				errors: [
					{
						messageId: 'invalidTodoFormat',
					},
				],
			},
			{
				code: '// TODO: EDF-123', // Missing description
				filename: 'test.ts',
				errors: [
					{
						messageId: 'invalidTodoFormat',
					},
				],
			},
			{
				code: '// TODO EDF-123', // Missing colon and description
				filename: 'test.ts',
				errors: [
					{
						messageId: 'invalidTodoFormat',
					},
				],
			},
			{
				code: '// todo: EDF-123 - Implement feature', // Lowercase todo
				filename: 'test.ts',
				errors: [
					{
						messageId: 'invalidTodoFormat',
					},
				],
			},
			{
				code: '// fixme: EDF-123 - Implement feature', // fixme keyword
				filename: 'test.ts',
				errors: [
					{
						messageId: 'invalidTodoFormat',
					},
				],
			},
			{
				code: '// FIXME: EDF-123 - Implement feature', // FIXME keyword
				filename: 'test.ts',
				errors: [
					{
						messageId: 'invalidTodoFormat',
					},
				],
			},
			{
				code: '// FIX ME: EDF-123 - Implement feature', // FIX ME keyword
				filename: 'test.ts',
				errors: [
					{
						messageId: 'invalidTodoFormat',
					},
				],
			},
			{
				code: '// @todo: EDF-123 - Implement feature', // @todo keyword
				filename: 'test.ts',
				errors: [
					{
						messageId: 'invalidTodoFormat',
					},
				],
			},
			{
				code: '// fix this',
				filename: 'test.ts',
				errors: [
					{
						messageId: 'invalidTodoFormat',
					},
				],
			},
			{
				code: '// todo later',
				filename: 'test.ts',
				errors: [
					{
						messageId: 'invalidTodoFormat',
					},
				],
			},
		],
	});
});
