import { main } from '../atlas-cli';
import { run } from '../cli';
import * as releaseVersion from '../get-atlas-release-version';
import * as versionPolicy from '../get-atlas-version-policy';
import { defaultWriter } from '../output/writer';

jest.mock('../cli', () => ({
	run: jest.fn(),
}));

const mockRun = run as jest.MockedFunction<typeof run>;

describe('Atlas minimum supported version', () => {
	const originalExitCode = process.exitCode;
	let loadPolicy: jest.SpyInstance;
	let getVersion: jest.SpyInstance;
	let stdout: jest.SpyInstance;
	let stderr: jest.SpyInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		mockRun.mockResolvedValue(0);
		getVersion = jest
			.spyOn(releaseVersion, 'getAtlasReleaseVersion')
			.mockReturnValue('99-aaaaaaaa');
		loadPolicy = jest
			.spyOn(versionPolicy, 'getAtlasVersionPolicy')
			.mockResolvedValue({ enabled: true, minimumVersion: '100-bbbbbbbb' });
		stdout = jest.spyOn(defaultWriter, 'out').mockImplementation(() => undefined);
		stderr = jest.spyOn(defaultWriter, 'err').mockImplementation(() => undefined);
	});

	afterEach(() => {
		process.exitCode = originalExitCode;
		jest.restoreAllMocks();
	});

	it('blocks stale lookups before dispatch with an actionable JSON error', async () => {
		await main(['search', 'avatar', '--json']);
		expect(mockRun).not.toHaveBeenCalled();
		expect(process.exitCode).toBe(1);
		expect(JSON.parse(stdout.mock.calls[0][0])).toEqual({
			type: 'ads-cli/error',
			command: 'search',
			ok: false,
			error: {
				code: 'UPGRADE_REQUIRED',
				message: expect.stringContaining('atlas plugin upgrade --name ads --channel stable'),
			},
		});
		expect(stderr).not.toHaveBeenCalled();
	});

	it('blocks a stale human-readable lookup on stderr', async () => {
		await main(['search', 'avatar']);
		expect(mockRun).not.toHaveBeenCalled();
		expect(stdout).not.toHaveBeenCalled();
		expect(stderr).toHaveBeenCalledWith(expect.stringContaining('100-bbbbbbbb'));
		expect(stderr).toHaveBeenCalledWith(expect.stringContaining('Error: '));
		expect(process.exitCode).toBe(1);
	});

	it('treats a valued --json flag as human output, matching run()', async () => {
		await main(['search', 'avatar', '--json=false']);
		expect(mockRun).not.toHaveBeenCalled();
		expect(stdout).not.toHaveBeenCalled();
		expect(stderr).toHaveBeenCalledWith(expect.stringContaining('100-bbbbbbbb'));
	});

	it.each([['--help=x'], ['--version=x']])(
		'still enforces the policy for a valued %s flag that run() does not short-circuit',
		async (flag) => {
			await main(['search', 'avatar', flag]);
			expect(loadPolicy).toHaveBeenCalledTimes(1);
			expect(mockRun).not.toHaveBeenCalled();
			expect(process.exitCode).toBe(1);
		},
	);

	it.each(['100-bbbbbbbb', '101-cccccccc'])('permits supported release %s', async (version) => {
		getVersion.mockReturnValue(version);
		await main(['search', 'avatar']);
		expect(mockRun).toHaveBeenCalled();
		expect(process.exitCode).toBe(0);
	});

	it.each(['99-aaaaaaaa', '98-aaaaaaaa', '97-aaaaaaaa', '94-aaaaaaaa'])(
		'warns without blocking a supported stale release %s, including JSON callers',
		async (version) => {
			getVersion.mockReturnValue(version);
			loadPolicy.mockResolvedValue({
				enabled: true,
				minimumVersion: '94-bbbbbbbb',
				recommendedVersion: '100-bbbbbbbb',
			});
			await main(['search', 'avatar', '--json']);
			expect(mockRun).toHaveBeenCalled();
			expect(process.exitCode).toBe(0);
			expect(stdout).not.toHaveBeenCalled();
			expect(stderr).toHaveBeenCalledTimes(1);
			expect(stderr).toHaveBeenCalledWith(expect.stringContaining('Warning:'));
			expect(stderr).toHaveBeenCalledWith(
				expect.stringContaining('atlas plugin upgrade --name ads --channel stable'),
			);
		},
	);

	it('requires an update at exactly seven releases behind and emits no redundant warning', async () => {
		getVersion.mockReturnValue('93-aaaaaaaa');
		loadPolicy.mockResolvedValue({
			enabled: true,
			minimumVersion: '94-bbbbbbbb',
			recommendedVersion: '100-bbbbbbbb',
		});
		await main(['search', 'avatar', '--json']);
		expect(mockRun).not.toHaveBeenCalled();
		expect(process.exitCode).toBe(1);
		expect(JSON.parse(stdout.mock.calls[0][0]).error.code).toBe('UPGRADE_REQUIRED');
		expect(stderr).not.toHaveBeenCalled();
	});

	it.each(['100-aaaaaaaa', '101-aaaaaaaa'])(
		'does not warn for current or newer build %s',
		async (version) => {
			getVersion.mockReturnValue(version);
			loadPolicy.mockResolvedValue({
				enabled: true,
				minimumVersion: '94-bbbbbbbb',
				recommendedVersion: '100-bbbbbbbb',
			});
			await main(['search', 'avatar']);
			expect(mockRun).toHaveBeenCalled();
			expect(stderr).not.toHaveBeenCalled();
		},
	);

	it('supports a warning-only policy before enough stable releases exist to require updates', async () => {
		loadPolicy.mockResolvedValue({ enabled: true, recommendedVersion: '100-bbbbbbbb' });
		await main(['search', 'avatar']);
		expect(mockRun).toHaveBeenCalled();
		expect(stderr).toHaveBeenCalledWith(expect.stringContaining('Warning:'));
	});

	it.each([{ enabled: false }, undefined])('permits commands with policy %j', async (policy) => {
		loadPolicy.mockResolvedValue(policy);
		await main(['search', 'avatar']);
		expect(mockRun).toHaveBeenCalled();
	});

	it.each([false, true])(
		'permits commands after an unexpected policy failure (JSON: %s)',
		async (json) => {
			loadPolicy.mockRejectedValue(new Error('policy initialization failed'));
			const argv = ['search', 'avatar', ...(json ? ['--json'] : [])];
			await main(argv);
			expect(mockRun).toHaveBeenCalledWith(argv, undefined, { invocation: 'atlas ads' });
			expect(process.exitCode).toBe(0);
			expect(stdout).not.toHaveBeenCalled();
			expect(stderr).not.toHaveBeenCalled();
		},
	);

	it('checks a batch only once before any child command runs', async () => {
		await main(['batch', '--command', 'search', 'avatar', '--json']);
		expect(loadPolicy).toHaveBeenCalledTimes(1);
		expect(mockRun).not.toHaveBeenCalled();
		expect(JSON.parse(stdout.mock.calls[0][0]).command).toBe('batch');
	});

	it.each([['--help'], ['search', '--help'], ['unknown'], []])(
		'keeps help and usage handling available: %j',
		async (...argv) => {
			await main(argv as string[]);
			expect(loadPolicy).not.toHaveBeenCalled();
			expect(mockRun).toHaveBeenCalled();
		},
	);

	it('reports the embedded Atlas release without querying the policy', async () => {
		await main(['--version']);
		expect(stdout).toHaveBeenCalledWith('99-aaaaaaaa');
		expect(loadPolicy).not.toHaveBeenCalled();
		expect(mockRun).not.toHaveBeenCalled();
	});

	it('leaves unversioned development builds usable without a policy request', async () => {
		getVersion.mockReturnValue(undefined);
		await main(['search', 'avatar']);
		expect(loadPolicy).not.toHaveBeenCalled();
		expect(mockRun).toHaveBeenCalled();
	});
});

describe('Atlas CLI entrypoint', () => {
	const originalExitCode = process.exitCode;

	afterEach(() => {
		process.exitCode = originalExitCode;
		jest.restoreAllMocks();
	});

	it('forwards Atlas arguments and propagates the returned exit code', async () => {
		mockRun.mockResolvedValue(3);

		await main(['search', 'missing', '--json']);

		expect(mockRun).toHaveBeenCalledWith(['search', 'missing', '--json'], undefined, {
			invocation: 'atlas ads',
		});
		expect(process.exitCode).toBe(3);
	});

	it('propagates numeric errors as exit codes', async () => {
		mockRun.mockRejectedValue(2);

		await main(['unknown']);

		expect(process.exitCode).toBe(2);
	});

	it('reports unexpected errors and exits with runtime error', async () => {
		const error = new Error('boom');
		const stderrWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
		mockRun.mockRejectedValue(error);

		await main(['search', 'avatar']);

		expect(stderrWrite).toHaveBeenCalledWith(expect.stringContaining('Error: boom'));
		expect(process.exitCode).toBe(1);
	});
});
