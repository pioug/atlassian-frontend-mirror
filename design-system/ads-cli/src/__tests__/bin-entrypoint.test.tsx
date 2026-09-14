import { spawnSync } from 'node:child_process';
import {
	chmodSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

describe('npm binary entrypoint', () => {
	it('installs the skill and falls back to npx when Atlas is unavailable', () => {
		const cwd = mkdtempSync(path.join(os.tmpdir(), 'ads-cli-bin-init-'));
		const skillsPath = path.join(cwd, '.agents', 'skills');
		const adsSkillPath = path.join(skillsPath, 'atlassian-design-system');
		const skillEntrypoint = path.join(adsSkillPath, 'SKILL.md');
		const getStarted = path.join(adsSkillPath, 'references', 'get-started.md');
		const fakeInstaller = path.join(cwd, 'fake-npx.js');
		const fakeNpx = path.join(cwd, process.platform === 'win32' ? 'npx.cmd' : 'npx');
		mkdirSync(path.join(cwd, '.git'));
		writeFileSync(
			fakeInstaller,
			[
				"const { mkdirSync, writeFileSync } = require('node:fs');",
				"const path = require('node:path');",
				`const skills = ${JSON.stringify([
					'atlassian-design-system',
					'ui-styling-standard',
					'a11y-foundation',
				])};`,
				'const skillName = process.argv.find((arg) => skills.includes(arg));',
				'if (!skillName) process.exit(0);',
				`const skillPath = path.join(${JSON.stringify(skillsPath)}, skillName);`,
				'mkdirSync(skillPath, { recursive: true });',
				"writeFileSync(path.join(skillPath, 'SKILL.md'), '# ' + skillName + '\\n');",
				"if (skillName === 'atlassian-design-system') {",
				"  mkdirSync(path.join(skillPath, 'references'), { recursive: true });",
				"  writeFileSync(path.join(skillPath, 'references', 'get-started.md'), '# Get started\\n');",
				'}',
			].join('\n'),
		);
		if (process.platform === 'win32') {
			writeFileSync(fakeNpx, `@"${process.execPath}" "${fakeInstaller}" %*\r\n`);
		} else {
			writeFileSync(fakeNpx, `#!${process.execPath}\nrequire(${JSON.stringify(fakeInstaller)});\n`);
			chmodSync(fakeNpx, 0o755);
		}

		try {
			const result = spawnSync(
				process.execPath,
				[path.join(__dirname, '..', '..', 'bin', 'ads-cli.js'), 'init'],
				{ cwd, encoding: 'utf8', env: { ...process.env, PATH: cwd } },
			);

			expect(result.status).toBe(0);
			expect(result.stderr).toBe('');
			expect(result.stdout.trimEnd().split(/\r?\n/)).toEqual([
				'✓ ADS skill installed at .agents/skills/atlassian-design-system',
				'✓ UI Styling Standard skill installed at .agents/skills/ui-styling-standard',
				'✓ Accessibility Foundation skill installed at .agents/skills/a11y-foundation',
				'✓ Created AGENTS.md with ADS setup guidance',
				'– Atlas CLI is unavailable; use npx @atlaskit/ads-cli for ADS commands',
				'→ Next: follow .agents/skills/atlassian-design-system/references/get-started.md to complete repository setup',
			]);
			expect(existsSync(skillEntrypoint)).toBe(true);
			expect(existsSync(getStarted)).toBe(true);
			expect(existsSync(path.join(skillsPath, 'ui-styling-standard', 'SKILL.md'))).toBe(true);
			expect(existsSync(path.join(skillsPath, 'a11y-foundation', 'SKILL.md'))).toBe(true);
			expect(existsSync(path.join(cwd, 'AGENTS.md'))).toBe(true);
		} finally {
			rmSync(cwd, { recursive: true, force: true });
		}
	});

	it('degrades to public guidance when the skills installer is unavailable', () => {
		const cwd = mkdtempSync(path.join(os.tmpdir(), 'ads-cli-bin-init-public-'));
		const fakeNpx = path.join(cwd, process.platform === 'win32' ? 'npx.cmd' : 'npx');
		mkdirSync(path.join(cwd, '.git'));
		if (process.platform === 'win32') {
			writeFileSync(fakeNpx, '@exit /b 1\r\n');
		} else {
			writeFileSync(fakeNpx, '#!/bin/sh\nexit 1\n');
			chmodSync(fakeNpx, 0o755);
		}

		try {
			const result = spawnSync(
				process.execPath,
				[path.join(__dirname, '..', '..', 'bin', 'ads-cli.js'), 'init'],
				{ cwd, encoding: 'utf8', env: { ...process.env, PATH: cwd } },
			);

			expect(result.status).toBe(0);
			expect(result.stderr).toBe('');
			expect(result.stdout.trimEnd().split(/\r?\n/)).toEqual([
				'– Repository-local skills skipped because @atlassian/skills is unavailable; npx @atlaskit/ads-cli remains available',
				'✓ Created AGENTS.md with ADS setup guidance',
				'– Atlas CLI is unavailable; use npx @atlaskit/ads-cli for ADS commands',
			]);
			const agentsFile = path.join(cwd, 'AGENTS.md');
			expect(existsSync(agentsFile)).toBe(true);
			const content = readFileSync(agentsFile, 'utf8');
			expect(content).toContain('https://mcp.atlassian.com/v1/ads/public/mcp');
			expect(content).not.toContain('.agents/skills/');
			expect(existsSync(path.join(cwd, '.cursor', 'mcp.json'))).toBe(false);
			expect(existsSync(path.join(cwd, '.vscode', 'mcp.json'))).toBe(false);
			expect(existsSync(path.join(cwd, '.codex', 'config.toml'))).toBe(false);
		} finally {
			rmSync(cwd, { recursive: true, force: true });
		}
	});

	it('runs init end-to-end without changing an existing skill', () => {
		const cwd = mkdtempSync(path.join(os.tmpdir(), 'ads-cli-bin-init-'));
		const skillsPath = path.join(cwd, '.agents', 'skills');
		const skillPath = path.join(skillsPath, 'atlassian-design-system');
		mkdirSync(path.join(cwd, '.git'));
		mkdirSync(path.join(skillPath, 'references'), { recursive: true });
		writeFileSync(path.join(skillPath, 'SKILL.md'), '# Atlassian Design System\n');
		writeFileSync(path.join(skillPath, 'references', 'get-started.md'), '# Get started\n');
		for (const skillName of ['ui-styling-standard', 'a11y-foundation']) {
			const additionalSkillPath = path.join(skillsPath, skillName);
			mkdirSync(additionalSkillPath, { recursive: true });
			writeFileSync(path.join(additionalSkillPath, 'SKILL.md'), `# ${skillName}\n`);
		}

		try {
			const result = spawnSync(
				process.execPath,
				[path.join(__dirname, '..', '..', 'bin', 'ads-cli.js'), 'init'],
				{ cwd, encoding: 'utf8', env: { ...process.env, PATH: cwd } },
			);

			expect(result.status).toBe(0);
			expect(result.stderr).toBe('');
			expect(result.stdout.trimEnd().split(/\r?\n/)).toEqual([
				'✓ ADS skill already set up at .agents/skills/atlassian-design-system',
				'✓ UI Styling Standard skill already set up at .agents/skills/ui-styling-standard',
				'✓ Accessibility Foundation skill already set up at .agents/skills/a11y-foundation',
				'✓ Created AGENTS.md with ADS setup guidance',
				'– Atlas CLI is unavailable; use npx @atlaskit/ads-cli for ADS commands',
				'→ Next: follow .agents/skills/atlassian-design-system/references/get-started.md to complete repository setup',
			]);
		} finally {
			rmSync(cwd, { recursive: true, force: true });
		}
	});

	it('returns full metadata for an individual token', () => {
		const result = spawnSync(
			process.execPath,
			[
				path.join(__dirname, '..', '..', 'bin', 'ads-cli.js'),
				'token',
				'border.width.focused',
				'--json',
			],
			{ encoding: 'utf8' },
		);
		const envelope = JSON.parse(result.stdout);

		expect(result.status).toBe(0);
		expect(result.stderr).toBe('');
		expect(envelope.data).toEqual(
			expect.objectContaining({
				name: 'border.width.focused',
				usageGuidelines: expect.objectContaining({
					usage: expect.any(String),
					cssProperties: expect.arrayContaining(['border-width']),
				}),
				usage: "token('border.width.focused')",
			}),
		);
	});

	it('lets large JSON output drain before exiting', () => {
		const result = spawnSync(
			process.execPath,
			[path.join(__dirname, '..', '..', 'bin', 'ads-cli.js'), 'icon', '--all', '--json'],
			{
				encoding: 'utf8',
				maxBuffer: 1024 * 1024,
			},
		);

		expect(result.status).toBe(0);
		expect(result.stderr).toBe('');
		expect(JSON.parse(result.stdout)).toEqual(
			expect.objectContaining({
				command: 'icon',
				ok: true,
				data: expect.any(Array),
			}),
		);
	});
});
