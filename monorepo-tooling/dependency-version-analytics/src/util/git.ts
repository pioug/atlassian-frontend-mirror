import git from 'simple-git';
import type {
	DiffResult,
	LogResult,
	DefaultLogFields,
	ListLogLine,
	FetchResult,
	Response,
} from 'simple-git';

import { assert } from './assert';

export async function getChangesSince(since?: string): Promise<LogResult> {
	const revisionRange = since ? [`${since}..`] : [];
	const logArgument = [
		// Only commits on mainline master
		'--first-parent',
		// Show merge commit contents
		'-m',
		// Reverse the order
		'--reverse',
		// Show filename changes - simple-git parses --stat flag but not --name-only unfortunately
		'--stat=4096',
		// Make +- graph width as small as possible to maximise filename length
		'--stat-graph-width=1',
		...revisionRange,
		// Any commit that modifies a package.json in any directory
		':(glob)**/package.json',
	];
	console.log('logArgument: ', logArgument);
	const listLogSummary = await git().log(logArgument);
	console.log('listLogSummary: ', listLogSummary);
	return {
		...listLogSummary,
		all: listLogSummary.all.map((logLine) => parseLogLine(logLine)),
	};
}

function parseLogLine(logLine: DefaultLogFields & ListLogLine) {
	if (!logLine.diff) {
		return logLine;
	}

	// Split files into separate entries when a rename has occurred so both old and new files are processed
	const parsedDiffFiles = logLine.diff.files.reduce(
		(acc, curr) => {
			const renameArrowCount = curr.file.match(/ => /g);
			if (renameArrowCount == null) {
				return [...acc, curr];
			}
			// Multiple rename parts are not supported. They most likely don't exist in git but we check
			// for them anyway just in case
			assert(renameArrowCount.length === 1, `Multiple rename parts detected: ${curr.file}`);
			/* Matches:
			 * - '{new-frontend/src => src}/package.json'
			 * - 'new-frontend/.prettierrc.js => .prettierrc.js'
			 * - 'src/{ => platform}/analytics/package.json'
			 * - 'src/packages/spa/{main => }/package.json'
			 */
			const renameMatch = curr.file.match(/\{?([^{]+)? => ([^}]+)?\}?/);
			assert(renameMatch != null, `Invalid rename format ${curr.file}`);

			const oldFile = curr.file
				.replace(renameMatch[0], renameMatch[1] || '')
				// If the previous name segment is empty, we will have a double slash
				.replace('//', '/');
			const newFile = curr.file.replace(renameMatch[0], renameMatch[2] || '').replace('//', '/');

			return [...acc, { ...curr, file: oldFile }, { ...curr, file: newFile }];
		},
		[] as DiffResult['files'],
	);

	return {
		...logLine,
		diff: {
			...logLine.diff,
			files: parsedDiffFiles,
		},
	};
}

export async function tagCommit(tag: string): Promise<string> {
	return git().tag(['-f', tag]);
}

export async function doesTagExist(tag: string): Promise<boolean> {
	const tags = await git().tags({ [tag]: null });

	return tags.all.length > 0;
}

export async function refetchTag(tag: string): Promise<{
	fetchTagResult: FetchResult | undefined;
}> {
	try {
		await git().tag(['-d', tag]);
	} catch (e: any) {
		// Ignore tag not found errors
		if (!/tag.*not found/.test(e.message)) {
			throw e;
		}
	}

	let fetchTagResult;
	try {
		fetchTagResult = await git().fetch(['origin', 'tag', tag]);
	} catch (e: any) {
		// Ignore can't find tag in remote errors
		if (!/Couldn't find remote ref refs\/tags\//.test(e.message)) {
			throw e;
		}
	}
	return { fetchTagResult };
}

export async function getHash(ref: string): Promise<string> {
	return git().revparse([ref]);
}

export function showFile(
	ref: string,
	filename: string,
	opts: { cwd?: string } = {},
): Response<string> {
	return git(opts.cwd || process.cwd()).show([`${ref}:${filename}`]);
}

export async function getFiles(
	ref: string,
	glob: string,
	opts: { cwd?: string } = {},
): Promise<string[]> {
	const result = await git(opts.cwd || process.cwd()).raw([
		'grep',
		'--name-only',
		'',
		ref,
		'--',
		`:(glob)${glob}`,
	]);
	return result
		.split('\n')
		.filter((line) => line !== '')
		.map((line) => line.split(':')[1]);
}
