/** Workspace code */

import debugModule from 'debug';
import micromatch from 'micromatch';
import semver from 'semver';
import type { DefaultLogFields, ListLogLine } from 'simple-git';

import { DEP_TYPES } from '../../../constants';
import { type DependencyType } from '../../../types';
import { assert } from '../../../util/assert';
import { showFile } from '../../../util/git';
import { type IPackageJSON } from '../../../util/package-json';
import { getWorkspacePaths, getWorkspacePackageJsonPaths } from '../../../util/yarn';
import { type DependencyMap } from '../types';
import { isPackageFromSupportedScopes } from '../util/allowed-scopes';

const debug = debugModule('atlaskit:dependency');

type DepInfo = {
	version: string;
	type: DependencyType;
	workspaces: Set<string>;
};

/**
 * Stores the state of atlaskit dependencies in a repository
 */
export class DependencyStore {
	/**
	 * We may want to work not in root, but in specific directory
	 * The reason is - some repositories have their package.json not in root
	 * For example "confluence-frontend" repo has package.json at "confluence-frontend/confluence/package.json"
	 */
	private subWorkDir?: string;
	/** Mapping of dependency names to arrays of unique dependency type + versions */
	private dependencies: Record<string, DepInfo[]> = {};
	/** Mapping of workspaces to their dependency map. Each dependency in their map links to an entry in `dependencies` */
	private workspaces: Record<string, Record<string, DepInfo>> = {};
	/** Set of workspace paths to their "package.json". Used to verify that a package.json is a valid workspace */
	private workspacePackageJsonPaths: Set<string> = new Set();
	private initialised = false;
	private supportedScopes: string[];
	private supportedPackages: string[];

	constructor({
		subWorkDir,
		supportedScopes,
		supportedPackages,
	}: {
		subWorkDir?: string;
		supportedScopes: string[];
		supportedPackages: string[];
	}) {
		this.subWorkDir = subWorkDir;
		this.supportedScopes = supportedScopes;
		this.supportedPackages = supportedPackages;
	}

	/** Scans the repo for dependencies at the specified git ref and return the flattened dependency map */
	async initialise(gitRef?: string): Promise<DependencyMap> {
		if (gitRef) {
			await this.resetStore(gitRef);
		}
		this.initialised = true;

		return this.getFlattenedDeps();
	}

	/** Updates the repo dependency store based on the changes in `logItem`.
	 * Returns the updated flattened dependencies
	 */
	async update({
		item,
		subWorkDir,
	}: {
		item: DefaultLogFields & ListLogLine;
		subWorkDir?: string;
	}): Promise<DependencyMap> {
		this.assertInitialised();
		const hash = item.hash;
		assert(!!item.diff, `Diff must exist in log ${item} ${hash}`);

		const changedPackageJsons = item.diff.files
			.filter((f) => f.file.endsWith('package.json'))
			.map((f) => f.file);

		const rootPackageJson = `${subWorkDir ? `${subWorkDir}/` : ''}package.json`;

		const didRootPackageJsonChange = !!changedPackageJsons.find((file) => file === rootPackageJson);

		if (didRootPackageJsonChange) {
			const workspacePackageJsonPaths = await getWorkspacePackageJsonPaths(hash, this.subWorkDir);

			const workspacePackageJsonPathsChanged =
				workspacePackageJsonPaths !== null &&
				(this.workspacePackageJsonPaths.size !== workspacePackageJsonPaths.size ||
					[...this.workspacePackageJsonPaths].some((glob) => !workspacePackageJsonPaths.has(glob)));

			if (workspacePackageJsonPathsChanged) {
				debug(
					`Workspace globs changed: ${[
						...(workspacePackageJsonPaths as Set<string>),
					]}. Resetting store.`,
				);

				await this.resetStore(hash);

				return this.getFlattenedDeps();
			}
		}

		const changedWorkspaces = micromatch(changedPackageJsons, [...this.workspacePackageJsonPaths]);

		debug(`Updating changed workspaces@${hash}: ${changedWorkspaces}`);

		// Iterate over all changed package.jsons rather than only valid workspaces so that we can
		// remove older workspaces that are no longer valid
		for (const workspacePath of changedPackageJsons) {
			let workspaceDeps = await this.getWorkspaceDependencies(hash, workspacePath);

			const validWorkspace = changedWorkspaces.includes(workspacePath);

			if (!validWorkspace && !this.workspaces[workspacePath]) {
				// Ignore package.jsons that aren't a valid workspace and weren't valid previously
				continue;
			}

			// For workspaces that are no longer a valid workspace but were previously, explicitly remove them
			const noLongerWorkspace = !validWorkspace && this.workspaces[workspacePath];

			if (workspaceDeps == null || noLongerWorkspace) {
				// If workspaceDeps is undefined, package.json existed but JSON was invalid
				// Else if workspaceDeps is null, package.json doesn't exist and has hence been deleted
				if (workspaceDeps === undefined) {
					console.error(`Error parsing metadata for workspace ${workspacePath}@${hash}`);
				}
				// set the workspaceDeps to empty here explicitly to remove any deleted workspaces
				workspaceDeps = {};
			}

			this.updateWorkspaces(workspacePath, workspaceDeps);
		}

		return this.getFlattenedDeps();
	}

	/** Retrieve a flattened list of p repo dependencies.
	 * If multiple versions of a dependency exist, the lowest version is returned.
	 * If the dependency is listed under multiple dependency types, 'dependencies' is prioritised over 'devDependencies'
	 */
	private getFlattenedDeps(): DependencyMap {
		const deps = Object.entries(this.dependencies)
			.filter(([, versions]) => versions.length > 0)
			.map(([depName, versions]) => [
				depName,
				DependencyStore.getMinimumVersion(versions, depName),
			]);

		return Object.fromEntries(deps);
	}

	private assertInitialised() {
		if (!this.initialised) {
			throw new Error('Class must be initialised first with `.initialise()`');
		}
	}

	/** Scans all workspaces in repo and rebuilds dependency store */
	private async resetStore(hash: string) {
		this.dependencies = {};
		this.workspaces = {};

		const workspaceGlobs = await getWorkspacePackageJsonPaths(hash, this.subWorkDir);
		if (workspaceGlobs !== null) {
			this.workspacePackageJsonPaths = workspaceGlobs;
		}
		const workspacePaths = await getWorkspacePaths(hash, this.workspacePackageJsonPaths);
		debug(`Workspace paths: ${workspacePaths}`);
		for (const wsPath of workspacePaths) {
			if (this.workspaces[wsPath]) {
				throw new Error(`Duplicate workspace path found: ${wsPath}`);
			}

			const workspaceDeps = await this.getWorkspaceDependencies(hash, wsPath);

			if (workspaceDeps == null) {
				continue;
			}
			this.updateWorkspaces(wsPath, workspaceDeps);
		}
	}

	private async getWorkspaceDependencies(
		hash: string,
		workspacePath: string,
	): Promise<DependencyMap | null | undefined> {
		let file;
		try {
			file = await showFile(hash, workspacePath);
		} catch (e) {
			debug(`Could not show file ${workspacePath}@${hash}`);
			return null;
		}

		let json: IPackageJSON;
		try {
			json = JSON.parse(file);
		} catch (e) {
			console.error(`Error parsing JSON - "${file}"@${hash}`);
			return undefined;
		}

		let workspaceDeps = {};

		for (const { packageJsonKey, depTypeName } of DEP_TYPES) {
			const wsDeps = this.getSupportedDependencies(json[packageJsonKey] || {}, depTypeName);

			workspaceDeps = { ...workspaceDeps, ...wsDeps };
		}

		return workspaceDeps;
	}

	private updateWorkspaces(workspacePath: string, workspaceDeps: DependencyMap) {
		debug(`Updating workspace ${workspacePath}`);
		if (!this.workspaces[workspacePath]) {
			this.workspaces[workspacePath] = {};
		}
		const prevWorkspaceDeps = this.workspaces[workspacePath];

		for (const depName of Object.keys(prevWorkspaceDeps)) {
			if (!workspaceDeps[depName]) {
				this.removeDependency(workspacePath, depName, prevWorkspaceDeps[depName]);
			}
		}

		for (const [depName, { version, type }] of Object.entries(workspaceDeps)) {
			this.addDependency(workspacePath, depName, version, type);
		}
	}

	private addDependency(
		workspacePath: string,
		depName: string,
		version: string,
		type: DependencyType,
	) {
		if (!this.dependencies[depName]) {
			debug(`Adding new dep ${depName}`);
			this.dependencies[depName] = [];
		}
		const prevEntry = this.workspaces[workspacePath][depName];
		const existingEntry = this.dependencies[depName].find(
			(entry) => entry.version === version && entry.type === type,
		);

		if (existingEntry && existingEntry === prevEntry) {
			// We haven't added or updated the dep, exit early
			return;
		}

		if (prevEntry) {
			this.removeDependency(workspacePath, depName, prevEntry);
		}

		if (existingEntry) {
			existingEntry.workspaces.add(workspacePath);
			this.workspaces[workspacePath][depName] = existingEntry;
		} else {
			debug(`Adding new dependency version ${depName}@${version} (${type})`);
			const newEntry = {
				version,
				type,
				workspaces: new Set([workspacePath]),
			};
			this.dependencies[depName].push(newEntry);
			this.workspaces[workspacePath][depName] = newEntry;
		}
	}

	private removeDependency(workspacePath: string, depName: string, depEntry: DepInfo) {
		debug(`${depName} removed from ${workspacePath}`);
		assert(depEntry && depEntry.workspaces, `Dep entry should exist for ${depName}`);
		depEntry.workspaces.delete(workspacePath);

		if (depEntry.workspaces.size === 0) {
			debug(
				`No more workspaces depend on ${depName}@${depEntry.version} as a ${depEntry.type}, deleting`,
			);
			this.dependencies[depName] = this.dependencies[depName].filter((entry) => entry !== depEntry);
		}
	}

	private getSupportedDependencies(
		depMap: { [name: string]: string },
		dependencyType: DependencyType,
	): DependencyMap {
		return Object.entries(depMap).reduce(
			(supportedDependencies: DependencyMap, [rawPackageName, packageVersion]) => {
				// Ignore suffixed `--next` deps in jira used for independent upgrades
				if (rawPackageName.endsWith('--next')) {
					return supportedDependencies;
				}

				// Treat `--current` as the standard dependency
				const packageName = rawPackageName.replace(/--current$/, '');

				/**
				 * Checks if the package is from supported scope
				 * and if so, checks if the package is also from supported package list.
				 */
				const isPackageSupported =
					isPackageFromSupportedScopes(packageName, this.supportedScopes) &&
					// If supportedPackages wasn't specified, then we allow ANY packages
					(!this.supportedPackages.length ||
						/**
						 * All packageName's formatting, such as removing "--current" postfix, MUST be performed BEFORE the next line
						 * Packages in supportedPackages don't have postfixes, so checking for package with postfix will always return false
						 */
						this.supportedPackages.includes(packageName));

				if (isPackageSupported) {
					supportedDependencies[packageName] = {
						version: DependencyStore.transformDepVersion(packageVersion),
						type: dependencyType,
					};
				}

				return supportedDependencies;
			},
			{},
		);
	}

	private static getMinimumVersion(versions: DepInfo[], depName: string) {
		const depOrder = ['dependency', 'peerDependency', 'devDependency', 'optionalDependency'];
		// Sort deps before devDeps and then take the lowest version
		const sorted = versions.sort((a, b) => {
			const depSort = depOrder.indexOf(a.type) - depOrder.indexOf(b.type);
			if (depSort !== 0) {
				return depSort;
			}
			const aVersion = semver.coerce(a.version);
			const bVersion = semver.coerce(b.version);
			if (!aVersion) {
				console.error(`Invalid version ${depName}@${a.version}`);
				return 1;
			} else if (!bVersion) {
				console.error(`Invalid version ${depName}@${b.version}`);
				return -1;
			}
			return semver.compare(aVersion, bVersion);
		});

		if (sorted.length > 1) {
			debug(
				`Multiple versions found for ${depName}: ${JSON.stringify(
					sorted.map((depInfo) => ({
						...depInfo,
						workspaces: [...depInfo.workspaces],
					})),
				)}`,
			);
		}

		return sorted[0];
	}

	/* Coerce non-standard versions to a semver version.
	 * This essentially ignores everything up until the first number and then tries to parse a version
	 * out of that.
	 * Used to yarn alias versions used by jira's independent upgrades, e.g. npm:@atlaskit/button@^15.0.8
	 */
	private static transformDepVersion(version: string) {
		const parts = version.split('@');
		return parts[parts.length - 1];
	}
}
