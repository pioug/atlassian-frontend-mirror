import path from 'path';

import debugModule from 'debug';
import micromatch from 'micromatch';

import * as git from './git';

const debug = debugModule('atlaskit:yarn');

export async function getWorkspacePackageJsonPaths(
	hash: string,
	subWorkDir?: string,
): Promise<Set<string> | null> {
	let file;
	const rootPackageJson = `${subWorkDir ? `${subWorkDir}/` : ''}package.json`;

	try {
		/**
		 * We need to use package.json from current working directory, not from root
		 * The reason is - some repositories have their package.json not in root
		 * For example "confluence-frontend" repo has package.json at "confluence-frontend/confluence/package.json"
		 */
		file = await git.showFile(hash, rootPackageJson);
	} catch (error) {
		const errorMessage = `File by hash "${hash}" and path "${rootPackageJson}" does not exist`;

		debug(errorMessage, { error });
		console.error(errorMessage, error);

		return new Set([]);
	}

	let rootPackageJsonFile;
	try {
		rootPackageJsonFile = JSON.parse(file);
	} catch (e) {
		console.error(`Error parsing ${file}@${hash}: ${e}`);
		return null;
	}

	const workspaces: string[] | { packages: string[] } | undefined = rootPackageJsonFile.workspaces;

	if (!workspaces) {
		return new Set([rootPackageJson]);
	}
	// There are actually two formats for workspaces and they are poorly documented
	const workspacePackages = Array.isArray(workspaces) ? workspaces : workspaces.packages;

	return new Set([
		rootPackageJson,
		...workspacePackages.map((glob) => path.join(glob, 'package.json')),
	]);
}

export async function getWorkspacePaths(
	ref: string,
	workspaceGlobs: Set<string>,
): Promise<string[]> {
	if (workspaceGlobs.size === 0) {
		return [];
	}

	const workspacePackageJsons = await git.getFiles(ref, '**/package.json');

	const matchedWorkspaces = micromatch(workspacePackageJsons, [...workspaceGlobs]);

	if (matchedWorkspaces.length === 0) {
		throw new Error(
			`Could not find any workspace or package.json under "${process.cwd()}" for "${ref}" tag`,
		);
	}

	return matchedWorkspaces;
}
