import { randomUUID } from 'node:crypto';
import {
	lstatSync,
	readFileSync,
	renameSync,
	type Stats,
	unlinkSync,
	writeFileSync,
} from 'node:fs';
import path from 'node:path';

export const ADS_INIT_START_MARKER = '<!-- ADS:INIT:START -->';
export const ADS_INIT_END_MARKER = '<!-- ADS:INIT:END -->';
export const AGENTS_FILE_RELATIVE_PATH = 'AGENTS.md';

export type AgentsFileResult =
	| {
			status: 'created' | 'appended' | 'updated' | 'already-current';
			path: typeof AGENTS_FILE_RELATIVE_PATH;
	  }
	| {
			status: 'not-written';
			path: typeof AGENTS_FILE_RELATIVE_PATH;
			reason: 'not-in-git-repository';
	  };

export type AgentsGuidance =
	| {
			mode: 'skills-installed';
			skillEntrypoints: string[];
			getStartedPath: string;
	  }
	| {
			mode: 'public';
	  };

const markerError = (): Error =>
	new Error(
		`Cannot update ${AGENTS_FILE_RELATIVE_PATH} because the ${ADS_INIT_START_MARKER} and ${ADS_INIT_END_MARKER} markers are malformed or ambiguous. Repair or remove the markers, then run init again.`,
	);

const countOccurrences = (content: string, value: string): number =>
	content.split(value).length - 1;

const isStandaloneMarker = (content: string, marker: string, index: number): boolean => {
	const beforeIsLineBoundary = index === 0 || content[index - 1] === '\n';
	const afterIndex = index + marker.length;
	const afterIsLineBoundary =
		afterIndex === content.length ||
		content[afterIndex] === '\n' ||
		(content[afterIndex] === '\r' && content[afterIndex + 1] === '\n');
	return beforeIsLineBoundary && afterIsLineBoundary;
};

const detectLineEnding = (content: string): '\n' | '\r\n' => {
	const crlfCount = content.match(/\r\n/g)?.length ?? 0;
	const lfOnlyCount = content.replace(/\r\n/g, '').match(/\n/g)?.length ?? 0;
	return crlfCount > lfOnlyCount ? '\r\n' : '\n';
};

const MCP_GUIDANCE = [
	'Use `atlas ads` first for structured ADS lookups. If Atlas is unavailable, use `npx @atlaskit/ads-cli` with the same trailing arguments.',
	'',
	'### Hosted ADS MCP fallback',
	'',
	'Prefer the CLI first. Configure the hosted ADS MCP server only if this repository does not already configure `ads-mcp` or `atlassian-ads-mcp`. Merge the selected server into the existing configuration without replacing other servers, then reload the agent or IDE.',
	'',
	'**Cursor — `.cursor/mcp.json`:**',
	'',
	'```json',
	'{',
	'  "mcpServers": {',
	'    "ads-mcp": {',
	'      "url": "https://mcp.atlassian.com/v1/ads/public/mcp"',
	'    }',
	'  }',
	'}',
	'```',
	'',
	'**VS Code — `.vscode/mcp.json`:**',
	'',
	'```json',
	'{',
	'  "servers": {',
	'    "ads-mcp": {',
	'      "type": "http",',
	'      "url": "https://mcp.atlassian.com/v1/ads/public/mcp"',
	'    }',
	'  }',
	'}',
	'```',
	'',
	'**Codex — `.codex/config.toml`:**',
	'',
	'```toml',
	'[mcp_servers.atlassian-ads-mcp]',
	'url = "https://mcp.atlassian.com/v1/ads/public/mcp"',
	'```',
	'',
	'Do not add Rovo MCP configuration to the repository.',
] as const;

const renderManagedBlock = ({
	lineEnding,
	guidance,
}: {
	lineEnding: '\n' | '\r\n';
	guidance: AgentsGuidance;
}): string => {
	const skillGuidance =
		guidance.mode === 'skills-installed'
			? [
					'`init` installed repository-local guidance for setting up and using the Atlassian Design System.',
					'',
					'For Atlassian frontend UI work—including component selection, tokens, icons, styling, accessibility, product content and ADS lint rules—follow:',
					'',
					...guidance.skillEntrypoints.map((entrypoint) => `- \`${entrypoint}\``),
					'',
					"Before starting frontend UI work, check and complete this repository's ADS setup by following:",
					'',
					`\`${guidance.getStartedPath}\``,
					'',
					'Apply only the setup that is missing, and preserve equivalent existing configuration.',
					'',
				]
			: [
					'`init` did not install repository-local skills. Use the public ADS CLI and optional MCP guidance below.',
					'',
				];

	return [
		ADS_INIT_START_MARKER,
		'## Getting started with the Atlassian Design System',
		'',
		...skillGuidance,
		...MCP_GUIDANCE,
		'',
		"This is a temporary initialization section. It may be removed or rephrased once this repository's ADS setup has been completed.",
		ADS_INIT_END_MARKER,
	].join(lineEnding);
};

const readTargetStats = (targetPath: string): Stats | undefined => {
	try {
		return lstatSync(targetPath);
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return undefined;
		}
		throw error;
	}
};

const atomicWriteFile = ({
	targetPath,
	content,
	mode,
	targetExists,
}: {
	targetPath: string;
	content: string;
	mode: number;
	targetExists: boolean;
}): void => {
	const temporaryPath = path.join(
		path.dirname(targetPath),
		`.${path.basename(targetPath)}.${process.pid}.${randomUUID()}.tmp`,
	);
	let temporaryFileExists = false;

	try {
		writeFileSync(temporaryPath, content, { encoding: 'utf8', flag: 'wx', mode });
		temporaryFileExists = true;
		try {
			renameSync(temporaryPath, targetPath);
			temporaryFileExists = false;
		} catch (error) {
			const code = (error as NodeJS.ErrnoException).code;
			const canFallbackOnWindows =
				process.platform === 'win32' &&
				targetExists &&
				(code === 'EACCES' || code === 'EEXIST' || code === 'EPERM');
			if (!canFallbackOnWindows) {
				throw error;
			}

			writeFileSync(targetPath, content, { encoding: 'utf8', mode });
			unlinkSync(temporaryPath);
			temporaryFileExists = false;
		}
	} finally {
		if (temporaryFileExists) {
			try {
				unlinkSync(temporaryPath);
			} catch {
				// Preserve the original write failure if temporary cleanup also fails.
			}
		}
	}
};

export const updateAgentsFile = ({
	projectRoot,
	guidance,
}: {
	projectRoot: string;
	guidance: AgentsGuidance;
}): AgentsFileResult => {
	const targetPath = path.join(projectRoot, AGENTS_FILE_RELATIVE_PATH);
	const stats = readTargetStats(targetPath);

	if (stats?.isSymbolicLink()) {
		throw new Error(`Cannot update ${AGENTS_FILE_RELATIVE_PATH} because it is a symbolic link.`);
	}
	if (stats && !stats.isFile()) {
		throw new Error(`Cannot update ${AGENTS_FILE_RELATIVE_PATH} because it is not a regular file.`);
	}

	const existingContent = stats ? readFileSync(targetPath, 'utf8') : '';
	const lineEnding = detectLineEnding(existingContent);
	const managedBlock = renderManagedBlock({ lineEnding, guidance });
	const startCount = countOccurrences(existingContent, ADS_INIT_START_MARKER);
	const endCount = countOccurrences(existingContent, ADS_INIT_END_MARKER);

	let nextContent: string;
	let status: Extract<AgentsFileResult['status'], 'created' | 'appended' | 'updated'>;

	if (!stats) {
		nextContent = `${managedBlock}${lineEnding}`;
		status = 'created';
	} else if (startCount === 0 && endCount === 0) {
		const separator =
			existingContent.length === 0
				? ''
				: existingContent.endsWith(`${lineEnding}${lineEnding}`)
					? ''
					: existingContent.endsWith(lineEnding)
						? lineEnding
						: `${lineEnding}${lineEnding}`;
		nextContent = `${existingContent}${separator}${managedBlock}${lineEnding}`;
		status = 'appended';
	} else {
		if (startCount !== 1 || endCount !== 1) {
			throw markerError();
		}
		const startIndex = existingContent.indexOf(ADS_INIT_START_MARKER);
		const endIndex = existingContent.indexOf(ADS_INIT_END_MARKER);
		if (
			startIndex > endIndex ||
			!isStandaloneMarker(existingContent, ADS_INIT_START_MARKER, startIndex) ||
			!isStandaloneMarker(existingContent, ADS_INIT_END_MARKER, endIndex)
		) {
			throw markerError();
		}

		const afterManagedBlock = endIndex + ADS_INIT_END_MARKER.length;
		nextContent = `${existingContent.slice(0, startIndex)}${managedBlock}${existingContent.slice(afterManagedBlock)}`;
		if (nextContent === existingContent) {
			return { status: 'already-current', path: AGENTS_FILE_RELATIVE_PATH };
		}
		status = 'updated';
	}

	atomicWriteFile({
		targetPath,
		content: nextContent,
		mode: stats?.mode ?? 0o666,
		targetExists: stats !== undefined,
	});
	return { status, path: AGENTS_FILE_RELATIVE_PATH };
};
