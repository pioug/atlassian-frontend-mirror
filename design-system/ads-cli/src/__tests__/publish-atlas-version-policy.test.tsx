import { spawnSync } from 'child_process';
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

const scriptsDir = path.resolve(__dirname, '../../scripts/atlas');
const script = path.join(scriptsDir, 'publish-version-policy.tsx');
const releaseScript = path.join(scriptsDir, 'release-and-promote.tsx');
const runTs = path.join(path.dirname(require.resolve('@atlassian/ts-loader')), 'bin');
const nodeModules = path.resolve(__dirname, '../../../../../../node_modules');
const packageVersion = JSON.parse(
	readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'),
).version;
const initialVersion = '100-abcdef12';
const variants = ['darwin-amd64', 'darwin-arm64', 'linux-amd64', 'linux-arm64', 'windows-amd64'];
const manifest = `name = "ads"
[[release]]
version = "${initialVersion}"
variants = ${JSON.stringify(variants)}
channels = ["alpha", "stable"]
`;

describe('Atlas version policy publisher', () => {
	let directory: string;
	let outputDir: string;
	let manifestFile: string;
	const calls = () => {
		try {
			return readFileSync(path.join(directory, 'calls'), 'utf8')
				.trim()
				.split('\n')
				.map((line) => JSON.parse(line) as string[]);
		} catch {
			return [];
		}
	};
	const run = (
		overrides: Record<string, string | undefined> = {},
		entrypoint = script,
		args: string[] = [],
	) =>
		spawnSync(process.execPath, [runTs, entrypoint, ...args], {
			encoding: 'utf8',
			env: {
				...process.env,
				PATH: [directory, path.join(nodeModules, '.bin'), process.env.PATH].join(path.delimiter),
				BITBUCKET_BRANCH: 'master',
				BITBUCKET_BUILD_NUMBER: '1000',
				BITBUCKET_COMMIT: 'abcdef12'.repeat(5),
				BITBUCKET_CLONE_DIR_DEFAULT: directory,
				FAKE_STATE: directory,
				FAKE_MANIFEST: manifestFile,
				...overrides,
			},
		});

	beforeEach(() => {
		directory = mkdtempSync(path.join(tmpdir(), 'ads-policy-publisher-'));
		outputDir = path.join(
			directory,
			'platform/packages/design-system/ads-cli/build/atlas/version-policy',
		);
		manifestFile = path.join(directory, 'manifest.toml');
		writeFileSync(manifestFile, manifest);
		const fakeAtlas = path.join(directory, 'atlas');
		writeFileSync(
			fakeAtlas,
			`#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
const state = process.env.FAKE_STATE;
fs.appendFileSync(path.join(state, 'calls'), JSON.stringify(args) + '\\n');
const subdirectory = args[args.indexOf('--subdirectory') + 1];
if (args[0] !== 'statlas' || args[args.indexOf('--namespace') + 1] !== 'atlas-cli-plugin-ads') process.exit(2);
if (args[1] === 'head') {
  if (process.env.FAKE_HEAD_ERROR) process.exit(1);
  if (subdirectory === 'version-policy.json') {
    process.stdout.write(JSON.stringify({statusCode: Number(process.env.FAKE_POLICY_STATUS || (fs.existsSync(path.join(state, 'remote-policy.json')) ? 200 : 404))}));
    process.exit(0);
  }
  const missing = subdirectory.endsWith(process.env.FAKE_MISSING || 'never-matches');
  process.stdout.write(JSON.stringify({statusCode: missing ? 404 : Number(process.env.FAKE_HEAD_STATUS || 200)}));
} else if (args[1] === 'put') {
  if (process.env.FAKE_PUT_ERROR && subdirectory.startsWith('releases/')) process.exit(1);
  const file = args[args.indexOf('--file') + 1];
  if (subdirectory === 'version-policy.json') fs.copyFileSync(file, path.join(state, 'remote-policy.json'));
  else {
    const destination = path.join(state, 'uploads', subdirectory);
    fs.mkdirSync(destination, {recursive: true});
    fs.copyFileSync(file, path.join(destination, path.basename(file)));
  }
} else if (args[1] === 'post') {
  if (process.env.FAKE_POST_ERROR) process.exit(1);
  const destination = path.join(state, 'published-manifest');
  fs.mkdirSync(destination, {recursive: true});
  require('node:child_process').execFileSync('tar', ['-xzf', args[args.indexOf('--file') + 1], '-C', destination]);
  fs.copyFileSync(path.join(destination, 'manifest.toml'), process.env.FAKE_MANIFEST);
} else if (args[1] === 'get') {
  if (subdirectory === 'manifest.toml') {
    if (process.env.FAKE_MANIFEST_ERROR) process.exit(1);
    process.stdout.write(fs.readFileSync(process.env.FAKE_MANIFEST));
  } else process.stdout.write(process.env.FAKE_READBACK || fs.readFileSync(path.join(state, 'remote-policy.json')));
} else process.exit(2);
`,
		);
		chmodSync(fakeAtlas, 0o755);
		const fakeAfm = path.join(directory, 'afm');
		writeFileSync(
			fakeAfm,
			`#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
fs.appendFileSync(path.join(process.env.FAKE_STATE, 'calls'), JSON.stringify(['afm', ...args]) + '\\n');
if (process.env.FAKE_STAGE_ERROR === (args[0] === 'run' ? args[1] : args[0])) process.exit(1);
if (args[0] === 'test' || args[0] === 'ts') process.exit(0);
if (args[1] === 'package:atlas') {
  const out = path.join(process.cwd(), 'build/atlas');
  fs.mkdirSync(out, { recursive: true });
  for (const variant of ${JSON.stringify(variants)}) {
    if (process.env.FAKE_SKIP_VARIANT === variant) continue;
    fs.writeFileSync(path.join(out, 'ads-' + variant + (variant === 'windows-amd64' ? '.exe' : '')), '#!/bin/sh\\nexit 0\\n');
  }
  process.exit(0);
}
const file = process.env.FAKE_MANIFEST;
let manifest = fs.readFileSync(file, 'utf8');
const version = process.env.VERSION;
if (args[1] === 'release:atlas:upload') {
  manifest += '\\n[[release]]\\nversion = "' + version + '"\\npackage_version = "${packageVersion}"\\nvariants = ${JSON.stringify(variants)}\\nchannels = ["alpha"]\\n';
} else if (args[1] === 'release:atlas:promote') {
  manifest = manifest.split('[[release]]').map(section => section.includes('version = "' + version + '"') ? section.replace('["alpha"]', '["alpha", "stable"]') : section).join('[[release]]');
} else process.exit(2);
if (!process.env.FAKE_STAGE_NOOP) fs.writeFileSync(file, manifest);
`,
		);
		chmodSync(fakeAfm, 0o755);
	});

	afterEach(() => {
		rmSync(directory, { recursive: true, force: true });
	});

	it('validates a branch dry run against stable and every archive and checksum without publishing', () => {
		const result = run({ BITBUCKET_BRANCH: 'feature-policy' }, script, ['--dry-run']);
		expect(result.status).toBe(0);
		expect(result.stdout).toContain('Dry run: no policy published');
		expect(JSON.parse(readFileSync(path.join(outputDir, 'version-policy.json'), 'utf8'))).toEqual({
			enabled: true,
			recommendedVersion: initialVersion,
		});
		expect(
			calls().filter((args) => args[1] === 'head' && !args.includes('version-policy.json')),
		).toHaveLength(10);
		expect(calls()).toContainEqual([
			'statlas',
			'head',
			'--namespace',
			'atlas-cli-plugin-ads',
			'--subdirectory',
			`releases/${initialVersion}/linux-amd64.tar.gz.sha256`,
			'--output=json',
		]);
		expect(calls().some((args) => args[1] === 'put')).toBe(false);
	});

	it('writes review artifacts to the native workspace when AFM uses another checkout', () => {
		const workspace = path.join(directory, 'bitbucket-workspace');
		expect(
			run({
				BITBUCKET_CLONE_DIR_DEFAULT: workspace,
				BITBUCKET_CLONE_DIR: path.join(directory, 'afm-checkout'),
			}).status,
		).toBe(0);
		expect(
			JSON.parse(
				readFileSync(
					path.join(
						workspace,
						'platform/packages/design-system/ads-cli/build/atlas/version-policy/version-policy.json',
					),
					'utf8',
				),
			),
		).toEqual({ enabled: true, recommendedVersion: initialVersion });
	});

	it.each([
		['an invalid release identifier', manifest.replace(initialVersion, 'latest')],
		['another plugin', manifest.replace('"ads"', '"other"')],
		['an incomplete platform list', manifest.replace(',"windows-amd64"', '')],
		['invalid TOML', 'invalid manifest ['],
	])('rejects %s before publishing', (_description, content) => {
		writeFileSync(manifestFile, content);
		expect(run().status).toBe(1);
		expect(calls().some((args) => args[1] === 'put')).toBe(false);
	});

	it.each(['linux-amd64.tar.gz', 'linux-amd64.tar.gz.sha256'])(
		'rejects a missing artifact: %s',
		(missing) => {
			expect(run({ FAKE_MISSING: missing }).status).toBe(1);
			expect(calls().some((args) => args[1] === 'put')).toBe(false);
		},
	);

	it.each(['403', '404', '500'])(
		'rejects HTTP %s even when the Atlas command exits zero',
		(status) => {
			const result = run({ FAKE_HEAD_STATUS: status });
			expect(result.status).toBe(1);
			expect(result.stderr).toContain(`unavailable (HTTP ${status})`);
			expect(calls().some((args) => args[1] === 'put')).toBe(false);
		},
	);

	it('rejects a failed Atlas metadata command before publication', () => {
		expect(run({ FAKE_HEAD_ERROR: 'true' }).status).toBe(1);
		expect(calls().some((args) => args[1] === 'put')).toBe(false);
	});

	it('rejects actual branch publication before any remote calls', () => {
		expect(run({ BITBUCKET_BRANCH: 'feature-policy' }).status).toBe(1);
		expect(calls()).toEqual([]);
	});

	it('publishes and verifies the exact policy from master without an expiring lifecycle', () => {
		const result = run();
		expect(result.status).toBe(0);
		expect(calls()).toContainEqual([
			'statlas',
			'put',
			'--namespace',
			'atlas-cli-plugin-ads',
			'--file',
			'version-policy.json',
			'--subdirectory',
			'version-policy.json',
		]);
		expect(JSON.parse(readFileSync(path.join(outputDir, 'published-policy.json'), 'utf8'))).toEqual(
			{ enabled: true, recommendedVersion: initialVersion },
		);
	});

	it('accepts a semantically identical readback with reordered keys', () => {
		const result = run({
			FAKE_READBACK: JSON.stringify({ recommendedVersion: initialVersion, enabled: true }),
		});
		expect(result.status).toBe(0);
		expect(result.stdout).toContain('Published and verified');
	});

	it.each([{ enabled: false }, { enabled: true, minimumVersion: '101-abcdef12' }])(
		'reports a conflicting readback %j instead of claiming publication succeeded',
		(readback) => {
			const result = run({
				BITBUCKET_BRANCH: 'master',
				FAKE_READBACK: JSON.stringify(readback),
			});
			expect(result.status).toBe(1);
			expect(result.stderr).toContain('Policy readback differs');
		},
	);
	const stableHistory = (builds = [900, 200, 700, 100, 800, 600, 300, 400, 500]) =>
		'name = "ads"\n' +
		builds
			.map(
				(build) => `[[release]]
version = "${build}-abcdef12"
${build === 1000 ? `package_version = "${packageVersion}"\n` : ''}variants = ${JSON.stringify(variants)}
channels = ["alpha", "stable"]
`,
			)
			.join('');
	const remotePolicy = () =>
		JSON.parse(readFileSync(path.join(directory, 'remote-policy.json'), 'utf8'));
	const setPolicy = (policy: unknown) =>
		writeFileSync(path.join(directory, 'remote-policy.json'), JSON.stringify(policy));
	const release = (overrides: Record<string, string | undefined> = {}) =>
		run({ BITBUCKET_BRANCH: 'master', ...overrides }, releaseScript);

	it('selects warning and blocking thresholds by numeric build, excluding alpha and duplicate entries', () => {
		writeFileSync(
			manifestFile,
			stableHistory([900, 200, 700, 100, 800, 600, 300, 400, 500, 500]) +
				'[[release]]\nversion = "99999-abcdef12"\nchannels = ["alpha"]\n',
		);
		expect(run().status).toBe(0);
		expect(remotePolicy()).toEqual({
			enabled: true,
			minimumVersion: '300-abcdef12',
			recommendedVersion: '900-abcdef12',
		});
	});

	it('publishes only a warning threshold with seven stable releases', () => {
		writeFileSync(manifestFile, stableHistory([900, 800, 700, 600, 500, 400, 300]));
		expect(run().status).toBe(0);
		expect(remotePolicy()).toEqual({
			enabled: true,
			recommendedVersion: '900-abcdef12',
		});
	});

	it('derives a warning-only policy from short history rather than retaining an old minimum', () => {
		writeFileSync(manifestFile, stableHistory([900, 800, 700]));
		setPolicy({ enabled: true, minimumVersion: '700-abcdef12' });
		expect(run().status).toBe(0);
		expect(remotePolicy()).toEqual({
			enabled: true,
			recommendedVersion: '900-abcdef12',
		});
	});

	it('starts blocking at seven behind once eight stable releases exist', () => {
		writeFileSync(manifestFile, stableHistory([900, 800, 700, 600, 500, 400, 300, 200]));
		expect(run().status).toBe(0);
		expect(remotePolicy()).toEqual({
			enabled: true,
			minimumVersion: '300-abcdef12',
			recommendedVersion: '900-abcdef12',
		});
	});

	it('leaves the policy unchanged when there are no stable releases', () => {
		writeFileSync(manifestFile, manifest.replace('["alpha", "stable"]', '["alpha"]'));
		expect(run().status).toBe(0);
		expect(calls().some((args) => args[1] === 'put')).toBe(false);
	});

	it('does not republish an unchanged automatic policy', () => {
		writeFileSync(manifestFile, stableHistory());
		setPolicy({
			enabled: true,
			minimumVersion: '300-abcdef12',
			recommendedVersion: '900-abcdef12',
		});
		expect(run().status).toBe(0);
		expect(calls().some((args) => args[1] === 'put')).toBe(false);
	});

	it.each(['403', '500'])('does not treat policy HTTP %s as a missing policy', (status) => {
		expect(run({ FAKE_POLICY_STATUS: status }).status).toBe(1);
		expect(calls().some((args) => args[1] === 'put')).toBe(false);
	});

	it.each(['not-json', '{"enabled":"yes"}', '{"enabled":true,"minimumVersion":"latest"}'])(
		'does not replace invalid remote policy %s',
		(content) => {
			writeFileSync(path.join(directory, 'remote-policy.json'), content);
			expect(run().status).toBe(1);
			expect(calls().some((args) => args[1] === 'put')).toBe(false);
		},
	);

	it('leaves the old minimum intact if the selected release artifact is unavailable', () => {
		writeFileSync(manifestFile, stableHistory());
		const previous = { enabled: true, minimumVersion: initialVersion };
		setPolicy(previous);
		expect(run({ FAKE_MISSING: 'linux-amd64.tar.gz' }).status).toBe(1);
		expect(remotePolicy()).toEqual(previous);
		expect(calls().some((args) => args[1] === 'put')).toBe(false);
	});

	it('uploads, verifies, promotes, verifies stable, then updates the cutoff', () => {
		writeFileSync(manifestFile, stableHistory());
		const result = release();
		expect(result.status).toBe(0);
		const history = calls();
		const upload = history.findIndex(
			(args) => args[0] === 'afm' && args[2] === 'release:atlas:upload',
		);
		const promote = history.findIndex(
			(args) => args[0] === 'afm' && args[2] === 'release:atlas:promote',
		);
		const publish = history.findIndex((args) => args[1] === 'put');
		expect(upload).toBeGreaterThan(-1);
		expect(
			history
				.slice(0, upload)
				.filter((args) => args[0] === 'afm')
				.map((args) => args[1]),
		).toEqual(['test', 'ts']);
		expect(promote).toBeGreaterThan(upload);
		expect(publish).toBeGreaterThan(promote);
		expect(history.slice(upload + 1, promote).filter((args) => args[1] === 'head')).toHaveLength(
			10,
		);
		const policyRead = history.findIndex((args) => args.includes('version-policy.json'));
		expect(policyRead).toBeGreaterThan(promote);
		expect(
			history
				.slice(promote + 1, policyRead)
				.filter(
					(args) =>
						args[1] === 'head' && args.includes('releases/1000-abcdef12/linux-amd64.tar.gz'),
				),
		).toHaveLength(1);
		expect(remotePolicy().minimumVersion).toBe('400-abcdef12');
	});

	it.each(['test', 'ts', 'release:atlas:upload', 'release:atlas:promote'])(
		'stops after a failed %s before policy publication',
		(stage) => {
			writeFileSync(manifestFile, stableHistory());
			expect(release({ FAKE_STAGE_ERROR: stage }).status).toBe(1);
			expect(calls().some((args) => args[1] === 'put')).toBe(false);
			if (stage !== 'release:atlas:promote')
				expect(calls().some((args) => args[2] === 'release:atlas:promote')).toBe(false);
		},
	);

	it('rejects a promotion that exits zero without updating stable', () => {
		writeFileSync(
			manifestFile,
			stableHistory() +
				stableHistory([1000])
					.replace('name = "ads"\n', '')
					.replace('["alpha", "stable"]', '["alpha"]'),
		);
		expect(release({ FAKE_STAGE_NOOP: 'true' }).status).toBe(1);
		expect(calls().some((args) => args[1] === 'put')).toBe(false);
	});

	it.each(['alpha', 'stable'])(
		'resumes an existing %s release without rebuilding it',
		(channel) => {
			writeFileSync(
				manifestFile,
				stableHistory() +
					stableHistory([1000])
						.replace('name = "ads"\n', '')
						.replace(
							'["alpha", "stable"]',
							channel === 'alpha' ? '["alpha"]' : '["alpha", "stable"]',
						),
			);
			expect(release().status).toBe(0);
			expect(calls().some((args) => args[2] === 'release:atlas:upload')).toBe(false);
			expect(calls().some((args) => args[2] === 'release:atlas:promote')).toBe(channel === 'alpha');
		},
	);

	it('rejects an older pipeline run before upload or promotion', () => {
		writeFileSync(manifestFile, stableHistory());
		const result = release({ BITBUCKET_BUILD_NUMBER: '50' });
		expect(result.status).toBe(1);
		expect(result.stderr).toContain('already stable');
		expect(calls().some((args) => args[0] === 'afm' || args[1] === 'put')).toBe(false);
	});

	it('stops before promotion when an uploaded archive is missing', () => {
		writeFileSync(manifestFile, stableHistory());
		expect(release({ FAKE_MISSING: 'linux-amd64.tar.gz.sha256' }).status).toBe(1);
		expect(calls().some((args) => args[2] === 'release:atlas:promote' || args[1] === 'put')).toBe(
			false,
		);
	});

	it('skips packaging, upload and promotion when the latest stable package version is unchanged', () => {
		writeFileSync(
			manifestFile,
			stableHistory().replace(
				'version = "900-abcdef12"',
				`version = "900-abcdef12"\npackage_version = "${packageVersion}"`,
			),
		);
		const result = release();
		expect(result.status).toBe(0);
		expect(result.stdout).toContain('already released; skipping');
		expect(calls().some((args) => args[0] === 'afm')).toBe(false);
		expect(remotePolicy().recommendedVersion).toBe('900-abcdef12');
	});

	it('releases when the ADS CLI package version has changed', () => {
		writeFileSync(
			manifestFile,
			stableHistory().replace(
				'version = "900-abcdef12"',
				'version = "900-abcdef12"\npackage_version = "0.0.0"',
			),
		);
		expect(release().status).toBe(0);
		expect(calls().some((args) => args[2] === 'release:atlas:upload')).toBe(true);
		expect(readFileSync(manifestFile, 'utf8')).toContain(`package_version = "${packageVersion}"`);
	});

	it.each([
		{ BITBUCKET_BRANCH: 'feature' },
		{ BITBUCKET_BUILD_NUMBER: '' },
		{ BITBUCKET_BUILD_NUMBER: '9007199254740992' },
		{ BITBUCKET_COMMIT: 'not-a-sha' },
	])('rejects invalid release context %j before remote calls', (overrides) => {
		expect(release(overrides).status).toBe(1);
		expect(calls()).toEqual([]);
	});
});
