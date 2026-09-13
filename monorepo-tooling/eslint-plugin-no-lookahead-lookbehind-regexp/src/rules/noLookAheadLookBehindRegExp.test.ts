import type { RuleTester } from 'eslint';

// @ts-expect-error
import { ruleTester } from '@atlassian/eslint-utils';
//import { RuleTester } from 'eslint';

import { noLookaheadLookbehindRegexp } from './noLookaheadLookbehindRegex';

// Rule tester for when no browserslist is passed, so lookahead and lookbehind should not be allowed
//const tester = new RuleTester({
//  parser: require.resolve('@typescript-eslint/parser'),
//  parserOptions: {
//    ecmaFeatures: {
//      jsx: true,
//    },
//  },
//});

const test: RuleTester = ruleTester;
const groups = [
	{ expression: '?=', type: 'lookahead' },
	{ expression: '?<=', type: 'lookbehind' },
	{ expression: '?!', type: 'negative lookahead' },
	{ expression: '?<!', type: 'negative lookbehind' },
];

test.run('noLookaheadLookbehindRegexp', noLookaheadLookbehindRegexp, {
	valid: [
		// dont flag string values when they are not used in combination with RegExp
		...groups.map((g) => `var str = "(${g.expression}foo)"`),
		// dont flag escaped sequences
		...groups.map((g) => `/\\(${g})/g`),
	],
	invalid: [
		// When initializing with a literal
		...groups.map((g) => {
			return {
				code: `const regexp = /(${g.expression})/;`,
				errors: [
					{
						message: `Disallowed ${g.type} match group at position 0`,
					},
				],
			};
		}),
		// When passed as a component prop
		...groups.map((g) => {
			return {
				code: `<Component prop={/(${g.expression})/}/>`,
				errors: [
					{
						message: `Disallowed ${g.type} match group at position 0`,
					},
				],
			};
		}),
		// Passed as string to RegExp constructor
		...groups.map((g) => {
			return {
				code: `new RegExp("(${g.expression})")`,
				errors: [
					{
						message: `Disallowed ${g.type} match group at position 1`,
					},
				],
			};
		}),
		// Passed as literal to RegExp constructor
		...groups.map((g) => {
			return {
				code: `new RegExp(/(${g.expression})/);`,
				errors: [
					{
						message: `Disallowed ${g.type} match group at position 1`,
					},
				],
			};
		}),
		...groups.map((g) => {
			return {
				code: `new RegExp("(${g.expression})" + "")`,
				errors: [
					{
						message: `Disallowed ${g.type} match group at position 1`,
					},
				],
			};
		}),
		...groups.map((g) => {
			return {
				code: `new RegExp("" + "(${g.expression})")`,
				errors: [
					{
						message: `Disallowed ${g.type} match group at position 1`,
					},
				],
			};
		}),
		...groups.map((g) => {
			return {
				code: `new RegExp("" + "(${g.expression})" + "")`,
				errors: [
					{
						message: `Disallowed ${g.type} match group at position 1`,
					},
				],
			};
		}),
		...groups.map((g) => {
			return {
				code: `new RegExp(\`(${g.expression})\`)`,
				errors: [
					{
						message: `Disallowed ${g.type} match group at position 0`,
					},
				],
			};
		}),
		...groups.map((g) => {
			return {
				code: `new RegExp(\`some expression (${g.expression})\`)`,
				errors: [
					{
						message: `Disallowed ${g.type} match group at position 16`,
					},
				],
			};
		}),
	],
});

test.run('Caniuse: noLookaheadLookbehindRegexp', noLookaheadLookbehindRegexp, {
	valid: [
		// dont flag escaped sequences
		...groups.map((g) => {
			return {
				code: `var str = "(${g.expression}foo)"`,
				settings: { browser: 'Chrome 96, Firefox 96' },
				options: [
					{
						browserslist: true,
					},
				],
			};
		}),
		...groups.map((g) => `/\\(${g})/g`),
	],
	invalid: [
		{
			code: `const regexp = /(?<=foo)/;`,
			settings: {
				browsers: ['Safari 15'],
			},
			options: [
				{
					browserslist: true,
				},
			],
			errors: [
				{
					message: /Safari 15/,
				},
			],
		},
		{
			code: `const regexp = /(?<=foo)/;`,
			settings: {
				browsers: ['Chrome 61'],
			},
			options: [
				{
					browserslist: true,
				},
			],
			errors: [
				{
					message: /Chrome 61/,
				},
			],
		},
		{
			code: `const regexp = /(?<=foo)/;`,
			settings: {
				browsers: ['ie 11, safari 13'],
			},
			options: [
				{
					browserslist: true,
				},
			],
			errors: [
				{
					message: /Internet Explorer 11/,
				},
			],
		},
	],
});
