import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { run } from '../cli';
import { CLI_ATLAS_INVOCATION } from '../commands/cli-metadata';
import { runInitCommand } from '../commands/init';
import type { Writer } from '../output/writer';
import { parseArgs } from '../parse-args';
import { ExitCode } from '../types';

const mockSpawnSync = jest.fn();

jest.mock('node:child_process', () => ({
	spawnSync: (...args: unknown[]) => mockSpawnSync(...args),
}));

const createTestWriter = (): Writer & { stdout: string[]; stderr: string[] } => {
	const stdout: string[] = [];
	const stderr: string[] = [];
	return {
		stdout,
		stderr,
		out: (line: string) => stdout.push(line),
		err: (line: string) => stderr.push(line),
	};
};

const success = () => ({ status: 0, stdout: '', stderr: '' });
const failure = (stderr = '') => ({ status: 1, stdout: '', stderr });
const atlasCliUnavailable = () => ({
	status: null,
	stdout: '',
	stderr: '',
	error: Object.assign(new Error('spawn atlas ENOENT'), { code: 'ENOENT' }),
});
const skillsInstallerUnavailable = (stderr = 'npm error code E404') => ({
	status: 1,
	stdout: '',
	stderr,
});
const skillsInstallerCommandUnavailable = () => ({
	status: null,
	stdout: '',
	stderr: '',
	error: Object.assign(new Error('spawn npx ENOENT'), { code: 'ENOENT' }),
});

const runInit = (
	argv: string[],
	writer: Writer,
	{ cwd }: { cwd: string },
): ReturnType<typeof runInitCommand> => {
	const { positionals, flags } = parseArgs(argv);
	return runInitCommand({
		input: { positionals, flags },
		json: flags.json === true,
		writer,
		invocation: 'npx @atlaskit/ads-cli',
		cwd,
	});
};

const skillNames = ['atlassian-design-system', 'ui-styling-standard', 'a11y-foundation'] as const;

const createSkill = (cwd: string, skillName: (typeof skillNames)[number]): void => {
	const skillPath = path.join(cwd, '.agents', 'skills', skillName);
	mkdirSync(skillPath, { recursive: true });
	writeFileSync(path.join(skillPath, 'SKILL.md'), `# ${skillName}\n`);
	if (skillName === 'atlassian-design-system') {
		mkdirSync(path.join(skillPath, 'references'), { recursive: true });
		writeFileSync(path.join(skillPath, 'references', 'get-started.md'), '# Get started\n');
	}
};

const createAllSkills = (cwd: string): void => {
	for (const skillName of skillNames) {
		createSkill(cwd, skillName);
	}
};

describe('init command', () => {
	let cwd: string;

	beforeEach(() => {
		mockSpawnSync.mockReset();
		cwd = mkdtempSync(path.join(os.tmpdir(), 'ads-cli-init-'));
		mkdirSync(path.join(cwd, '.git'));
	});

	afterEach(() => {
		rmSync(cwd, { recursive: true, force: true });
	});

	it('installs the project-local skill and the missing Atlas plugin', async () => {
		const requests: Array<{ command: string; args: string[]; cwd: string }> = [];
		let atlasChecks = 0;
		mockSpawnSync.mockImplementation((command, args, options) => {
			requests.push({ command, args, cwd: options.cwd });
			if (command === 'npx') {
				createSkill(cwd, args[3]);
				return success();
			}
			if (args[0] === 'ads') {
				atlasChecks++;
				return atlasChecks === 1 ? failure() : success();
			}
			return success();
		});
		const writer = createTestWriter();

		const code = await runInit(['init'], writer, { cwd });

		expect(code).toBe(ExitCode.Ok);
		expect(requests).toEqual([
			expect.objectContaining({
				command: 'npx',
				args: [
					'--yes',
					'@atlassian/skills',
					'add',
					'atlassian-design-system',
					'--universal',
					'--yes',
				],
			}),
			expect.objectContaining({
				command: 'npx',
				args: expect.arrayContaining(['ui-styling-standard']),
			}),
			expect.objectContaining({
				command: 'npx',
				args: expect.arrayContaining(['a11y-foundation']),
			}),
			expect.objectContaining({ command: 'atlas', args: ['ads', '--help'] }),
			expect.objectContaining({
				command: 'atlas',
				args: ['plugin', 'install', '--name', 'ads'],
			}),
			expect.objectContaining({ command: 'atlas', args: ['ads', '--help'] }),
		]);
		expect(writer.stdout).toEqual([
			'✓ ADS skill installed at .agents/skills/atlassian-design-system',
			'✓ UI Styling Standard skill installed at .agents/skills/ui-styling-standard',
			'✓ Accessibility Foundation skill installed at .agents/skills/a11y-foundation',
			'✓ Created AGENTS.md with ADS setup guidance',
			'✓ Atlas CLI ADS plugin installed',
			'→ Next: follow .agents/skills/atlassian-design-system/references/get-started.md to complete repository setup',
		]);
		expect(readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8')).toContain(
			'- `.agents/skills/ui-styling-standard/SKILL.md`',
		);
		expect(readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8')).toContain(
			'- `.agents/skills/a11y-foundation/SKILL.md`',
		);
		expect(readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8')).toContain(
			'https://mcp.atlassian.com/v1/ads/public/mcp',
		);
		expect(existsSync(path.join(cwd, '.cursor', 'mcp.json'))).toBe(false);
		expect(existsSync(path.join(cwd, '.vscode', 'mcp.json'))).toBe(false);
		expect(existsSync(path.join(cwd, '.codex', 'config.toml'))).toBe(false);
	});

	it('installs at the Git repository root when invoked from a nested directory', async () => {
		const nestedCwd = path.join(cwd, 'platform', 'packages', 'design-system');
		mkdirSync(nestedCwd, { recursive: true });
		mockSpawnSync.mockImplementation((command, args, options) => {
			if (command === 'npx') {
				createSkill(options.cwd, args[3]);
				return success();
			}
			return atlasCliUnavailable();
		});
		const writer = createTestWriter();

		const code = await runInit(['init', '--json'], writer, { cwd: nestedCwd });

		expect(code).toBe(ExitCode.Ok);
		expect(JSON.parse(writer.stdout[0]).data.projectRoot).toBe(cwd);
		expect(mockSpawnSync).toHaveBeenCalledWith(
			expect.any(String),
			expect.any(Array),
			expect.objectContaining({ cwd }),
		);
		expect(mockSpawnSync).not.toHaveBeenCalledWith(
			expect.any(String),
			expect.any(Array),
			expect.objectContaining({ cwd: nestedCwd }),
		);
		expect(
			existsSync(path.join(cwd, '.agents', 'skills', 'atlassian-design-system', 'SKILL.md')),
		).toBe(true);
		expect(readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8')).toContain(
			'.agents/skills/atlassian-design-system/references/get-started.md',
		);
		expect(existsSync(path.join(nestedCwd, 'AGENTS.md'))).toBe(false);
		expect(existsSync(path.join(nestedCwd, '.agents', 'skills', 'atlassian-design-system'))).toBe(
			false,
		);
	});

	it('is idempotent and does not invoke the skill installer when the skill already exists', async () => {
		createAllSkills(cwd);
		mockSpawnSync.mockReturnValue(atlasCliUnavailable());
		const writer = createTestWriter();

		const code = await runInit(['init'], writer, { cwd });

		expect(code).toBe(ExitCode.Ok);
		expect(mockSpawnSync).toHaveBeenCalledTimes(1);
		expect(mockSpawnSync).toHaveBeenCalledWith('atlas', ['ads', '--help'], expect.any(Object));
		expect(writer.stdout).toEqual([
			'✓ ADS skill already set up at .agents/skills/atlassian-design-system',
			'✓ UI Styling Standard skill already set up at .agents/skills/ui-styling-standard',
			'✓ Accessibility Foundation skill already set up at .agents/skills/a11y-foundation',
			'✓ Created AGENTS.md with ADS setup guidance',
			'– Atlas CLI is unavailable; use npx @atlaskit/ads-cli for ADS commands',
			'→ Next: follow .agents/skills/atlassian-design-system/references/get-started.md to complete repository setup',
		]);
	});

	it('reports an already-installed Atlas plugin without attempting installation', async () => {
		createAllSkills(cwd);
		mockSpawnSync.mockReturnValue(success());
		const writer = createTestWriter();

		expect(await runInit(['init', '--json'], writer, { cwd })).toBe(ExitCode.Ok);

		expect(JSON.parse(writer.stdout[0]).data.atlas).toEqual({ status: 'already-installed' });
		expect(mockSpawnSync).toHaveBeenCalledTimes(1);
		expect(mockSpawnSync).toHaveBeenCalledWith('atlas', ['ads', '--help'], expect.any(Object));
	});

	it('does not inspect or install the Atlas plugin when invoked through Atlas', async () => {
		createAllSkills(cwd);
		const writer = createTestWriter();

		expect(
			await runInitCommand({
				input: { positionals: [], flags: {} },
				json: false,
				writer,
				invocation: CLI_ATLAS_INVOCATION,
				cwd,
			}),
		).toBe(ExitCode.Ok);

		expect(mockSpawnSync).not.toHaveBeenCalled();
		expect(writer.stdout).toContain('✓ Atlas CLI ADS plugin already available');
	});

	it('reports a failed Atlas plugin installation', async () => {
		createAllSkills(cwd);
		mockSpawnSync.mockReturnValueOnce(failure()).mockReturnValueOnce(failure('permission denied'));

		await expect(runInit(['init'], createTestWriter(), { cwd })).rejects.toThrow(
			'Failed to install the Atlas CLI ADS plugin. npx @atlaskit/ads-cli remains available: permission denied',
		);
		expect(mockSpawnSync).toHaveBeenNthCalledWith(
			2,
			'atlas',
			['plugin', 'install', '--name', 'ads'],
			expect.any(Object),
		);
	});

	it('reports a failed Atlas plugin verification', async () => {
		createAllSkills(cwd);
		mockSpawnSync
			.mockReturnValueOnce(failure())
			.mockReturnValueOnce(success())
			.mockReturnValueOnce(failure());

		await expect(runInit(['init'], createTestWriter(), { cwd })).rejects.toThrow(
			'The Atlas CLI ADS plugin was installed but `atlas ads --help` did not succeed',
		);
		expect(mockSpawnSync).toHaveBeenNthCalledWith(
			3,
			'atlas',
			['ads', '--help'],
			expect.any(Object),
		);
	});

	it('does not reinstall an ADS skill when its entrypoint already exists', async () => {
		const skillPath = path.join(cwd, '.agents', 'skills', 'atlassian-design-system');
		mkdirSync(skillPath, { recursive: true });
		writeFileSync(path.join(skillPath, 'SKILL.md'), '# Existing ADS skill\n');
		mockSpawnSync.mockImplementation((command, args) => {
			if (command === 'npx') {
				createSkill(cwd, args[3]);
				return success();
			}
			return atlasCliUnavailable();
		});
		const writer = createTestWriter();

		const code = await runInit(['init'], writer, { cwd });

		expect(code).toBe(ExitCode.Ok);
		expect(mockSpawnSync.mock.calls).not.toContainEqual(
			expect.arrayContaining([
				'npx',
				expect.arrayContaining(['@atlassian/skills', 'atlassian-design-system']),
			]),
		);
		expect(writer.stdout[0]).toBe(
			'✓ ADS skill already set up at .agents/skills/atlassian-design-system',
		);
		expect(existsSync(path.join(skillPath, 'references', 'get-started.md'))).toBe(false);
	});

	it('assumes an installed ADS skill includes the setup workflow', async () => {
		const requests: Array<{ command: string; args: string[] }> = [];
		let atlasChecks = 0;
		mockSpawnSync.mockImplementation((command, args) => {
			requests.push({ command, args });
			if (command === 'npx') {
				const skillName = args[3] as (typeof skillNames)[number];
				if (skillName === 'atlassian-design-system') {
					const skillPath = path.join(cwd, '.agents', 'skills', skillName);
					mkdirSync(skillPath, { recursive: true });
					writeFileSync(path.join(skillPath, 'SKILL.md'), '# Published ADS skill\n');
				} else {
					createSkill(cwd, skillName);
				}
				return success();
			}
			if (args[0] === 'ads') {
				atlasChecks++;
				return atlasChecks === 1 ? failure() : success();
			}
			return success();
		});
		const writer = createTestWriter();

		expect(await runInit(['init'], writer, { cwd })).toBe(ExitCode.Ok);

		expect(requests).toEqual([
			expect.objectContaining({
				command: 'npx',
				args: expect.arrayContaining(['atlassian-design-system']),
			}),
			expect.objectContaining({
				command: 'npx',
				args: expect.arrayContaining(['ui-styling-standard']),
			}),
			expect.objectContaining({
				command: 'npx',
				args: expect.arrayContaining(['a11y-foundation']),
			}),
			expect.objectContaining({ command: 'atlas', args: ['ads', '--help'] }),
			expect.objectContaining({
				command: 'atlas',
				args: ['plugin', 'install', '--name', 'ads'],
			}),
			expect.objectContaining({ command: 'atlas', args: ['ads', '--help'] }),
		]);
		expect(writer.stdout).toContain('✓ Atlas CLI ADS plugin installed');
		expect(writer.stdout).toContain(
			'✓ ADS skill installed at .agents/skills/atlassian-design-system',
		);
		expect(writer.stdout).toContain(
			'✓ UI Styling Standard skill installed at .agents/skills/ui-styling-standard',
		);
		expect(writer.stdout).toContain(
			'✓ Accessibility Foundation skill installed at .agents/skills/a11y-foundation',
		);
		const agentsFile = readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8');
		expect(agentsFile).toContain('`init` installed repository-local guidance');
		expect(agentsFile).toContain('.agents/skills/atlassian-design-system/SKILL.md');
		expect(agentsFile).toContain('.agents/skills/ui-styling-standard/SKILL.md');
		expect(agentsFile).toContain('.agents/skills/a11y-foundation/SKILL.md');
		expect(agentsFile).toContain(
			'.agents/skills/atlassian-design-system/references/get-started.md',
		);
		expect(writer.stdout).toEqual(
			expect.arrayContaining([
				'→ Next: follow .agents/skills/atlassian-design-system/references/get-started.md to complete repository setup',
			]),
		);
	});

	it('degrades to public guidance when the skills installer is unavailable', async () => {
		const requests: Array<{ command: string; args: string[] }> = [];
		let atlasChecks = 0;
		mockSpawnSync.mockImplementation((command, args) => {
			requests.push({ command, args });
			if (command === 'npx') {
				return skillsInstallerUnavailable();
			}
			if (args[0] === 'ads') {
				atlasChecks++;
				return atlasChecks === 1 ? failure() : success();
			}
			return success();
		});
		const writer = createTestWriter();

		const code = await runInit(['init'], writer, { cwd });

		expect(code).toBe(ExitCode.Ok);
		expect(requests).toEqual([
			expect.objectContaining({
				command: 'npx',
				args: [
					'--yes',
					'@atlassian/skills',
					'add',
					'atlassian-design-system',
					'--universal',
					'--yes',
				],
			}),
			expect.objectContaining({ command: 'atlas', args: ['ads', '--help'] }),
			expect.objectContaining({
				command: 'atlas',
				args: ['plugin', 'install', '--name', 'ads'],
			}),
			expect.objectContaining({ command: 'atlas', args: ['ads', '--help'] }),
		]);
		expect(writer.stdout).toEqual([
			'– Repository-local skills skipped because @atlassian/skills is unavailable; npx @atlaskit/ads-cli remains available',
			'✓ Created AGENTS.md with ADS setup guidance',
			'✓ Atlas CLI ADS plugin installed',
		]);
		const agentsFile = readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8');
		expect(agentsFile).toContain('Use `atlas ads` first');
		expect(agentsFile).toContain('npx @atlaskit/ads-cli');
		expect(agentsFile).toContain('https://mcp.atlassian.com/v1/ads/public/mcp');
		expect(agentsFile).not.toContain('.agents/skills/');
		expect(agentsFile).not.toContain('get-started.md');
		expect(existsSync(path.join(cwd, '.cursor', 'mcp.json'))).toBe(false);
		expect(existsSync(path.join(cwd, '.vscode', 'mcp.json'))).toBe(false);
		expect(existsSync(path.join(cwd, '.codex', 'config.toml'))).toBe(false);
	});

	it('reports stable JSON reasons when the skills installer and Atlas are unavailable', async () => {
		mockSpawnSync.mockImplementation((command) =>
			command === 'npx' ? skillsInstallerUnavailable('npm error code E401') : atlasCliUnavailable(),
		);
		const writer = createTestWriter();

		const code = await runInit(['init', '--json'], writer, { cwd });

		expect(code).toBe(ExitCode.Ok);
		const envelope = JSON.parse(writer.stdout[0]);
		expect(envelope.data.skills).toEqual(
			skillNames.map((name) => ({
				name,
				status: 'not-installed',
				path: `.agents/skills/${name}`,
				reason: 'skills-installer-unavailable',
			})),
		);
		expect(envelope.data.agentsMd).toEqual({ status: 'created', path: 'AGENTS.md' });
		expect(envelope.data.atlas).toEqual({ status: 'atlas-cli-unavailable' });
		expect(envelope.data.nextStep).toBeNull();
		expect(mockSpawnSync).toHaveBeenCalledTimes(2);
		expect(mockSpawnSync).toHaveBeenNthCalledWith(
			1,
			'npx',
			['--yes', '@atlassian/skills', 'add', 'atlassian-design-system', '--universal', '--yes'],
			expect.any(Object),
		);
	});

	it('stops remaining skill installs if the installer becomes unavailable during setup', async () => {
		const skillInstallerRequests: string[][] = [];
		mockSpawnSync.mockImplementation((command, args) => {
			if (command === 'npx') {
				skillInstallerRequests.push(args);
				return skillsInstallerUnavailable('npm error 404 Not Found');
			}
			return atlasCliUnavailable();
		});
		const writer = createTestWriter();

		const code = await runInit(['init', '--json'], writer, { cwd });

		expect(code).toBe(ExitCode.Ok);
		expect(skillInstallerRequests).toEqual([
			['--yes', '@atlassian/skills', 'add', 'atlassian-design-system', '--universal', '--yes'],
		]);
		expect(JSON.parse(writer.stdout[0]).data.skills).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					status: 'not-installed',
					reason: 'skills-installer-unavailable',
				}),
			]),
		);
	});

	it('preserves skills installed before the installer becomes unavailable', async () => {
		const skillInstallerRequests: string[][] = [];
		mockSpawnSync.mockImplementation((command, args) => {
			if (command === 'npx') {
				skillInstallerRequests.push(args);
				if (args[3] === 'atlassian-design-system') {
					createSkill(cwd, 'atlassian-design-system');
					return success();
				}
				return skillsInstallerUnavailable('npm error 404 Not Found');
			}
			return atlasCliUnavailable();
		});
		const writer = createTestWriter();

		expect(await runInit(['init', '--json'], writer, { cwd })).toBe(ExitCode.Ok);

		expect(skillInstallerRequests).toEqual([
			['--yes', '@atlassian/skills', 'add', 'atlassian-design-system', '--universal', '--yes'],
			['--yes', '@atlassian/skills', 'add', 'ui-styling-standard', '--universal', '--yes'],
		]);
		expect(JSON.parse(writer.stdout[0]).data.skills).toEqual([
			{
				name: 'atlassian-design-system',
				status: 'installed',
				path: '.agents/skills/atlassian-design-system',
			},
			{
				name: 'ui-styling-standard',
				status: 'not-installed',
				path: '.agents/skills/ui-styling-standard',
				reason: 'skills-installer-unavailable',
			},
			{
				name: 'a11y-foundation',
				status: 'not-installed',
				path: '.agents/skills/a11y-foundation',
				reason: 'skills-installer-unavailable',
			},
		]);
		const agentsFile = readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8');
		expect(agentsFile).toContain('.agents/skills/atlassian-design-system/SKILL.md');
		expect(agentsFile).toContain(
			'.agents/skills/atlassian-design-system/references/get-started.md',
		);
		expect(agentsFile).not.toContain('.agents/skills/ui-styling-standard/SKILL.md');
		expect(agentsFile).not.toContain('.agents/skills/a11y-foundation/SKILL.md');
	});

	it('does not hide an earlier repository error when the installer later becomes unavailable', async () => {
		mkdirSync(path.join(cwd, '.agents', 'skills', 'atlassian-design-system'), {
			recursive: true,
		});
		mockSpawnSync.mockImplementation((command) =>
			command === 'npx' ? skillsInstallerUnavailable() : atlasCliUnavailable(),
		);

		await expect(runInit(['init'], createTestWriter(), { cwd })).rejects.toThrow(
			'already exists without a SKILL.md',
		);
		expect(mockSpawnSync).toHaveBeenCalledTimes(2);
		expect(mockSpawnSync).toHaveBeenNthCalledWith(
			1,
			'npx',
			expect.arrayContaining(['ui-styling-standard']),
			expect.any(Object),
		);
		expect(mockSpawnSync).toHaveBeenNthCalledWith(
			2,
			'atlas',
			['ads', '--help'],
			expect.any(Object),
		);
	});

	it('treats a missing npx command as an unavailable skills installer', async () => {
		mockSpawnSync.mockImplementation((command) =>
			command === 'npx' ? skillsInstallerCommandUnavailable() : atlasCliUnavailable(),
		);
		const writer = createTestWriter();

		expect(await runInit(['init', '--json'], writer, { cwd })).toBe(ExitCode.Ok);
		expect(JSON.parse(writer.stdout[0]).data.skills[0]).toMatchObject({
			status: 'not-installed',
			reason: 'skills-installer-unavailable',
		});
	});

	it('treats a silent skills installer failure as unavailable', async () => {
		mockSpawnSync.mockImplementation((command) =>
			command === 'npx' ? failure() : atlasCliUnavailable(),
		);
		const writer = createTestWriter();

		expect(await runInit(['init', '--json'], writer, { cwd })).toBe(ExitCode.Ok);
		expect(JSON.parse(writer.stdout[0]).data.skills).toEqual(
			skillNames.map((name) => ({
				name,
				status: 'not-installed',
				path: `.agents/skills/${name}`,
				reason: 'skills-installer-unavailable',
			})),
		);
		expect(mockSpawnSync).toHaveBeenCalledTimes(2);
		expect(mockSpawnSync).toHaveBeenNthCalledWith(
			1,
			'npx',
			expect.arrayContaining(['atlassian-design-system']),
			expect.any(Object),
		);
	});

	it('continues installing skills and writes guidance when one optional skill fails', async () => {
		const requests: Array<{ command: string; args: string[] }> = [];
		mockSpawnSync.mockImplementation((command, args) => {
			requests.push({ command, args });
			if (command === 'npx') {
				const skillName = args[3] as (typeof skillNames)[number];
				if (skillName === 'ui-styling-standard') {
					return failure('skill package rejected');
				}
				createSkill(cwd, skillName);
				return success();
			}
			return atlasCliUnavailable();
		});

		await expect(runInit(['init'], createTestWriter(), { cwd })).rejects.toThrow(
			'Failed to install the UI Styling Standard skill: skill package rejected',
		);

		expect(requests).toEqual([
			expect.objectContaining({
				command: 'npx',
				args: expect.arrayContaining(['atlassian-design-system']),
			}),
			expect.objectContaining({
				command: 'npx',
				args: expect.arrayContaining(['ui-styling-standard']),
			}),
			expect.objectContaining({
				command: 'npx',
				args: expect.arrayContaining(['a11y-foundation']),
			}),
			expect.objectContaining({ command: 'atlas', args: ['ads', '--help'] }),
		]);
		const agentsFile = readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8');
		expect(agentsFile).toContain('.agents/skills/atlassian-design-system/SKILL.md');
		expect(agentsFile).toContain('.agents/skills/a11y-foundation/SKILL.md');
		expect(agentsFile).not.toContain('.agents/skills/ui-styling-standard/SKILL.md');
	});

	it('does not clobber an existing destination that is not an installed skill', async () => {
		mkdirSync(path.join(cwd, '.agents', 'skills', 'atlassian-design-system'), {
			recursive: true,
		});
		createSkill(cwd, 'ui-styling-standard');
		createSkill(cwd, 'a11y-foundation');
		mockSpawnSync.mockImplementation(() => atlasCliUnavailable());

		await expect(runInit(['init'], createTestWriter(), { cwd })).rejects.toThrow(
			'already exists without a SKILL.md',
		);
		expect(mockSpawnSync).toHaveBeenCalledTimes(1);
		expect(mockSpawnSync).toHaveBeenCalledWith('atlas', ['ads', '--help'], expect.any(Object));
	});

	it('skips skill setup outside a Git repository and still installs the Atlas plugin', async () => {
		rmSync(path.join(cwd, '.git'), { recursive: true });
		const requests: Array<{ command: string; args: string[]; cwd: string }> = [];
		let atlasChecks = 0;
		mockSpawnSync.mockImplementation((command, args, options) => {
			requests.push({ command, args, cwd: options.cwd });
			if (args[0] === 'ads') {
				atlasChecks++;
				return atlasChecks === 1 ? failure() : success();
			}
			return success();
		});
		const writer = createTestWriter();

		const code = await runInit(['init'], writer, { cwd });

		expect(code).toBe(ExitCode.Ok);
		expect(requests).toEqual([
			expect.objectContaining({ command: 'atlas', args: ['ads', '--help'], cwd }),
			expect.objectContaining({
				command: 'atlas',
				args: ['plugin', 'install', '--name', 'ads'],
				cwd,
			}),
			expect.objectContaining({ command: 'atlas', args: ['ads', '--help'], cwd }),
		]);
		expect(requests).not.toEqual(
			expect.arrayContaining([expect.objectContaining({ command: 'npx' })]),
		);
		expect(writer.stdout).toEqual([
			'– Repository-local skills not installed because the current directory is not in a Git repository',
			'– AGENTS.md not updated because the current directory is not in a Git repository',
			'✓ Atlas CLI ADS plugin installed',
		]);
		expect(existsSync(path.join(cwd, '.agents'))).toBe(false);
		expect(existsSync(path.join(cwd, 'AGENTS.md'))).toBe(false);
	});

	it('emits one clean JSON envelope and reports an unavailable Atlas CLI', async () => {
		mockSpawnSync.mockImplementation((command, args) => {
			if (command === 'npx') {
				createSkill(cwd, args[3]);
				return success();
			}
			return atlasCliUnavailable();
		});
		const writer = createTestWriter();

		const code = await runInit(['init', '--json'], writer, { cwd });

		expect(code).toBe(ExitCode.Ok);
		expect(writer.stderr).toEqual([]);
		expect(writer.stdout).toHaveLength(1);
		expect(JSON.parse(writer.stdout[0])).toEqual(
			expect.objectContaining({
				type: 'ads-cli/init',
				command: 'init',
				ok: true,
				data: {
					projectRoot: cwd,
					skills: [
						{
							name: 'atlassian-design-system',
							status: 'installed',
							path: '.agents/skills/atlassian-design-system',
						},
						{
							name: 'ui-styling-standard',
							status: 'installed',
							path: '.agents/skills/ui-styling-standard',
						},
						{
							name: 'a11y-foundation',
							status: 'installed',
							path: '.agents/skills/a11y-foundation',
						},
					],
					agentsMd: {
						status: 'created',
						path: 'AGENTS.md',
					},
					atlas: { status: 'atlas-cli-unavailable' },
					nextStep: '.agents/skills/atlassian-design-system/references/get-started.md',
				},
			}),
		);
		expect(mockSpawnSync).toHaveBeenCalledWith(
			expect.any(String),
			expect.any(Array),
			expect.objectContaining({ stdio: 'pipe' }),
		);
	});

	it.each([
		{
			argv: ['init', 'unexpected'],
			message: '`init` does not accept positional arguments.',
		},
		{
			argv: ['init', '--bogus'],
			message: 'Unknown flag "--bogus".',
		},
	])('rejects invalid human input before running installers: $argv', async ({ argv, message }) => {
		const writer = createTestWriter();

		const code = await runInit(argv, writer, { cwd });

		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stdout).toEqual([]);
		expect(writer.stderr).toEqual([expect.stringContaining(message), 'Usage: init']);
		expect(mockSpawnSync).not.toHaveBeenCalled();
	});

	it.each([
		{
			argv: ['init', 'unexpected', '--json'],
			message: '`init` does not accept positional arguments.',
		},
		{
			argv: ['init', '--bogus', '--json'],
			message: 'Unknown flag "--bogus".',
		},
	])('rejects invalid JSON input before running installers: $argv', async ({ argv, message }) => {
		const writer = createTestWriter();

		const code = await runInit(argv, writer, { cwd });

		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr).toEqual([]);
		expect(writer.stdout).toHaveLength(1);
		expect(JSON.parse(writer.stdout[0])).toMatchObject({
			command: 'init',
			ok: false,
			error: {
				code: 'USAGE_ERROR',
				message,
			},
		});
		expect(mockSpawnSync).not.toHaveBeenCalled();
	});

	it('reports action commands as invalid batch children without running them', async () => {
		const writer = createTestWriter();

		const code = await run(['batch', '--json', '--command', 'init'], writer);

		expect(code).toBe(ExitCode.Ok);
		expect(JSON.parse(writer.stdout[0]).data[0]).toMatchObject({
			request: ['init'],
			status: 'failure',
			response: {
				command: 'init',
				ok: false,
				error: {
					code: 'USAGE_ERROR',
					message: 'Action command "init" cannot run inside batch.',
				},
			},
		});
	});
});
