import { exec } from 'child_process';
import { promisify } from 'util';
import * as semver from 'semver';

export type Dependency = { name: string; version: string };
export type DependenciesList = Array<Dependency>;

const pexec = promisify(exec);

export function isShouldUpdateDep(oldVersion: string, newVersion: string) {
  if (oldVersion === '*') {
    return true;
  }
  if (newVersion === '*') {
    return false;
  }

  return semver.gt(semver.coerce(newVersion)!, semver.coerce(oldVersion)!);
}

export function getLatest(packageName: string) {
  return show(packageName, ['versions']).then(response => response.pop());
}

export function getDependencies(
  packageName: string,
  version: string | null = 'latest',
) {
  return show(`${packageName}${version ? '@' + version : ''}`, [
    'dependencies',
    'devDependencies',
    'peerDependencies',
  ]);
}

export function postProcessDependeciesList(
  packages: DependenciesList,
): DependenciesList {
  return Array.from(
    packages
      .reduce<Map<string, Dependency>>((acc, item) => {
        const prevVersion = (acc.get(item.name) || { version: null }).version;
        if (!prevVersion || isShouldUpdateDep(prevVersion, item.version)) {
          acc.set(item.name, item);
        }
        return acc;
      }, new Map())
      .values(),
  );
}

function toDepsList(list: Array<[string, string]>) {
  return list.map(dep => ({ name: dep[0], version: dep[1] }));
}

export async function getFlatDependenciesList(
  packages: DependenciesList,
  exclude: Array<string> = [],
  depth: number = 1,
): Promise<DependenciesList> {
  const dependencies = (
    await Promise.all(
      packages.map(async pkg => {
        const rawDeps = await getDependencies(
          pkg.name,
          (semver as any).coerce(pkg.version),
        );

        if (!rawDeps) {
          return [];
        }

        return [
          ...Object.entries<string>(rawDeps.dependencies || {}).filter(
            ([name]) => exclude.indexOf(name) === -1,
          ),
          ...Object.entries<string>(rawDeps.peerDependencies || {}).filter(
            ([name]) => exclude.indexOf(name) === -1,
          ),
        ];
      }),
    )
  ).reduce((acc, item) => acc.concat(item), []);

  if (depth > 0) {
    return postProcessDependeciesList([
      ...toDepsList(dependencies),
      ...(await getFlatDependenciesList(
        toDepsList(dependencies),
        exclude,
        depth - 1,
      )),
    ]);
  }

  return postProcessDependeciesList(toDepsList(dependencies));
}

export function show(packageName: string, fields: Array<string>) {
  return pexec(`npm show ${packageName} ${fields.join(' ')} --json`).then(
    ({ stdout }) => {
      return stdout ? JSON.parse(stdout) : null;
    },
  );
}
