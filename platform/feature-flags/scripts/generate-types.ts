/* eslint-disable no-console */
import fs from 'fs/promises';
import path from 'path';
import process from 'process';

const PLATFORM_FEATURE_FLAG_KEY = 'platform-feature-flags' as const;

type DefinedFeatureFlagTypes = 'boolean';

type FeatureFlagsGroupedByType = {
  [type in DefinedFeatureFlagTypes]: string[];
};

const featureFlagStubs: FeatureFlagsGroupedByType = {
  boolean: [],
};

type FeatureFlagTypeDef = {
  type: DefinedFeatureFlagTypes;
};

type PackageJson = {
  name: string;
  [PLATFORM_FEATURE_FLAG_KEY]: { [flagKey: string]: FeatureFlagTypeDef };
};

/**
 * Find the root of the monorepo for when this package is used outside of the atlassian-frontend repo.
 */
async function findMonorepoRoot(): Promise<string> {
  let currentDir = process.cwd();
  let lastSeenPackageDir: string = currentDir;
  while (true) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    try {
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, 'utf8'),
      );
      // if "workspaces" found on package.json return it since monorepo root defines it.
      if (packageJson.workspaces) {
        return currentDir;
      }

      lastSeenPackageDir = currentDir;
    } catch (error) {
      // we expect to not be able to find files, ignore
    }
    const parentDir = path.dirname(currentDir);

    // if parent and current are the same we've reached filesystem root.
    // return last seen package directory in that case.
    if (parentDir === currentDir) {
      return lastSeenPackageDir;
    }

    currentDir = parentDir;
  }
}

// directories to skip in order to improve performance for package.json scanning
const ignoredDirs: string[] = [
  '__generated__',
  'generated',
  'src',
  '.bin',
  '.cache',
  'dist',
  'assets',
  '__typings__',
];

const exists = async (f: string): Promise<boolean> => {
  try {
    await fs.stat(f);
    return true;
  } catch {
    return false;
  }
};

// return a big list of the content of all package.json's under the directory specified.
const getAllPackageJson = async (rootDir: string): Promise<PackageJson[]> => {
  // Create a list to store the parsed package.json objects
  const packageJsonList: PackageJson[] = [];

  // Read the root directory and get a list of all the subdirectories
  let subDirs: string[] = (await fs.readdir(rootDir, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // Read the package.json file in the root directory
  const packageJsonPath = path.join(rootDir, 'package.json');
  if (await exists(packageJsonPath)) {
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
    try {
      const json: PackageJson = JSON.parse(packageJsonContent);
      packageJsonList.push(json);
    } catch (e) {}
  }

  // Recursively read the package.json files in the subdirectories
  packageJsonList.push(
    ...(
      await Promise.all(
        subDirs
          .filter((dir) => !ignoredDirs.includes(dir))
          .map((subDir) => getAllPackageJson(path.join(rootDir, subDir))),
      )
    ).flat(),
  );
  return packageJsonList;
};

// get the registered feature flags for all packages defined under the directory specified.
const getFeatureFlagRegistrations = async (
  rootDir: string,
): Promise<{ [key: string]: FeatureFlagTypeDef }> => {
  return (await getAllPackageJson(rootDir)).reduce((acc, p) => {
    const ff = p[PLATFORM_FEATURE_FLAG_KEY];

    const commonKeys =
      (ff && Object.keys(acc).filter((k) => ff[k] != null)) ?? [];

    // verify key types are the same
    commonKeys.forEach((key) => {
      if (ff[key].type !== acc[key].type) {
        throw new Error(
          `feature flag ${key} has conflicting registration types!`,
        );
      }
    });

    if (ff) {
      return { ...acc, ...ff };
    }
    return acc;
  }, {} as Record<string, FeatureFlagTypeDef>);
};

// group feature flag registrations by the "type" field for easier generation later.
const groupFeatureFlagRegistrations = (featureFlags: {
  [key: string]: FeatureFlagTypeDef;
}): Partial<FeatureFlagsGroupedByType> => {
  return Object.entries(featureFlags).reduce((acc, [ffName, ffDef]) => {
    if (acc[ffDef.type] == null) {
      return { ...acc, [ffDef.type]: [ffName] };
    }

    acc[ffDef.type]?.push(ffName);

    return acc;
  }, {} as Partial<FeatureFlagsGroupedByType>);
};

const generateTypeDefinitions = (
  groupedFeatureFlags: Partial<FeatureFlagsGroupedByType>,
): string[] => {
  const groupedFeatureFlagsWithStubs: typeof groupedFeatureFlags = {
    ...featureFlagStubs,
    ...groupedFeatureFlags,
  };

  return Object.entries(groupedFeatureFlagsWithStubs).map(([type, flags]) => {
    if (featureFlagStubs[type as DefinedFeatureFlagTypes] == null) {
      throw new Error(`invalid type for feature flag: ${type}`);
    }

    const capitalType = type.charAt(0).toUpperCase() + type.slice(1);

    const flagsUnionType =
      flags.length === 0 ? 'never' : flags.map((f) => `"${f}"`).join(' | ');

    return `export type ${capitalType}FeatureFlagType = ${flagsUnionType};`;
  });
};

export const main = async () => {
  const root = await findMonorepoRoot();

  const featureFlags = await getFeatureFlagRegistrations(root);

  const groupedFeatureFlags = groupFeatureFlagRegistrations(featureFlags);

  const typeDefs = generateTypeDefinitions(groupedFeatureFlags);

  const fileContent =
    '/** AUTOGENERATED DO NOT EDIT **/\n\n' + typeDefs.join('\n') + '\n';

  await fs.writeFile('types.generated.ts', fileContent);
};

if (require.main === module) {
  main();
}
