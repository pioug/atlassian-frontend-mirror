export const PFF_GLOBAL_KEY = '__PLATFORM_FEATURE_FLAGS__' as const;
export const pkgName = '@atlaskit/platform-feature-flags';
export const hasProcessEnv: boolean =
	typeof process !== 'undefined' && typeof process.env !== 'undefined';
export type FeatureFlagResolverBoolean = (key: string) => boolean;
