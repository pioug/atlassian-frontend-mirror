import { readFile, writeFile } from './fs';
import { DependenciesList, isShouldUpdateDep } from './npm';

export type PackageJson = {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
};

export type PackageJsonPatch = {
  dependencies: PackageJsonPatchGroup;
  devDependencies: PackageJsonPatchGroup;
  peerDependencies: PackageJsonPatchGroup;
};

export type PackageJsonPatchGroup = Record<string, [string, string]>;

export async function loadPackageJson(packageJsonPath: string) {
  return JSON.parse(await readFile(packageJsonPath, 'utf8'));
}

export function getPackageVersion(
  packageJson: PackageJson,
  packageName: string,
) {
  if (packageJson.dependencies && packageJson.dependencies[packageName]) {
    return packageJson.dependencies[packageName];
  }
  if (packageJson.devDependencies && packageJson.devDependencies[packageName]) {
    return packageJson.devDependencies[packageName];
  }
  return;
}

export function createPackageJsonPatch(
  packageJson: PackageJson,
  deps: DependenciesList,
): PackageJsonPatch {
  const getDep = (
    packageJson: PackageJson,
    dep: string,
  ): {
    type: 'dependencies' | 'devDependencies' | 'peerDependencies';
    version: string;
  } | null =>
    packageJson.dependencies && packageJson.dependencies[dep]
      ? { type: 'dependencies', version: packageJson.dependencies[dep] }
      : packageJson.devDependencies && packageJson.devDependencies[dep]
      ? { type: 'devDependencies', version: packageJson.devDependencies[dep] }
      : packageJson.peerDependencies && packageJson.peerDependencies[dep]
      ? { type: 'peerDependencies', version: packageJson.peerDependencies[dep] }
      : null;

  return deps.reduce<PackageJsonPatch>(
    (acc, targetDep) => {
      const sourceDep = getDep(packageJson, targetDep.name);
      if (
        sourceDep &&
        isShouldUpdateDep(sourceDep.version, targetDep.version)
      ) {
        acc[sourceDep.type][targetDep.name] = [
          sourceDep.version,
          targetDep.version,
        ];
      }
      return acc;
    },
    { dependencies: {}, devDependencies: {}, peerDependencies: {} },
  );
}

export async function updatePackageJson(
  packageJsonPath: string,
  patch: PackageJsonPatch,
) {
  const update = (
    packageJson: PackageJson,
    type: 'dependencies' | 'devDependencies' | 'peerDependencies',
    dep: string,
    version: string,
  ) => {
    packageJson[type][dep] = version;
  };

  const packageJson = await loadPackageJson(packageJsonPath);

  Object.entries(patch.dependencies).forEach(([name, version]) => {
    update(packageJson, 'dependencies', name, version[1]);
  });
  Object.entries(patch.devDependencies).forEach(([name, version]) => {
    update(packageJson, 'devDependencies', name, version[1]);
  });
  Object.entries(patch.peerDependencies).forEach(([name, version]) => {
    update(packageJson, 'peerDependencies', name, version[1]);
  });

  return await writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 4),
    'utf8',
  );
}
