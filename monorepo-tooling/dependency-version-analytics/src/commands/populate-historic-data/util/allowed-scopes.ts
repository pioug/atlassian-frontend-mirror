const defaultScopes = ['@atlaskit', '@atlassian', '@atlassiansox'];

export const getSupportedScopes = (enableNonAtlaskitPackages: boolean = false): string[] => {
	return enableNonAtlaskitPackages ? defaultScopes : ['@atlaskit'];
};

export const isPackageFromSupportedScopes = (
	packageName: string,
	supportedScopes: string[] = defaultScopes,
): boolean => {
	return supportedScopes.some((scope) => packageName.startsWith(scope));
};
