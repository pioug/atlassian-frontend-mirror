import path from 'path';
import yargs from 'yargs';
import semverSatisfies from 'semver/functions/satisfies';
import semverPrerelease from 'semver/functions/prerelease';
import { PackageJson } from './types';
import { getFeature } from '@atlassian/repo-feature-flags';

export class PeerDependencyError extends Error {}

const cli = yargs
  .options('verbose', {
    type: 'boolean',
    default: false,
    description: `Show logs on stdout in CI for easier debugging`,
  })
  .options('internal-packages', {
    type: 'boolean',
    default: false,
    description:
      'Only check atlassian, atlaskit or atlassiansox scoped peer dependencies',
  });

const { verbose, internalPackages } = cli.argv;

function verboseLog(text: string) {
  if (verbose) {
    console.log(text);
  }
}

function getPeerDependencies(packageJson: PackageJson) {
  return Object.entries(packageJson.peerDependencies || {})
    .filter(([name]) => (internalPackages ? isInternalPackage(name) : true))
    .map(([name, value]) => ({ name, range: getVersionRange(value) }))
    .filter(({ range }) => !isPreRelease(range));
}

function isInternalPackage(name: string) {
  return ['@atlaskit', '@atlassian', '@atlassiansox'].some(scope =>
    name.includes(scope),
  );
}

function isPreRelease(version: string) {
  return !!semverPrerelease(version);
}

function getVersionRange(value: string) {
  if (value.startsWith('npm:')) {
    return value.substring(value.lastIndexOf('@') + 1);
  } else {
    return value;
  }
}

function getInstalledVersion(
  packageName: string,
  resolver: NodeJS.RequireResolve,
) {
  let modulePath: string;
  try {
    modulePath = resolver(`${packageName}/package.json`, {
      // process.cwd returns the path to the current package that has the postinstall check
      // We use this path as a starting point for the module resolution
      paths: [process.cwd()],
    });
  } catch (error: any) {
    throw new PeerDependencyError(
      `Failed to find peer dependency ${packageName}. ${error.toString()}`,
    );
  }
  verboseLog(
    `The package.json of package ${packageName} is found at ${modulePath}`,
  );
  const modulePackageJson = require(modulePath);
  return modulePackageJson.version;
}

// We have to inject resolver here so that we can mock it in tests
// because jest doesn't allow mocking require.resolve atm.
export async function main(resolver = require.resolve) {
  try {
    if (!(await getFeature('peer-dependency-enforcement_operational', false))) {
      verboseLog(
        `Feature flag peer-dependency-enforcement_operational is turned off. Skipping the check`,
      );
      return;
    }

    const packageJsonPath =
      process.env.npm_package_json ||
      path.resolve(process.cwd(), 'package.json');
    const currentPackageJson = require(packageJsonPath);
    const { name: currentPackageName, version: currentPackageVersion } =
      currentPackageJson;
    if (isPreRelease(currentPackageVersion)) {
      verboseLog(
        `Skip checking peer dependencies of package ${currentPackageName} since it's at a pre-release version ${currentPackageVersion}`,
      );
      return;
    }
    verboseLog(`Checking peer dependencies of package ${currentPackageName}`);
    const peerDependencies = getPeerDependencies(currentPackageJson);
    verboseLog(`Listed peer dependencies: ${JSON.stringify(peerDependencies)}`);

    const unmetPeerDependencies = peerDependencies
      .map(dep => ({
        ...dep,
        installedVersion: getInstalledVersion(dep.name, resolver),
      }))
      .filter(({ installedVersion, range, name }) => {
        if (isPreRelease(installedVersion)) {
          verboseLog(
            `Skip checking the peer dependency ${name} since it resolves to a prerelease ${installedVersion}`,
          );
          return false;
        }
        return !semverSatisfies(installedVersion, range, {
          includePrerelease: true,
        });
      });
    if (unmetPeerDependencies.length > 0) {
      throw new PeerDependencyError(
        `Package ${currentPackageName} has incompatible versions for its peer dependencies: ${unmetPeerDependencies.map(
          ({ name, installedVersion }) => `${name} at ${installedVersion} `,
        )}`,
      );
    }
  } catch (error: any) {
    // We only abort installs on peer dependency errors.
    // For any other unexpected exceptions, we just log them for now.
    // Might add some failure notifications later.
    verboseLog(error.toString());
    if (error instanceof PeerDependencyError) {
      verboseLog('Found unmet peer dependencies, will abort install');
      throw error;
    }
  }
}
