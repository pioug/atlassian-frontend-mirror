import path, { type ParsedPath } from 'path';

import { globSync } from 'glob';
import semver from 'semver';

import { getTransformModule } from './get-transform-module';
import { getTransformVersion } from './get-transform-version';
import { parseTransformPath } from './parse-transform-path';
import presets from './presets';
import { type ParsedPkg } from './types';

const basePath = (packages?: ParsedPkg[]) => {
	const packageDirectory =
		packages && packages.length > 0
			? [`{${packages.map((pkg) => pkg.name).join(',')},}`]
			: ['@{atlaskit,atlassian,atlassiansox}', '*'];

	return path.join(process.cwd(), 'node_modules', ...packageDirectory, 'codemods');
};

const filterTransforms = (packages?: ParsedPkg[]) => {
	if (!packages || packages.length === 0) {
		return () => true;
	}
	const packageMap = new Map<string, string | null>(packages.map((pkg) => [pkg.name, pkg.version]));
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

export const getTransforms = (packages?: ParsedPkg[]): ParsedPath[] => {
	const transforms = [
		path.join(basePath(packages), '*.@(ts|tsx|js)'),
		path.join(basePath(packages), '*', 'index.@(ts|tsx|js)'),
	];

	if (!packages) {
		transforms.unshift(...presets);
	}

	return transforms
		.map((transform) => globSync(transform))
		.reduce((acc, val) => acc.concat(val), [])
		.map((transform) => parseTransformPath(transform))
		.filter(filterTransforms(packages))
		.sort();
};
