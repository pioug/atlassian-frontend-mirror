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
	'block-task-item', // Ignored due to block-task-item nodes being co-located with taskItem nodes in 'task-item.js'
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

const adfSchemaNodesPath = path.join(
	REPO_ROOT,
	'platform',
	'packages',
	'editor',
	'adf-schema',
	'src',
	'schema',
	'nodes',
);

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

const adfSchemaMarksPath = path.join(
	REPO_ROOT,
	'platform',
	'packages',
	'editor',
	'adf-schema',
	'src',
	'schema',
	'marks',
);
const marksBuildersPath = path.join(__dirname, '..', '..', '..', 'builders', 'marks');

function except(array: string[], excludes: string[]) {
	return array.filter((item: string) => !excludes.includes(item));
}

describe('adf-utils <-> adf-schema/schema consistency', () => {
	it('should have builders for all nodes from adf-schema/src/schema/nodes', () => {
		const nodes = buildFilesList(adfSchemaNodesPath, ignoredPaths);
		const builders = buildFilesList(nodeBuildersPath, ignoredPaths);
		expect(builders).toEqual(except(nodes, ignoredPaths));
	});

	it('should have builders for all marks from adf-schema/src/schema/marks', () => {
		const marks = buildFilesList(adfSchemaMarksPath, ignoredMarks);
		const builders = buildFilesList(marksBuildersPath);
		expect(builders).toEqual(except(marks, ignoredMarks));
	});
});
