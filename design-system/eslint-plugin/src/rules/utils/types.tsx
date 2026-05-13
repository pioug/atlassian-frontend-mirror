export type DeprecatedCategories = 'jsxAttributes' | 'imports';

export type DeprecatedConfig = DeprecatedJSXAttributeConfig | DeprecatedImportConfig;

export type DeprecatedJSXAttributeConfig = {
	[key: string]: DeprecatedJSXAttributeConfigEntry[];
};

export type DeprecatedJSXAttributeConfigEntry = {
	moduleSpecifier: string;
	namedSpecifiers?: string[];
	actionableVersion?: string;
};

export type DeprecatedImportConfig = {
	[key: string]: DeprecatedImportConfigEntry;
};

export type DeprecatedImportConfigEntry = {
	message?: string;
	importSpecifiers?: { importName: string; message: string }[];
	unfixable?: boolean;
};

export type Fix = {
	range: [number, number];
	text: string;
};
