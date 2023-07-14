import path, { ParsedPath } from 'path';
import glob from 'glob';
import semver from 'semver';
import presets from './presets';
import { ParsedPkg } from './types';

const basePath = (packages?: ParsedPkg[]) => {
  const packageDirectory =
    packages && packages.length > 0
      ? [`{${packages.map((pkg) => pkg.name).join(',')},}`]
      : ['@{atlaskit,atlassian,atlassiansox}', '*'];

  return path.join(
    process.cwd(),
    'node_modules',
    ...packageDirectory,
    'codemods',
  );
};

export const hasTransform = (transformPath: string) =>
  glob.sync(transformPath).length > 0;

/** Retrieves transforms for `packages` if provided, otherwise all transforms including presets */
export const getTransforms = (packages?: ParsedPkg[]): ParsedPath[] => {
  const transforms = [
    path.join(basePath(packages), '*.@(ts|tsx|js)'),
    path.join(basePath(packages), '*', 'index.@(ts|tsx|js)'),
  ];

  if (!packages) {
    transforms.unshift(...presets);
  }

  return transforms
    .map((transform) => glob.sync(transform))
    .reduce((acc, val) => acc.concat(val), [])
    .map((transform) => parseTransformPath(transform))
    .filter(filterTransforms(packages))
    .sort();
};

export const parseTransformPath = (transformPath: string) =>
  path.parse(transformPath);

export const getTransformPath = ({ dir, base }: ParsedPath) => `${dir}/${base}`;

export const getTransformModule = (transform: ParsedPath) => {
  const pathSegments = transform.dir.split(path.sep);
  const nodeModulesIdx = pathSegments.indexOf('node_modules');
  // pathSegments will be of the form [node_modules, '@atlaskit', 'avatar', 'codemods']
  return pathSegments.slice(nodeModulesIdx + 1, nodeModulesIdx + 3).join('/');
};

export const getTransformVersion = (transform: ParsedPath) => {
  let transformName = transform.base;
  if (transformName.startsWith('index.')) {
    const pathSegments = transform.dir.split(path.sep);
    transformName = pathSegments[pathSegments.length - 1];
  }

  return transformName.split('-')[0];
};

const filterTransforms = (packages?: ParsedPkg[]) => {
  if (!packages || packages.length === 0) {
    return () => true;
  }
  const packageMap = new Map<string, string | null>(
    packages.map((pkg) => [pkg.name, pkg.version]),
  );
  return (transform: ParsedPath) => {
    const transformVersion = getTransformVersion(transform);
    const pkgVersion = packageMap.get(getTransformModule(transform));
    if (pkgVersion === undefined) {
      throw Error(
        `No corresponding package found for transform "${transform.dir}/${transform.base}`,
      );
    }

    if (transformVersion === 'next' || pkgVersion === null) {
      return true;
    } else if (semver.valid(transformVersion)) {
      return semver.gt(transformVersion, pkgVersion);
    } else {
      return false;
    }
  };
};
