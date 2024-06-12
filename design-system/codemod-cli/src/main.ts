import chalk from 'chalk';
import fs from 'fs';
import { type ParsedPath } from 'path';
import spawn from 'projector-spawn';
import { AutoComplete } from 'enquirer';
import semver from 'semver';
const jscodeshift = require.resolve('.bin/jscodeshift');

import { fixLineEnding } from './utils';

import {
	getTransforms,
	getTransformPath,
	hasTransform,
	parseTransformPath,
	getTransformModule,
} from './transforms';
import {
	type Flags,
	type Default,
	ValidationError,
	NoTransformsExistError,
	type ParsedPkg,
} from './types';
import { getPackagesSinceRef } from './sinceRef';
import { findDependentPackagePaths } from './filepath';

interface TransformMeta extends ParsedPath {
	id?: string;
}

const applyTransformMeta = (transforms: ParsedPath[]): TransformMeta[] =>
	transforms.map((transform) => {
		const moduleMatch = transform.dir.match(/\/@atlaskit\/[^\/]+\//);

		if (moduleMatch) {
			const moduleName = moduleMatch[0].substring(1, moduleMatch[0].length - 1);
			const transformName =
				transform.name === 'index'
					? transform.dir.slice(transform.dir.lastIndexOf('/') + 1)
					: transform.name;

			return {
				...transform,
				id: `${moduleName}: ${transformName}`,
			};
		}

		const presetMatch = transform.dir.match(/\/codemod-cli\/.+\/presets/);

		if (presetMatch) {
			const transformName =
				transform.name === 'index'
					? transform.dir.slice(transform.dir.lastIndexOf('/') + 1)
					: transform.name;

			return {
				...transform,
				id: `@atlaskit/codemod-cli: ${transformName}`,
			};
		}

		return {
			...transform,
			id: `${transform.dir}/${transform.name}`,
		};
	});

const getTransformPrompt = async (transforms: ParsedPath[]): Promise<ParsedPath> => {
	const transformMeta = applyTransformMeta(transforms);

	return await new AutoComplete({
		message: 'Select which transform would you like to run? 🤔',
		limit: 18,
		choices: transformMeta.map(({ id, name, dir }) => (id ? id : `${dir}/${name}`)),
		result: (choice: string) =>
			transformMeta.find(({ id, dir }) => id === choice || dir === choice),
	}).run();
};

const resolveTransform = async (flags: Flags, transforms: ParsedPath[]): Promise<ParsedPath> => {
	if (flags.preset) {
		const transform = transforms.find(({ name }) => name === flags.preset);

		if (!transform) {
			// eslint-disable-next-line no-console
			console.warn(`No preset found for: ${chalk.bgRed(flags.preset)}`);
		} else {
			return transform; // Return only if transform found.
		}
	}

	if (flags.transform && hasTransform(flags.transform)) {
		return parseTransformPath(flags.transform);
	}

	if (flags.transform && !hasTransform(flags.transform)) {
		// eslint-disable-next-line no-console
		console.warn(`No available transform found for: ${chalk.bgRed(flags.transform)}`);
	}

	return await getTransformPrompt(transforms);
};

const runTransform = async (
	filePaths: string[],
	transform: ParsedPath & { module: string },
	flags: Flags,
) => {
	const { logger } = flags;
	logger.log(
		chalk.green(
			`Running transform '${chalk.bold(transform.name)}' over ${chalk.bold(
				filePaths.join(', '),
			)}...`,
		),
	);
	let codemodDirs = filePaths;
	if (flags.filterPaths) {
		logger.log(chalk.green(`Running filtering logic for module ${transform.module}...`));
		codemodDirs = await findDependentPackagePaths(filePaths, transform.module);
		if (codemodDirs.length === 0) {
			// Fallback to non-filter logic if filtering returns no directories
			logger.log(
				chalk.yellow(
					`Could not filter source paths for ${transform.module}, falling back to running over all specified paths. (See --no-filter-paths flag)`,
				),
			);
			codemodDirs = filePaths;
		} else {
			logger.log(
				chalk.green(
					`Running transform '${chalk.bold(
						transform.name,
					)}' over filtered dirs ${chalk.bold(codemodDirs.join(', '))}...`,
				),
			);
		}
	}
	logger.log(
		chalk.green(
			`Transforming files matching these extensions '${chalk.bold(flags.extensions)}'...`,
		),
	);

	const transformPath = getTransformPath(transform);

	const args = Object.keys(flags).reduce(
		(acc, key) => {
			if (
				![
					'transform',
					'parser',
					'extensions',
					'ignorePattern',
					'logger',
					'packages',
					'sinceRef',
					'preset',
					'failOnError',
				].includes(key)
			) {
				acc.unshift(`--${key}=${flags[key as keyof Flags]}`);
			}
			return acc;
		},
		[
			`--transform=${transformPath}`,
			`--ignore-pattern=${flags.ignorePattern}`,
			`--parser=${flags.parser}`,
			`--extensions=${flags.extensions}`,
			// Limit CPUs to 8 to prevent issues when running on CI with a large amount of cpus
			'--cpus=8',
			...codemodDirs,
		],
	);

	if (flags.failOnError) {
		args.unshift('--fail-on-error');
	}

	// To avoid https://github.com/facebook/jscodeshift/issues/424 where the jscodeshift.js file is `CRLF` ending.
	// The workaround to use only the `node_modules` indicated in this ticket will not work as we run this code as CLI in products repository
	// that may not have jscodeshift installed.
	const jscodeshiftContent = fs.readFileSync(jscodeshift, 'utf8');
	const jscodeshiftContentNew = fixLineEnding(jscodeshiftContent, 'LF');
	fs.writeFileSync(jscodeshift, jscodeshiftContentNew);

	await spawn(jscodeshift, args, { stdio: 'inherit' });
};

const parsePkg = (pkg: string) => {
	if (!pkg.startsWith('@')) {
		throw new ValidationError('Package names must be fully qualified and begin with "@"');
	}
	let name = pkg;
	let version = null;
	const parts = pkg.split('@');
	if (parts.length > 2) {
		name = `@${parts[1]}`;
		version = parts[parts.length - 1];
	}
	return {
		name,
		version,
	};
};

const parsePackagesFlag = (packages: string) => {
	return packages.split(',').map(parsePkg);
};

const validatePackages = (packages?: ParsedPkg[], errorCallback?: (errors: string[]) => void) => {
	if (!packages) {
		return;
	}

	const errors: string[] = [];
	const transformedPackages = packages.map((pkg) => {
		let version = null;
		if (pkg.version != null) {
			if (semver.validRange(pkg.version)) {
				version = semver.valid(semver.minVersion(pkg.version));
			} else {
				errors.push(`Invalid version "${pkg.version}" for package "${pkg.name}"`);
			}
		}
		return { ...pkg, version };
	});
	if (errors.length > 0) {
		errorCallback && errorCallback(errors);
	}

	return transformedPackages;
};

const parseArgs = async (input: string[], flags: Flags) => {
	let packages;
	if (!input[0]) {
		throw new ValidationError('Please supply a path to the source files you wish to modify');
	}

	if (flags.packages) {
		const unvalidatedPackages = parsePackagesFlag(flags.packages);
		packages = validatePackages(unvalidatedPackages, (errors) => {
			throw new ValidationError(errors.join('\n'));
		});
	} else if (flags.sinceRef) {
		const unvalidatedPackages = await getPackagesSinceRef(flags.sinceRef);
		packages = validatePackages(unvalidatedPackages, (errors) => {
			throw new Error(
				`Detected invalid previous versions of packages upgraded since "${
					flags.sinceRef
				}". Previous versions must be valid semver.\n${errors.join('\n')}`,
			);
		});
	}

	return {
		packages,
	};
};

const defaultFlags = {
	parser: 'babel' as const,
	extensions: 'js',
	ignorePattern: 'node_modules',
	logger: console,
};
export type UserFlags = Default<Flags, keyof typeof defaultFlags>;

export default async function main(input: string[], userFlags: UserFlags) {
	const flags: Flags = { ...defaultFlags, ...userFlags };
	const logger = flags.logger;

	const { packages } = await parseArgs(input, flags);
	const { _PACKAGE_VERSION_ = '0.0.0-dev' } = process.env;

	logger.log(
		chalk.bgBlue(chalk.black(`📚 Atlassian-Frontend codemod library @ ${_PACKAGE_VERSION_} 📚`)),
	);

	if (packages && packages.length > 0) {
		logger.log(
			chalk.gray(
				`Searching for codemods for newer versions of the following packages: ${packages.map(
					(pkg) => `${pkg.name}${pkg.version ? '@' + pkg.version : ''}`,
				)}`,
			),
		);
	}
	const shouldHavePackages = flags.sinceRef || (flags.packages && flags.packages.length > 0);
	if (shouldHavePackages && packages?.length === 0) {
		logger.log(chalk.gray(`Did not find updated packages, exiting`));

		return {
			transforms: [],
		};
	}

	const availableTransforms = getTransforms(packages);

	if (availableTransforms.length === 0) {
		throw new NoTransformsExistError(
			'No codemods available. Please make sure you have the latest version of the packages you are trying to upgrade before running the codemod',
		);
	}

	const transforms = packages
		? availableTransforms
		: [await resolveTransform(flags, availableTransforms)];

	const transformsWithModule = transforms.map((transform) => ({
		...transform,
		module: getTransformModule(transform),
	}));

	logger.log(
		chalk.cyan(
			`Running the following transforms \n${chalk.bold(
				transformsWithModule
					.map((transform) => `${transform.module}: ${transform.name}`)
					.join('\n'),
			)}`,
		),
	);

	for (const transform of transformsWithModule) {
		await runTransform(input, transform, flags);
	}

	return {
		transforms: transformsWithModule,
	};
}
