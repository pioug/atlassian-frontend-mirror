import {
	chmodSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	statSync,
	symlinkSync,
	writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
	ADS_INIT_END_MARKER,
	ADS_INIT_START_MARKER,
	updateAgentsFile,
} from '../commands/update-agents-file';

const SKILL_ENTRYPOINTS = [
	'.agents/skills/atlassian-design-system/SKILL.md',
	'.agents/skills/ui-styling-standard/SKILL.md',
	'.agents/skills/a11y-foundation/SKILL.md',
];
const GET_STARTED = '.agents/skills/atlassian-design-system/references/get-started.md';

const update = (projectRoot: string) =>
	updateAgentsFile({
		projectRoot,
		guidance: {
			mode: 'skills-installed',
			skillEntrypoints: SKILL_ENTRYPOINTS,
			getStartedPath: GET_STARTED,
		},
	});

const updatePublic = (projectRoot: string) =>
	updateAgentsFile({
		projectRoot,
		guidance: { mode: 'public' },
	});

describe('ADS init AGENTS.md managed block', () => {
	let projectRoot: string;

	beforeEach(() => {
		projectRoot = mkdtempSync(path.join(os.tmpdir(), 'ads-cli-agents-'));
	});

	afterEach(() => {
		rmSync(projectRoot, { recursive: true, force: true });
	});

	it('creates AGENTS.md when it does not exist', () => {
		expect(update(projectRoot)).toEqual({ status: 'created', path: 'AGENTS.md' });

		const content = readFileSync(path.join(projectRoot, 'AGENTS.md'), 'utf8');
		expect(content).toContain('`init` installed repository-local guidance');
		expect(content).not.toContain('`atlas ads init` installed');
		expect(content).toContain(ADS_INIT_START_MARKER);
		for (const skillEntrypoint of SKILL_ENTRYPOINTS) {
			expect(content).toContain(`- \`${skillEntrypoint}\``);
		}
		expect(content).toContain('Before starting frontend UI work');
		expect(content).toContain('Apply only the setup that is missing');
		expect(content).toContain(`\`${GET_STARTED}\``);
		expect(content).toContain('npx @atlaskit/ads-cli');
		expect(content).toContain('https://mcp.atlassian.com/v1/ads/public/mcp');
		expect(content).toContain(ADS_INIT_END_MARKER);
	});

	it('creates explicit public guidance without claiming skills or MCP files were installed', () => {
		expect(updatePublic(projectRoot)).toEqual({ status: 'created', path: 'AGENTS.md' });

		const content = readFileSync(path.join(projectRoot, 'AGENTS.md'), 'utf8');
		expect(content).toContain('`init` did not install repository-local skills');
		expect(content).not.toContain('`atlas ads init`');
		expect(content).toContain('Use `atlas ads` first');
		expect(content).toContain('npx @atlaskit/ads-cli');
		expect(content).toContain('**Cursor — `.cursor/mcp.json`:**');
		expect(content).toContain('"mcpServers"');
		expect(content).toContain('**VS Code — `.vscode/mcp.json`:**');
		expect(content).toContain('"servers"');
		expect(content).toContain('**Codex — `.codex/config.toml`:**');
		expect(content).toContain('[mcp_servers.atlassian-ads-mcp]');
		expect(content).toContain('Merge the selected server');
		expect(content).toContain('reload the agent or IDE');
		expect(content).not.toContain('.agents/skills/');
		expect(content).not.toContain('get-started.md');
		expect(existsSync(path.join(projectRoot, '.cursor', 'mcp.json'))).toBe(false);
		expect(existsSync(path.join(projectRoot, '.vscode', 'mcp.json'))).toBe(false);
		expect(existsSync(path.join(projectRoot, '.codex', 'config.toml'))).toBe(false);
	});

	it('switches explicitly between public and skills-installed templates', () => {
		expect(updatePublic(projectRoot).status).toBe('created');
		expect(update(projectRoot).status).toBe('updated');

		const agentsPath = path.join(projectRoot, 'AGENTS.md');
		expect(readFileSync(agentsPath, 'utf8')).toContain(SKILL_ENTRYPOINTS[0]);
		expect(readFileSync(agentsPath, 'utf8')).toContain(GET_STARTED);

		expect(updatePublic(projectRoot).status).toBe('updated');
		const publicContent = readFileSync(agentsPath, 'utf8');
		expect(publicContent).not.toContain(SKILL_ENTRYPOINTS[0]);
		expect(publicContent).not.toContain(GET_STARTED);
		expect(publicContent).toContain('https://mcp.atlassian.com/v1/ads/public/mcp');
	});

	it('appends to an existing file while preserving user content, mode, and CRLF endings', () => {
		const agentsPath = path.join(projectRoot, 'AGENTS.md');
		const userContent = '# Repository guidance\r\n\r\nKeep this content.\r\n';
		writeFileSync(agentsPath, userContent);
		chmodSync(agentsPath, 0o640);

		expect(update(projectRoot)).toEqual({ status: 'appended', path: 'AGENTS.md' });

		const content = readFileSync(agentsPath, 'utf8');
		expect(content.startsWith(userContent)).toBe(true);
		expect(content.replace(/\r\n/g, '')).not.toContain('\n');
		expect(statSync(agentsPath).mode & 0o777).toBe(0o640);
	});

	it('replaces only an existing managed block', () => {
		const agentsPath = path.join(projectRoot, 'AGENTS.md');
		writeFileSync(
			agentsPath,
			[
				'# User heading',
				'',
				ADS_INIT_START_MARKER,
				'outdated generated content',
				ADS_INIT_END_MARKER,
				'',
				'User footer.',
				'',
			].join('\n'),
		);

		expect(update(projectRoot)).toEqual({ status: 'updated', path: 'AGENTS.md' });

		const content = readFileSync(agentsPath, 'utf8');
		expect(content).toContain('# User heading');
		expect(content).toContain('User footer.');
		expect(content).not.toContain('outdated generated content');
		expect(content).toContain(`\`${GET_STARTED}\``);
	});

	it('does not rewrite or duplicate a current managed block', () => {
		expect(update(projectRoot).status).toBe('created');
		const agentsPath = path.join(projectRoot, 'AGENTS.md');
		const initialContent = readFileSync(agentsPath, 'utf8');

		expect(update(projectRoot)).toEqual({ status: 'already-current', path: 'AGENTS.md' });
		expect(readFileSync(agentsPath, 'utf8')).toBe(initialContent);
		expect(initialContent.split(ADS_INIT_START_MARKER)).toHaveLength(2);
		expect(initialContent.split(ADS_INIT_END_MARKER)).toHaveLength(2);
	});

	it.each([
		['an unclosed block', `${ADS_INIT_START_MARKER}\ncontent\n`],
		['an end marker without a start', `${ADS_INIT_END_MARKER}\n`],
		[
			'duplicate blocks',
			`${ADS_INIT_START_MARKER}\na\n${ADS_INIT_END_MARKER}\n${ADS_INIT_START_MARKER}\nb\n${ADS_INIT_END_MARKER}\n`,
		],
		['reversed markers', `${ADS_INIT_END_MARKER}\ncontent\n${ADS_INIT_START_MARKER}\n`],
		['a marker embedded in user text', `prefix ${ADS_INIT_START_MARKER}\n${ADS_INIT_END_MARKER}\n`],
	])('refuses %s', (_description, content) => {
		writeFileSync(path.join(projectRoot, 'AGENTS.md'), content);

		expect(() => update(projectRoot)).toThrow('markers are malformed or ambiguous');
		expect(readFileSync(path.join(projectRoot, 'AGENTS.md'), 'utf8')).toBe(content);
	});

	it('refuses a symlinked AGENTS.md target', () => {
		const realPath = path.join(projectRoot, 'REAL_AGENTS.md');
		writeFileSync(realPath, '# Real file\n');
		symlinkSync(realPath, path.join(projectRoot, 'AGENTS.md'));

		expect(() => update(projectRoot)).toThrow('it is a symbolic link');
		expect(readFileSync(realPath, 'utf8')).toBe('# Real file\n');
	});

	it('refuses a non-regular AGENTS.md target', () => {
		mkdirSync(path.join(projectRoot, 'AGENTS.md'));

		expect(() => update(projectRoot)).toThrow('it is not a regular file');
	});
});
