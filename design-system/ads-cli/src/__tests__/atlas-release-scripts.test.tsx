import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { fetchManifest } from '../../scripts/atlas/fetch-manifest';
import { prepareRelease } from '../../scripts/atlas/prepare-release';
import { promoteStable } from '../../scripts/atlas/promote-stable';
import { parseManifest, statlas, variants } from '../../scripts/atlas/release-manifest';
import { publishManifest } from '../../scripts/atlas/script-helpers';
import { uploadRelease } from '../../scripts/atlas/upload-release';

jest.mock('node:child_process', () => ({
	...jest.requireActual('node:child_process'),
	execFileSync: jest.fn(),
}));
jest.mock('../../scripts/atlas/release-manifest', () => ({
	...jest.requireActual('../../scripts/atlas/release-manifest'),
	statlas: jest.fn(),
}));
jest.mock('../../scripts/atlas/script-helpers', () => ({
	...jest.requireActual('../../scripts/atlas/script-helpers'),
	get packageDir() {
		return mockPackageDir;
	},
	get manifestPath() {
		return require('node:path').join(mockPackageDir, 'manifest.toml');
	},
	publishManifest: jest.fn(),
}));

let mockPackageDir: string;
const actualExec =
	jest.requireActual<typeof import('node:child_process')>('node:child_process').execFileSync;
const mockExec = jest.mocked(execFileSync);
const mockStatlas = jest.mocked(statlas);
const mockPublish = jest.mocked(publishManifest);
const manifest = 'name = "ads"\n[[release]]\nversion = "100-abcdef12"\nchannels = ["stable"]\n';
const readManifest = () => readFileSync(path.join(mockPackageDir, 'manifest.toml'), 'utf8');
const binaryPath = (variant: string) =>
	path.join(
		mockPackageDir,
		'build/atlas',
		`ads-${variant}${variant.startsWith('windows') ? '.exe' : ''}`,
	);

describe('Atlas release scripts', () => {
	const originalVersion = process.env.VERSION;

	beforeEach(() => {
		jest.resetAllMocks();
		mockPackageDir = mkdtempSync(path.join(tmpdir(), 'ads-release-scripts-'));
		process.env.VERSION = '1000-abcdef12';
		writeFileSync(path.join(mockPackageDir, 'manifest.toml'), manifest);
		writeFileSync(path.join(mockPackageDir, 'package.json'), JSON.stringify({ version: '0.1.0' }));
		mkdirSync(path.join(mockPackageDir, 'build/atlas'), { recursive: true });
		variants.forEach((variant) => writeFileSync(binaryPath(variant), 'test binary'));
		mockStatlas.mockReturnValue(manifest);
		// Exercise real tar/checksum handling; builds and binary execution stay mocked.
		mockExec.mockImplementation((file, args, options) =>
			file === 'tar' ? actualExec(file, args, options) : Buffer.alloc(0),
		);
		jest.spyOn(process.stdout, 'write').mockReturnValue(true);
	});

	afterEach(() => {
		jest.restoreAllMocks();
		if (originalVersion === undefined) delete process.env.VERSION;
		else process.env.VERSION = originalVersion;
		rmSync(mockPackageDir, { recursive: true, force: true });
	});

	it('packages all platforms, records the package version and writes matching archive checksums', () => {
		prepareRelease();
		expect(readManifest()).toContain('version = "1000-abcdef12"');
		expect(readManifest()).toContain('package_version = "0.1.0"');
		for (const variant of variants) {
			const archive = path.join(
				mockPackageDir,
				'build/releases/1000-abcdef12',
				variant,
				`${variant}.tar.gz`,
			);
			const hash = createHash('sha256').update(readFileSync(archive)).digest('hex');
			expect(readFileSync(`${archive}.sha256`, 'utf8')).toBe(`${hash}  ${variant}.tar.gz\n`);
			expect(actualExec('tar', ['-tzf', archive], { encoding: 'utf8' }).trim()).toBe(
				variant === 'windows-amd64' ? 'ads.exe' : 'ads',
			);
		}
	});

	it.each(['build failure', 'missing binary'])('preserves the manifest after %s', (failure) => {
		if (failure === 'build failure') {
			mockExec.mockImplementationOnce(() => {
				throw new Error('Build failed');
			});
		} else rmSync(binaryPath('windows-amd64'));
		expect(prepareRelease).toThrow();
		expect(readManifest()).toBe(manifest);
	});

	it('keeps the local manifest when the downloaded TOML is invalid', () => {
		mockStatlas.mockReturnValue('invalid TOML');
		expect(fetchManifest).toThrow();
		expect(readManifest()).toBe(manifest);
	});

	it('uploads every archive and checksum before publishing the manifest', () => {
		uploadRelease();
		expect(mockStatlas.mock.calls.slice(1).map(([args]) => args)).toEqual(
			variants.flatMap((variant) =>
				['', '.sha256'].map((suffix) => [
					'put',
					'--file',
					`${variant}.tar.gz${suffix}`,
					'--subdirectory',
					'releases/1000-abcdef12/',
				]),
			),
		);
		expect(mockPublish).toHaveBeenCalledTimes(1);
		expect(mockPublish.mock.invocationCallOrder[0]).toBeGreaterThan(
			Math.max(...mockStatlas.mock.invocationCallOrder),
		);
	});

	it('does not publish the manifest after an upload fails', () => {
		mockStatlas.mockReturnValueOnce(manifest).mockImplementationOnce(() => {
			throw new Error('Upload failed');
		});
		expect(uploadRelease).toThrow('Upload failed');
		expect(mockPublish).not.toHaveBeenCalled();
	});

	it('promotes the selected release while preserving other releases and metadata', () => {
		const source =
			manifest +
			'\n[[release]]\nversion = "1000-abcdef12"\nchannels = ["alpha"]\nnotes = "Keep me"\n';
		mockStatlas.mockReturnValue(source);
		promoteStable();
		expect(parseManifest(readManifest()).release).toEqual([
			{ version: '100-abcdef12', channels: ['stable'] },
			{ version: '1000-abcdef12', channels: ['alpha', 'stable'], notes: 'Keep me' },
		]);
		expect(mockPublish).toHaveBeenCalledTimes(1);
	});

	it('does not republish an already stable release', () => {
		process.env.VERSION = '100-abcdef12';
		promoteStable();
		expect(mockPublish).not.toHaveBeenCalled();
	});

	it('exits with an error when invoked without VERSION', () => {
		const runTs = path.join(path.dirname(require.resolve('@atlassian/ts-loader')), 'bin');
		const result = spawnSync(
			process.execPath,
			[runTs, path.resolve(__dirname, '../../scripts/atlas/upload-release.tsx')],
			{ encoding: 'utf8', env: { ...process.env, VERSION: '' } },
		);
		expect(result.status).toBe(1);
		expect(result.stderr).toContain('Set VERSION');
	});
});
