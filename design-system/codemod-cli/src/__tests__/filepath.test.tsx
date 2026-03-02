import { findDependentPackagePaths } from '../filepath';
const packagePaths = ['./packages'];

describe('filterFilePath', () => {
	it('gets correct packages with specified dependency', async () => {
		const packages = await findDependentPackagePaths(packagePaths, '@atlaskit/dep1');
		expect(packages).toEqual(['packages/design-system/codemod-cli/src/__tests__/__fixtures__/foo']);
	});

	it('gets correct packages with specified dependency', async () => {
		const packages = await findDependentPackagePaths(packagePaths, '@atlaskit/dep3');
		expect(packages.length).toBe(2);
		expect(packages).toEqual(
			expect.arrayContaining([
				'packages/design-system/codemod-cli/src/__tests__/__fixtures__/bar',
				'packages/design-system/codemod-cli/src/__tests__/__fixtures__/baz',
			]),
		);
	});

	it('gets empty array with dependency which does not exist', async () => {
		const packages = await findDependentPackagePaths(
			packagePaths,
			'@atlassian/thispackagedoesnotexist',
		);
		expect(packages).toEqual([]);
	});

	it('does not fail with bad package path', async () => {
		const packages = await findDependentPackagePaths(
			[...packagePaths, './this/path/does/not/exist'],
			'@atlaskit/dep1',
		);
		expect(packages).toEqual(['packages/design-system/codemod-cli/src/__tests__/__fixtures__/foo']);
	});
});
