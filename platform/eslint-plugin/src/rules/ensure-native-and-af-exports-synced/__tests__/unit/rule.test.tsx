import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';
import { type PackageJson } from 'read-pkg-up';

let mockPath = 'packages/test/package.json';

let mockPackageJson: PackageJson = {};
jest.mock('read-pkg-up', () => ({
	sync: () => ({
		path: mockPath,
		packageJson: mockPackageJson,
	}),
}));

describe('valid test cases', () => {
	describe('allows @atlaskit/tokens babel-plugin entrypoint', () => {
		beforeEach(() => {
			mockPackageJson = {
				name: '@atlaskit/tokens',
				'af:exports': {
					'./babel-plugin': './src/entry-points/babel-plugin.tsx',
				},
				exports: {
					'./babel-plugin': './babel-plugin.js',
				},
			};
		});
		tester.run('ensure-native-and-af-exports-synced', rule, {
			valid: [{ code: '' }],
			invalid: [],
		});
	});

	describe('passes for valid directory export', () => {
		beforeEach(() => {
			mockPackageJson = {
				name: '@atlaskit/tokens',
				'af:exports': {
					'./glyph': './glyph',
					'./test/icon': './test/icon',
					'./button': './button',
					'.': './src',
				},
				exports: {
					'./glyph/*': './glyph/*',
					'./test/icon/*': './test/icon/*',
					'./button/*': './button/*.js',
					'./*': './src/*',
				},
			};
		});
		tester.run('ensure-native-and-af-exports-synced', rule, {
			valid: [
				{
					code: '',
					filename: 'packages/test/package.json',
				},
			],
			invalid: [],
		});
	});

	describe('passes for index.js files', () => {
		beforeEach(() => {
			mockPackageJson = {
				name: '@atlaskit/tokens',
				'af:exports': {
					'.': './src/index.tsx',
					'./gas-v3': './src/gas-v3/index.ts',
					'./reader': './src/reader/reader.ts',
					'./writer': './src/writer/writer.ts',
					'./report': './src/report/report.ts',
				},
				exports: {
					'.': './index.js',
					'./gas-v3': './gas-v3/index.js',
					'./reader': './reader/index.js',
					'./writer': './writer/index.js',
					'./report': './report/index.js',
				},
			};
		});
		tester.run('ensure-native-and-af-exports-synced', rule, {
			valid: [
				{
					code: '',
					filename: 'packages/test/package.json',
				},
			],
			invalid: [],
		});
	});

	describe('should pass for multiple valid entrypoints', () => {
		beforeEach(() => {
			mockPackageJson = {
				name: '@atlaskit/tokens',
				'af:exports': {
					'.': './src/index.tsx',
					'./rename-mapping': './src/entry-points/rename-mapping.tsx',
					'./babel-plugin': './src/entry-points/babel-plugin.tsx',
					'./glyph': './glyph',
					'./button': './button',
				},
				exports: {
					'.': './index.js',
					'./rename-mapping': './src/entry-points/rename-mapping.tsx',
					'./babel-plugin': './src/entry-points/babel-plugin.tsx',
					'./glyph/*': './glyph/*',
					'./button/*': './button/*.js',
				},
			};
		});
		tester.run('ensure-native-and-af-exports-synced', rule, {
			valid: [
				{
					code: '',
					filename: 'packages/test/package.json',
				},
			],
			invalid: [],
		});
	});
});

describe('invalid test cases', () => {
	describe('should fail for mismatched invalid entrypoints', () => {
		beforeEach(() => {
			mockPackageJson = {
				name: '@atlaskit/test',
				'af:exports': {
					'.': './src/index.ts',
				},
				exports: {
					'.': './test/index.ts',
				},
			};
		});
		tester.run('ensure-native-and-af-exports-synced', rule, {
			valid: [],
			invalid: [
				{
					code: '',
					filename: 'packages/test/package.json',
					errors: [{ messageId: 'unexpectedExportsValue' }],
				},
			],
		});
	});

	describe('should fail for missing entrypoints', () => {
		beforeEach(() => {
			mockPackageJson = {
				name: '@atlaskit/tokens',
				'af:exports': {
					'.': './src/index.ts',
					'./button': './button',
				},
				exports: {
					'.': './src/index.ts',
				},
			};
		});
		tester.run('ensure-native-and-af-exports-synced', rule, {
			valid: [],
			invalid: [
				{
					code: '',
					filename: 'packages/test/package.json',
					errors: [{ messageId: 'missingExportsKey' }],
				},
			],
		});
	});

	describe('should fail for invalid directory export', () => {
		beforeEach(() => {
			mockPackageJson = {
				name: '@atlaskit/tokens',
				'af:exports': {
					'./button': './button',
				},
				exports: {
					'./button/*': './src/button/*',
				},
			};
		});
		tester.run('ensure-native-and-af-exports-synced', rule, {
			valid: [],
			invalid: [
				{
					code: '',
					filename: 'packages/test/package.json',
					errors: [{ messageId: 'unexpectedExportsValue' }],
				},
			],
		});
	});
});
