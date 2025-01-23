jest.mock('glob', () => ({
	globSync: jest.fn(),
}));

import path from 'path';

import { globSync } from 'glob';

import presets from '../presets';
import {
	getTransformModule,
	getTransformPath,
	getTransforms,
	getTransformVersion,
	hasTransform,
	parseTransformPath,
} from '../transforms';

const codemodPaths = [
	'node_modules/@atlaskit/button/codemods/5.0.0-foo.ts',
	'node_modules/@atlaskit/inline-dialog/codemods/2.0.0-bar.ts',
	'node_modules/@atlaskit/inline-dialog/codemods/2.0.0-bar/index.ts',
	'node_modules/@atlaskit/range/codemods/3.0.0-baz/index.ts',
	'node_modules/@atlaskit/range/codemods/4.0.0-quux/index.ts',
];

describe('transforms', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		(globSync as jest.Mock).mockImplementation(() => codemodPaths);
	});

	describe('hasTransform', () => {
		it('should detect existing transform', () => {
			expect(hasTransform(codemodPaths[0])).toBe(true);
		});

		it('should not detect non-existing transform', () => {
			(globSync as jest.Mock).mockImplementation(() => []);
			expect(hasTransform('foo/bar.ts')).toBe(false);
		});
	});

	describe('getTransforms', () => {
		it('should get available transforms and presets', () => {
			(globSync as jest.Mock)
				.mockImplementationOnce(() => presets)
				.mockImplementationOnce(() => codemodPaths)
				.mockImplementation(() => []);

			const transforms = getTransforms();

			expect(transforms).toEqual(
				[...presets, ...codemodPaths].map((codemodPath) => path.parse(codemodPath)),
			);

			// There should be a part here that tests what arguments globSync is called with
			// The problem is that globSync is called a variable number of times based on the length of presets
			// Ideally we would just use a consistent glob to represent all presets and not import them at all
		});

		it('should filter transforms for a single package', () => {
			(globSync as jest.Mock)
				.mockImplementationOnce(() => [])
				.mockImplementationOnce(() => ['node_modules/@atlaskit/button/codemods/5.0.0-foo.ts'])
				.mockImplementationOnce(() => []);

			const transforms = getTransforms([{ name: '@atlaskit/button', version: null }]);

			expect((globSync as jest.Mock).mock.calls[0][0]).toEqual(
				expect.stringContaining('node_modules/{@atlaskit/button,}/codemods/*.@(ts|tsx|js)'),
			);
			expect((globSync as jest.Mock).mock.calls[1][0]).toEqual(
				expect.stringContaining('node_modules/{@atlaskit/button,}/codemods/*/index.@(ts|tsx|js)'),
			);

			expect(transforms).toEqual(
				['node_modules/@atlaskit/button/codemods/5.0.0-foo.ts'].map((codemodPath) =>
					path.parse(codemodPath),
				),
			);
		});

		it('should filter transforms for a single package with a version - codemods exist above version', () => {
			(globSync as jest.Mock)
				.mockImplementationOnce(() => ['node_modules/@atlaskit/button/codemods/5.0.0-foo.ts'])
				.mockImplementationOnce(() => []);

			const transforms = getTransforms([{ name: '@atlaskit/button', version: '4.0.0' }]);

			expect((globSync as jest.Mock).mock.calls[0][0]).toEqual(
				expect.stringContaining('node_modules/{@atlaskit/button,}/codemods/*.@(ts|tsx|js)'),
			);
			expect((globSync as jest.Mock).mock.calls[1][0]).toEqual(
				expect.stringContaining('node_modules/{@atlaskit/button,}/codemods/*/index.@(ts|tsx|js)'),
			);

			expect(transforms).toEqual(
				['node_modules/@atlaskit/button/codemods/5.0.0-foo.ts'].map((codemodPath) =>
					path.parse(codemodPath),
				),
			);
		});

		it('should filter transforms for a single package with a version - NO codemods exist above version', () => {
			(globSync as jest.Mock)
				.mockImplementationOnce(() => ['node_modules/@atlaskit/button/codemods/5.0.0-foo.ts'])
				.mockImplementationOnce(() => []);

			const transforms = getTransforms([{ name: '@atlaskit/button', version: '5.0.0' }]);

			expect(transforms).toEqual([]);
		});

		it('should filter transforms for multiple packages', () => {
			(globSync as jest.Mock)
				.mockImplementationOnce(() => [
					'node_modules/@atlaskit/button/codemods/5.0.0-foo.ts',
					'node_modules/@atlaskit/range/codemods/3.0.0-baz/index.ts',
					'node_modules/@atlaskit/range/codemods/4.0.0-quux/index.ts',
				])
				.mockImplementationOnce(() => []);

			const transforms = getTransforms([
				{ name: '@atlaskit/button', version: '4.0.0' },
				{ name: '@atlaskit/range', version: '3.1.4' },
			]);

			expect((globSync as jest.Mock).mock.calls[0][0]).toEqual(
				expect.stringContaining(
					'node_modules/{@atlaskit/button,@atlaskit/range,}/codemods/*.@(ts|tsx|js)',
				),
			);
			expect((globSync as jest.Mock).mock.calls[1][0]).toEqual(
				expect.stringContaining(
					'node_modules/{@atlaskit/button,@atlaskit/range,}/codemods/*/index.@(ts|tsx|js)',
				),
			);

			expect(transforms).toEqual(
				[
					'node_modules/@atlaskit/button/codemods/5.0.0-foo.ts',
					'node_modules/@atlaskit/range/codemods/4.0.0-quux/index.ts',
				].map((codemodPath) => path.parse(codemodPath)),
			);
		});
	});

	describe('parseTransformPath', () => {
		it('should parse transform path', () => {
			expect(parseTransformPath(codemodPaths[0])).toEqual(path.parse(codemodPaths[0]));
		});
	});

	describe('getTransformPath', () => {
		it('should build transform path', () => {
			const parsedPath = path.parse(codemodPaths[0]);

			expect(getTransformPath(parsedPath)).toEqual(codemodPaths[0]);
		});
	});

	describe('getTransformModule', () => {
		it('should extract the module name from a transform path', () => {
			const versionFilename = path.parse('node_modules/@atlaskit/button/codemods/5.0.0-foo.ts');
			expect(getTransformModule(versionFilename)).toBe('@atlaskit/button');

			const indexFilename = path.parse('node_modules/@atlaskit/range/codemods/4.0.0-quux/index.ts');
			expect(getTransformModule(indexFilename)).toBe('@atlaskit/range');
		});
	});

	describe('getTransformVersion', () => {
		it('should extract the version from a transform path', () => {
			const versionFilename = path.parse('node_modules/@atlaskit/button/codemods/5.0.0-foo.ts');
			expect(getTransformVersion(versionFilename)).toBe('5.0.0');

			const indexFilename = path.parse('node_modules/@atlaskit/range/codemods/4.0.0-quux/index.ts');
			expect(getTransformVersion(indexFilename)).toBe('4.0.0');
		});
	});
});
