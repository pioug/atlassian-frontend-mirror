export const DEFAULT_TAG = 'atlaskit-dependency-version-analytics-last-run';

export const DEP_TYPES = [
	{
		packageJsonKey: 'devDependencies',
		depTypeName: 'devDependency',
	},
	{
		packageJsonKey: 'dependencies',
		depTypeName: 'dependency',
	},
	{
		packageJsonKey: 'peerDependencies',
		depTypeName: 'peerDependency',
	},
	{
		packageJsonKey: 'optionalDependencies',
		depTypeName: 'optionalDependency',
	},
] as const;
