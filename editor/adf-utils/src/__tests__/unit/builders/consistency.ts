import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Ignored via go/ees005
// eslint-disable-next-line no-var
declare var __dirname: string;

const buildFilesList = (dirPath: string, ignored: Array<string> = []) =>
	fs
		.readdirSync(dirPath)
		.filter((node: string) => !node.startsWith('.'))
		.map((node: string) => path.basename(node, path.extname(node)))
		.filter((node: string) => ignored.indexOf(node) === -1 && node !== 'index');

const ignoredPaths = [
	'confluence-jira-issue',
	'confluence-unsupported-block',
	'confluence-unsupported-inline',
	'unsupported-block',
	'unsupported-inline',
	'unknown-block',
	'tableNodes',
	'table-cell',
	'table-header',
	'table-row',
	'table',
	'image',
	'types',
	'__tests__',
];

const REPO_ROOT = execSync('git rev-parse --show-toplevel', {
	encoding: 'utf-8',
}).trim();

const rootNodeModules = path.join(REPO_ROOT, 'node_modules');
const platformNodeModules = path.join(REPO_ROOT, 'platform', 'node_modules');

// TODO: https://product-fabric.atlassian.net/browse/ADFEXP-524
const adfSchemaNodesDir = path.join('@atlaskit', 'adf-schema', 'dist', 'cjs', 'schema', 'nodes');

// Load 'nodes' from Platform's node_modules if available, otherwise from the root node_modules
// This is because when Platform migrates to the global hoisted yarn.lock at the repo root, these modules will be hoisted to the root node_modules
const adfSchemaNodesPath = fs.existsSync(path.join(platformNodeModules, adfSchemaNodesDir))
	? path.join(platformNodeModules, adfSchemaNodesDir)
	: path.join(rootNodeModules, adfSchemaNodesDir);

const nodeBuildersPath = path.join(__dirname, '..', '..', '..', 'builders', 'nodes');

const ignoredMarks = [
	'confluence-inline-comment',
	'emoji-query',
	'mention-query',
	'type-ahead-query',
	'unsupported-mark',
	'__tests__',
	'unsupported-node-attributes',
];

// TODO: https://product-fabric.atlassian.net/browse/ADFEXP-524
const adfSchemaMarksDir = path.join('@atlaskit', 'adf-schema', 'dist', 'cjs', 'schema', 'marks');

// Load 'marks' from Platform's node_modules if available, otherwise from the root node_modules
// This is because when Platform migrates to the global hoisted yarn.lock at the repo root, these modules will be hoisted to the root node_modules
const adfSchemaMarksPath = fs.existsSync(path.join(platformNodeModules, adfSchemaMarksDir))
	? path.join(platformNodeModules, adfSchemaMarksDir)
	: path.join(rootNodeModules, adfSchemaMarksDir);

const marksBuildersPath = path.join(__dirname, '..', '..', '..', 'builders', 'marks');

function except(array: string[], excludes: string[]) {
	return array.filter((item: string) => !excludes.includes(item));
}

describe('adf-utils <-> adf-schema/schema consistency', () => {
	it('should have builders for all nodes from adf-schema/schema/nodes', () => {
		const nodes = buildFilesList(adfSchemaNodesPath, ignoredPaths);
		const builders = buildFilesList(nodeBuildersPath, ignoredPaths);
		expect(builders).toEqual(except(nodes, ignoredPaths));
	});

	it('should have builders for all marks from adf-schema/schema/marks', () => {
		const marks = buildFilesList(adfSchemaMarksPath, ignoredMarks);
		const builders = buildFilesList(marksBuildersPath);
		expect(builders).toEqual(except(marks, ignoredMarks));
	});
});
