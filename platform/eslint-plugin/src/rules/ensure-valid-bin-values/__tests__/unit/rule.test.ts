import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

const cwd = process.cwd();

const mockValidBinPaths = [
	`${cwd}/packages/foo/run-ts.bin`,
	`${cwd}/packages/foo/scripts/run-ts.bin`,
	`${cwd}/packages/foo/bar/run-ts.ts`,
	`${cwd}/packages/foo/bar/scripts/run-ts.ts`,
	`${cwd}/packages/baz/run-ts.js`,
	`${cwd}/packages/baz/scripts/run-ts.js`,
];

jest.mock('fs', () => {
	const actual = jest.requireActual('fs');
	return {
		...actual,
		statSync: jest.fn((p: string) => ({
			isFile: jest.fn(() => mockValidBinPaths.includes(p)),
			isDirectory: jest.fn(() => actual.statSync(p).isDirectory()),
		})),
	};
});

describe('test ensure-valid-bin-values rule', () => {
	tester.run('ensure-valid-bin-values', rule, {
		valid: [
			// .bin files are valid
			{
				code: `const foo = {
            "bin": {
              "run-ts": "./run-ts.bin",
            }
        }`,
				filename: `${cwd}/packages/foo/package.json`,
			},
			{
				code: `const foo = {
            "bin": {
              "run-ts": "./scripts/run-ts.bin",
            }
        }`,
				filename: `${cwd}/packages/foo/package.json`,
			},
			// .ts files are valid
			{
				code: `const foo = {
            "bin": {
              "run-ts": "./run-ts.ts",
            }
        }`,
				filename: `${cwd}/packages/foo/bar/package.json`,
			},
			{
				code: `const foo = {
            "bin": {
              "run-ts": "./scripts/run-ts.ts",
            }
        }`,
				filename: `${cwd}/packages/foo/bar/package.json`,
			},
			// .js files are valid
			{
				code: `const foo = {
            "bin": {
              "run-ts": "./run-ts.js",
            }
        }`,
				filename: `${cwd}/packages/baz/package.json`,
			},
			{
				code: `const foo = {
        	"bin": {
              "run-ts": "./scripts/run-ts.js",
            }
        }`,
				filename: `${cwd}/packages/baz/package.json`,
			},
			// dist paths are valid
			{
				code: `const foo = {
        	"bin": {
              "run-ts": "./dist/run-ts.js",
            }
        }`,
				filename: `${cwd}/packages/baz/package.json`,
			},
		],
		invalid: [
			// Pointing to anything other than a file is invalid
			{
				code: `const foo = {
          "bin": {
              "run-ts": "./bin",
            }
        }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidBinValue',
					},
				],
			},
			{
				code: `const foo = {
          "bin": {
              "run-ts": "./scripts/index",
            }
        }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidBinValue',
					},
				],
			},
			{
				code: `const foo = {
          "bin": {
              "run-ts": "./scripts/bin",
            }
        }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidBinValue',
					},
				],
			},
			{
				code: `const foo = {
          "bin": {
              "run-ts": "./",
            }
        }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidBinValue',
					},
				],
			},
			{
				code: `const foo = {
          "bin": {
              "run-ts": "",
            }
        }`,
				filename: `${cwd}/packages/foo/package.json`,
				errors: [
					{
						messageId: 'invalidBinValue',
					},
				],
			},
		],
	});
});
