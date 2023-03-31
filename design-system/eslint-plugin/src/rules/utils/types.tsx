export type DeprecatedCategories = 'jsxAttributes' | 'imports';

export type DeprecatedConfig =
  | DeprecatedJSXAttributeConfig
  | DeprecatedImportConfig;

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
};

export const isDeprecatedImportConfig = (
  config: DeprecatedImportConfig | DeprecatedJSXAttributeConfig,
): config is DeprecatedImportConfig => {
  return (
    Object.values(config)[0].message !== undefined ||
    Object.values(config)[0].importSpecifiers !== undefined
  );
};

// Checks if the value of object is an array, will need to update this method if we add other deprecated types with array values
export const isDeprecatedJSXAttributeConfig = (
  config: DeprecatedImportConfig | DeprecatedJSXAttributeConfig,
): config is DeprecatedJSXAttributeConfig => {
  return Array.isArray(Object.values(config)[0]);
};
