/* eslint-disable no-console */
// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as fs from 'fs';
// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as path from 'path';

import { findRootSync } from '@manypkg/find-root';
import yargs from 'yargs';

import type { EntryPointData } from './entrypoint-data';
import { getEntryPointDataForPlugin } from './entrypoint-data';
import { generateAllPluginTests } from './generate-tests';
import { formatCode, sortObjectKeys } from './util';

// Interfaces for dependency tracking
interface Dependencies {
	[key: string]: string;
}

interface DependencyDiff {
	dependency: string;
	newVersion?: string;
	oldVersion?: string;
	version?: string;
}

interface DependenciesDiffResult {
	added: DependencyDiff[];
	removed: DependencyDiff[];
	updated: DependencyDiff[];
}

const foldersToIgnore: string[] = ['editor-plugin-code-block-advanced'];

// Locate the root directory of the project
const rootPath = findRootSync(process.cwd());

// Define constants related to editor plugins
const pluginsPath = path.join(rootPath, 'packages', 'editor');
const pluginName = 'editor-plugins';
const editorPluginsPath = path.join(pluginsPath, pluginName);
const editorPluginsPackageJsonPath = path.join(editorPluginsPath, 'package.json');

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPluginPackageJson(pluginFolder: string): Record<string, any> {
	const packageJsonFile = path.join(pluginFolder, 'package.json');
	if (fs.existsSync(packageJsonFile)) {
		const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
		return packageJson;
	} else {
		throw new Error(`Package.json not found for ${pluginFolder}`);
	}
}

function getPluginFolderNames(): string[] {
	// Check if the path exists and is a directory
	if (!fs.existsSync(pluginsPath) && !fs.lstatSync(pluginsPath).isDirectory()) {
		throw new Error(`Directory not found ${pluginsPath}`);
	}
	// Read the contents of the directory
	const folders = fs.readdirSync(pluginsPath);

	return folders.filter(
		(folder) =>
			folder.startsWith('editor-plugin-') &&
			!foldersToIgnore.includes(folder) &&
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			!/editor-plugin-.*-tests$/.test(folder),
	);
}

function getPluginFolderNamesAndPackageJsons(): {
	depFolderNames: string[];
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	packageJsons: Record<string, any>[];
} {
	const depFolderNames: string[] = [];
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const packageJsons: Record<string, any>[] = [];

	getPluginFolderNames().forEach((folderName) => {
		const packageJson = getPluginPackageJson(path.join(pluginsPath, folderName));
		/**
		 * editor-plugin is public package.
		 * And we don't want to expose private packages through this public package.
		 * That's why if any package starts with @atlassian,
		 * 	then we will not export it from editor-plugins.
		 */
		if (!packageJson.name.startsWith('@atlassian')) {
			packageJsons.push(packageJson);
			depFolderNames.push(folderName);
		}
	});

	return {
		depFolderNames,
		packageJsons,
	};
}

function extractFileNameFromDepName(pluginName: string): string {
	const pluginNameParts = pluginName.split('-');
	return pluginNameParts.slice(2).join('-');
}

function orderObjectByDepthAndRoot(input: { [key: string]: string }): {
	[key: string]: string;
} {
	// First, group the entries by their root level name
	const grouped = Object.entries(input).reduce(
		(acc, [key, value]) => {
			const root = key.split('/')[1]; // Get the root level name
			if (!acc[root]) {
				acc[root] = [];
			}
			acc[root].push([key, value]);
			return acc;
		},
		{} as { [key: string]: [string, string][] },
	);

	// Then, sort each group by the depth and merge them into a single object
	return Object.values(grouped).reduce(
		(acc, group) => {
			const sortedGroup = group.sort((a, b) => {
				const depthA = a[0].split('/').length;
				const depthB = b[0].split('/').length;
				return depthB - depthA; // Sort by depth, deeper paths first
			});
			sortedGroup.forEach(([key, value]) => {
				acc[key] = value;
			});
			return acc;
		},
		{} as { [key: string]: string },
	);
}

function getNewExports(entryPointData: EntryPointData[]): Record<string, string> {
	// exports we want to keep are hardcoded here
	const newExports: Record<string, string> = {};
	entryPointData.forEach(({ exportData }) => {
		newExports[exportData.newExportKey] = exportData.newExportValue;
	});
	return newExports;
}

function getUpdatedDependenciesFromPackageJsons(
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	packageJsons: Record<string, any>[],
): Record<string, string> {
	const depVersions: Record<string, string> = {};
	packageJsons.forEach((packageJson) => {
		const version = packageJson.version;
		const name = packageJson.name;
		if (!name) {
			throw new Error(`Package.json name not found`);
		}
		if (!version) {
			throw new Error(`Package.json version not found for ${packageJson.name}`);
		}
		depVersions[name] = `${version}`;
	});

	return depVersions;
}

function getFeatureFlagsFromPackageJsons(
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	packageJsons: Record<string, any>[],
): Record<string, string> {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const mergedFeatureFlags: Record<string, any> = {};
	packageJsons.forEach((packageJson) => {
		const featureFlags = packageJson['platform-feature-flags'];
		if (featureFlags) {
			for (const key of Object.keys(featureFlags)) {
				mergedFeatureFlags[key] = {
					...featureFlags[key],
					referenceOnly: true,
				};
			}
		}
	});
	return mergedFeatureFlags;
}

// Function to read and return package.json of editor plugins
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function getEditorPluginsPackageJson(): Record<string, any> {
	// Check if the package.json file exists
	if (!fs.existsSync(editorPluginsPackageJsonPath)) {
		throw new Error(`Package.json not found for ${editorPluginsPackageJsonPath}`);
	}

	// Read and parse the package.json file
	const packageJson = JSON.parse(fs.readFileSync(editorPluginsPackageJsonPath, 'utf8'));

	return packageJson;
}

// Function to filter out non-Atlaskit editor plugin dependencies
function removeNonEditorPluginDeps(currentDeps: Record<string, string>): Record<string, string> {
	const filteredDeps: Record<string, string> = {};

	Object.keys(currentDeps).forEach((key) => {
		if (key.startsWith('@atlaskit/editor-plugin-')) {
			filteredDeps[key] = currentDeps[key];
		}
	});

	return filteredDeps;
}

function mapToWorkspaceVersions(workspaceDeps: Record<string, string>): Record<string, string> {
	const updatedDeps: Record<string, string> = {};

	Object.keys(workspaceDeps).forEach((key) => {
		updatedDeps[key] = 'workspace:*'; // Use workspace version for editor plugins
	});

	return updatedDeps;
}

// Function to remove Atlaskit editor plugin dependencies
function removeEditorPluginDeps(currentDeps: Record<string, string>): Record<string, string> {
	const filteredDeps: Record<string, string> = {};

	Object.keys(currentDeps).forEach((key) => {
		if (!key.startsWith('@atlaskit/editor-plugin-')) {
			filteredDeps[key] = currentDeps[key];
		}
	});

	return filteredDeps;
}

function createFileWithPath(filePath: string, content: string) {
	const directoryPath = path.dirname(filePath);

	// Create the directory if it does not exist
	if (!fs.existsSync(directoryPath)) {
		fs.mkdirSync(directoryPath, { recursive: true });
	}

	try {
		const formatted = formatCode(content);
		// Write the file
		fs.writeFileSync(filePath, formatted);
	} catch (e) {
		console.error(`Failed formatting code for file: ${filePath}

This may be a problem with Prettier rather than code. Please check support channels for changes`);
		throw e;
	}
}

// Function to update plugin files based on dependencies
// returns the exports object
function updatePluginsFiles(
	depFolderNames: string[],
	entryPointDatas: EntryPointData[],
	dryRun: boolean = false,
) {
	const srcPath = path.join(editorPluginsPath, 'src');
	const existingFiles = new Set(fs.readdirSync(srcPath));
	existingFiles.delete('index.ts'); // Ensure index.ts is not removed
	existingFiles.delete('__tests__'); // Ensure __tests__ is not removed
	// existingFiles.delete('preset-default');

	const newFolders = new Set(depFolderNames.map((name) => extractFileNameFromDepName(name)));

	const removedFiles = Array.from(existingFiles).filter((file) => !newFolders.has(file));
	const addedFolders = Array.from(newFolders).filter((file) => !existingFiles.has(file));

	if (!dryRun) {
		// Remove files that are no longer needed
		removedFiles.forEach((item) => {
			const itemPath = path.join(srcPath, item);

			if (fs.existsSync(itemPath)) {
				const stats = fs.statSync(itemPath);

				if (stats.isDirectory()) {
					// Remove directory recursively
					fs.rmdirSync(itemPath, { recursive: true });
				} else if (stats.isFile()) {
					// Remove file
					fs.unlinkSync(itemPath);
				}
			}
		});

		// Add new files or update existing ones
		// Ignored via go/ees005
		// eslint-disable-next-line require-await
		entryPointDatas.forEach(async ({ fileData }) => {
			createFileWithPath(fileData.newRelativeFilePath, fileData.fileContent);
		});
	}

	// Log the diff of added and removed files
	console.log('Files Diff:');
	if (removedFiles.length > 0) {
		console.log(`Removed (${removedFiles.length} file${removedFiles.length > 1 ? 's' : ''}):`);
		removedFiles.forEach((file) => console.log(`  - ${file}`)); // Log removed files
	}
	if (addedFolders.length > 0) {
		console.log(`Added (${addedFolders.length} file${addedFolders.length > 1 ? 's' : ''}):`);
		addedFolders.forEach((file) => console.log(`  + ${file}`)); // Log added files
	}
}

// returns newDeps but with the version found in currentDeps if exsits otherwise stays the same
function preferOlderVersions(
	currentDeps: Dependencies,
	newDeps: Dependencies,
	forceUpdate: boolean,
): Dependencies {
	const deps: Dependencies = {};

	for (const key in newDeps) {
		if (currentDeps.hasOwnProperty(key) && !forceUpdate) {
			// If the current dependency version exists, use it
			deps[key] = currentDeps[key];
		} else {
			// Otherwise, use the new dependency version
			deps[key] = newDeps[key];
		}
	}

	return deps;
}

// Function to generate and format differences in dependencies
function generateDependenciesDiff(
	currentDeps: Dependencies,
	newDeps: Dependencies,
): DependenciesDiffResult {
	const diff: DependenciesDiffResult = {
		added: [],
		removed: [],
		updated: [],
	};

	// Check for added and updated dependencies
	Object.keys(newDeps).forEach((key) => {
		if (!currentDeps[key]) {
			diff.added.push({ dependency: key, version: newDeps[key] });
		} else if (currentDeps[key] !== newDeps[key]) {
			diff.updated.push({
				dependency: key,
				oldVersion: currentDeps[key],
				newVersion: newDeps[key],
			});
		}
	});

	// Check for removed dependencies
	Object.keys(currentDeps).forEach((key) => {
		if (!newDeps[key]) {
			diff.removed.push({ dependency: key, version: currentDeps[key] });
		}
	});

	return diff;
}

function formatDependencyDiff(diff: DependenciesDiffResult): string {
	let result = 'Dependency Differences:\n';

	// Count the number of files for each category
	const addedCount = diff.added.length;
	const removedCount = diff.removed.length;
	const updatedCount = diff.updated.length;

	if (addedCount > 0) {
		result += `Added (${addedCount} dep${addedCount > 1 ? 's' : ''}):\n`;
		diff.added.forEach((d) => (result += `  + ${d.dependency} (${d.version})\n`));
	}

	if (removedCount > 0) {
		result += `Removed (${removedCount} dep${removedCount > 1 ? 's' : ''}):\n`;
		diff.removed.forEach((d) => (result += `  - ${d.dependency}\n`));
	}

	if (updatedCount > 0) {
		result += `Updated (${updatedCount} dep${updatedCount > 1 ? 's' : ''}):\n`;
		diff.updated.forEach(
			(d) => (result += `  ^ ${d.dependency}: ${d.oldVersion} => ${d.newVersion}\n`),
		);
	}

	return result;
}

function prettyDisplay(diff: DependenciesDiffResult) {
	const diffDisplay = formatDependencyDiff(diff);
	console.log(diffDisplay);
}

// Ignored via go/ees005
// eslint-disable-next-line require-await
async function run() {
	const argv = yargs(process.argv.slice(2))
		.option('dry-run', {
			alias: 'd',
			type: 'boolean',
			description: 'Run without making any changes',
			default: false,
		})
		.option('update-feature-flags', {
			alias: 'f',
			type: 'boolean',
			description: 'Update feature flags as well',
			default: false,
		})
		.option('force-versions', {
			alias: 'force',
			type: 'boolean',
			description: 'Force the plugins to update to the latest',
			default: false,
		})
		.parse();

	try {
		const { depFolderNames, packageJsons } = getPluginFolderNamesAndPackageJsons();
		const newEditorPluginsDeps = getUpdatedDependenciesFromPackageJsons(packageJsons);
		const editorPluginsPackageJson = getEditorPluginsPackageJson();
		const featureFlags = argv['update-feature-flags']
			? getFeatureFlagsFromPackageJsons(packageJsons)
			: editorPluginsPackageJson['platform-feature-flags'];
		const currentDeps = editorPluginsPackageJson.dependencies;

		if (!currentDeps) {
			throw new Error(`Dependencies object not found in editorPluginsPackageJsonPath`);
		}

		const currentEditorPluginDeps = removeNonEditorPluginDeps(currentDeps);
		const newEditorPluginsDepsWithOldVersions = mapToWorkspaceVersions(
			preferOlderVersions(currentEditorPluginDeps, newEditorPluginsDeps, argv['force-versions']),
		);
		const diff = generateDependenciesDiff(
			currentEditorPluginDeps,
			newEditorPluginsDepsWithOldVersions,
		);

		prettyDisplay(diff);

		const pluginEntryPointDataMap: Record<string, EntryPointData[]> = {};
		depFolderNames.forEach((dep) => {
			pluginEntryPointDataMap[extractFileNameFromDepName(dep)] = getEntryPointDataForPlugin(
				path.join(pluginsPath, dep),
			);
		});
		const allEntryPointData = Object.values(pluginEntryPointDataMap).flat();
		updatePluginsFiles(depFolderNames, allEntryPointData, argv['dry-run']);
		const newEditorPluginsExports = getNewExports(allEntryPointData);
		generateAllPluginTests(
			pluginEntryPointDataMap,
			path.join(editorPluginsPath, 'src', '__tests__'),
		);

		if (!argv.dryRun) {
			// remove any existing editor plugin dependencies
			const filteredCurrentDeps = removeEditorPluginDeps(currentDeps);
			const updatedDeps = {
				...filteredCurrentDeps,
				...newEditorPluginsDepsWithOldVersions,
			};
			const updatedPackageJson = {
				...editorPluginsPackageJson,
				exports: orderObjectByDepthAndRoot(newEditorPluginsExports),
				dependencies: sortObjectKeys(updatedDeps),
				'platform-feature-flags': featureFlags,
				// only update the 'exports' property if it already exists in the package
				...(editorPluginsPackageJson.exports && {
					exports: orderObjectByDepthAndRoot(newEditorPluginsExports),
				}),
			};

			const updatedPackageJsonString = JSON.stringify(updatedPackageJson, null, '\t') + '\n';

			fs.writeFileSync(editorPluginsPackageJsonPath, updatedPackageJsonString);

			console.log('Updated successfully!');
		} else {
			console.log('Dry run completed - no changes were made.');
		}
	} catch (error) {
		console.error('FAILED TO UPDATE');
		console.error(error);
	}
}

run();
