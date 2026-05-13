import type { DeprecatedImportConfig, DeprecatedJSXAttributeConfig } from './types';

export const isDeprecatedImportConfig = (
	config: DeprecatedImportConfig | DeprecatedJSXAttributeConfig,
): config is DeprecatedImportConfig => {
	return (
		Object.values(config)[0].message !== undefined ||
		Object.values(config)[0].importSpecifiers !== undefined
	);
};
