import semver from 'semver';

import { getValidatedConfig } from './validate-deprecated-apis-config';

export const filterActionableDeprecations = (
  originalDeprecatedConfig: string,
  rootPackageJson: string,
) => {
  // verify the config is valid and parse it to an object
  const validatedDeprecatedConfig = getValidatedConfig(
    originalDeprecatedConfig,
  );

  // verify the root package.json is valid and parse it to an object
  let rootPackageDependencies: Record<string, string> | undefined;
  try {
    rootPackageDependencies = JSON.parse(rootPackageJson).dependencies;
    if (!rootPackageDependencies) {
      throw new Error(
        'No dependencies found in the provided root package.json',
      );
    }
  } catch (e) {
    const error = e as Error;
    throw new Error(`Failed to parse root package.json: ${error.message}`);
  }

  const filteredConfig = {};
  // filter out the deprecated APIs that are not actionable
  for (const [apiKey, apiValues] of Object.entries(validatedDeprecatedConfig)) {
    const filterApiValues = apiValues.filter((apiValue) => {
      const { moduleSpecifier, actionableVersion } = apiValue;

      // if actionableVersion is not provided in the deprecated APIs config, it is actionable on all versions
      if (!actionableVersion) {
        return true;
      }

      const installedVersion = rootPackageDependencies?.[moduleSpecifier];
      const coercedInstalledVersion = semver.coerce(installedVersion);
      if (!coercedInstalledVersion) {
        throw new Error(
          `No valid ${moduleSpecifier} found in the dependencies of root package.json.`,
        );
      }

      const coercedActionableVersion = semver.coerce(actionableVersion);
      if (!coercedActionableVersion) {
        throw new Error(
          `Actionable version is invalid for ${moduleSpecifier} in the deprecated APIs config.`,
        );
      }
      return semver.gte(coercedInstalledVersion, coercedActionableVersion);
    });
    if (filterApiValues.length > 0) {
      Object.assign(filteredConfig, {
        [apiKey]: filterApiValues,
      });
    }
  }

  return JSON.stringify(filteredConfig);
};
