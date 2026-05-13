import type { DeprecatedImportConfig, DeprecatedJSXAttributeConfig } from './types';

export const isDeprecatedJSXAttributeConfig = (
	config: DeprecatedImportConfig | DeprecatedJSXAttributeConfig,
): config is DeprecatedJSXAttributeConfig => {
	return Array.isArray(Object.values(config)[0]);
};
