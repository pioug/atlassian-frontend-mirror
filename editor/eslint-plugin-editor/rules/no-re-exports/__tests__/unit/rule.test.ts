import { tester } from '../../../../__tests__/utils/_tester';
import { rule } from '../../index';

describe('test no-re-export rule', () => {
	tester.run('no-re-export', rule, {
		valid: [],
		invalid: [
			{
				code: `export { default } from "@atlaskit/editor-plugin-block-type";`,
				errors: [
					{
						data: { name: 'default' },
						messageId: 'noReExport',
					},
				],
				filename: 'index.ts',
			},
			{
				code: `export * from "./file";`,
				errors: [
					{
						data: { name: '*' },
						messageId: 'noReExport',
					},
				],
				filename: 'index.ts',
			},
			{
				code: `export { a, b } from "./exports_decl";`,
				errors: [
					{
						data: { name: 'a' },
						messageId: 'noReExport',
					},
					{
						data: { name: 'b' },
						messageId: 'noReExport',
					},
				],
				filename: 'index.ts',
			},
			{
				code: `
import c from "./c";
export { c };`,
				errors: [
					{
						data: { name: 'c' },
						messageId: 'noReExport',
					},
				],
				filename: 'index.ts',
			},
			{
				code: `
import c from "./c";
export { c as a };`,
				errors: [
					{
						data: { name: 'c' },
						messageId: 'noReExport',
					},
				],
				filename: 'index.ts',
			},
			{
				code: `
import c from "./c";
export const a = c;`,
				errors: [
					{
						data: { name: 'c' },
						messageId: 'noReExport',
					},
				],
				filename: 'index.ts',
			},
			{
				code: `
import c from "./c";
export const a = {d: c};`,
				errors: [
					{
						data: { name: 'c' },
						messageId: 'noReExport',
					},
				],
				filename: 'index.ts',
			},
		],
	});
});
