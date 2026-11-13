import { EventEmitter } from 'events';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import { get } from 'https';
import { tmpdir } from 'os';
import path from 'path';

import { Cache } from 'file-system-cache';

import { fetchAtlasVersionPolicy } from '../fetch-atlas-version-policy';
import * as versionPolicyFetch from '../fetch-atlas-version-policy';
import { getAtlasVersionPolicy } from '../get-atlas-version-policy';
import { isAtlasReleaseOutdated } from '../is-atlas-release-outdated';

jest.mock('https', () => ({ get: jest.fn() }));

const mockGet = get as jest.Mock;

describe('Atlas release comparison', () => {
	it.each([
		['99-aaaaaaaa', '100-bbbbbbbb', true],
		['100-aaaaaaaa', '100-aaaaaaaa', false],
		['101-aaaaaaaa', '100-bbbbbbbb', false],
		['local-aaaaaaaa', '100-bbbbbbbb', false],
		[undefined, '100-bbbbbbbb', false],
		['99-aaaaaaaa', 'invalid', false],
		['9007199254740992-aaaaaaaa', '100-bbbbbbbb', false],
	])('compares %s against %s by numeric build number', (installed, minimum, outdated) => {
		expect(isAtlasReleaseOutdated(installed, minimum)).toBe(outdated);
	});
});

describe('Atlas version policy cache', () => {
	const originalAtlasCache = process.env.ATLAS_CACHE;
	const now = 1000000;
	let cacheRoot: string;
	let cacheDir: string;
	let cache: Cache;
	let fetchPolicy: jest.SpyInstance;
	const policy = { enabled: true, minimumVersion: '100-aaaaaaaa' };

	beforeEach(async () => {
		cacheRoot = await mkdtemp(path.join(tmpdir(), 'ads-version-policy-'));
		process.env.ATLAS_CACHE = cacheRoot;
		cacheDir = path.join(cacheRoot, 'ads');
		await mkdir(cacheDir);
		jest.useFakeTimers({ now });
		cache = new Cache({ basePath: cacheDir });
		fetchPolicy = jest
			.spyOn(versionPolicyFetch, 'fetchAtlasVersionPolicy')
			.mockResolvedValue(policy);
	});

	afterEach(async () => {
		jest.useRealTimers();
		jest.restoreAllMocks();
		if (originalAtlasCache === undefined) {
			delete process.env.ATLAS_CACHE;
		} else {
			process.env.ATLAS_CACHE = originalAtlasCache;
		}
		await rm(cacheRoot, { recursive: true, force: true });
	});

	it('shares a successful check across invocations and refreshes it after 24 hours', async () => {
		expect(await getAtlasVersionPolicy()).toEqual(policy);
		expect(await getAtlasVersionPolicy()).toEqual(policy);
		expect(fetchPolicy).toHaveBeenCalledTimes(1);
		jest.advanceTimersByTime(5 * 60 * 1000);
		expect(await getAtlasVersionPolicy()).toEqual(policy);
		expect(fetchPolicy).toHaveBeenCalledTimes(1);
		jest.advanceTimersByTime((24 * 60 * 60 - 5 * 60) * 1000 + 1);
		fetchPolicy.mockResolvedValue({ enabled: false });
		expect(await getAtlasVersionPolicy()).toEqual({ enabled: false });
		expect(fetchPolicy).toHaveBeenCalledTimes(2);
	});

	it.each([
		null,
		{},
		{ enabled: true },
		{ enabled: 'true', minimumVersion: '100-aaaaaaaa' },
		{ enabled: true, minimumVersion: 'latest' },
		{ enabled: true, recommendedVersion: 'latest' },
		{ enabled: true, minimumVersion: '100-aaaaaaaa', recommendedVersion: 'invalid' },
		{ enabled: true, minimumVersion: '100-aaaaaaaa', recommendedVersion: '99-bbbbbbbb' },
	])('fails open for invalid remote configuration: %j', async (invalid) => {
		fetchPolicy.mockResolvedValue(invalid);
		expect(await getAtlasVersionPolicy()).toBeUndefined();
		expect(await getAtlasVersionPolicy()).toBeUndefined();
		expect(fetchPolicy).toHaveBeenCalledTimes(1);
	});

	it('caches both warning and minimum thresholds without changing the policy', async () => {
		const thresholds = { ...policy, recommendedVersion: '200-bbbbbbbb' };
		fetchPolicy.mockResolvedValue(thresholds);
		expect(await getAtlasVersionPolicy()).toEqual(thresholds);
		expect(await getAtlasVersionPolicy()).toEqual(thresholds);
		expect(fetchPolicy).toHaveBeenCalledTimes(1);
	});

	it('accepts a warning-only policy while there are too few stable releases to block', async () => {
		fetchPolicy.mockResolvedValue({ enabled: true, recommendedVersion: '200-bbbbbbbb' });
		expect(await getAtlasVersionPolicy()).toEqual({
			enabled: true,
			recommendedVersion: '200-bbbbbbbb',
		});
	});

	it('fails open on network failure and backs off before retrying', async () => {
		fetchPolicy.mockRejectedValue(new Error('offline'));
		expect(await getAtlasVersionPolicy()).toBeUndefined();
		expect(await getAtlasVersionPolicy()).toBeUndefined();
		expect(fetchPolicy).toHaveBeenCalledTimes(1);
		jest.advanceTimersByTime(24 * 60 * 60 * 1000 + 1);
		fetchPolicy.mockResolvedValue(policy);
		expect(await getAtlasVersionPolicy()).toEqual(policy);
	});

	it('does not enforce an expired policy when refresh fails', async () => {
		await getAtlasVersionPolicy();
		jest.advanceTimersByTime(24 * 60 * 60 * 1000 + 1);
		fetchPolicy.mockRejectedValue(new Error('offline'));
		expect(await getAtlasVersionPolicy()).toBeUndefined();
	});

	it('keeps enforcing a valid unexpired cached minimum without a network check', async () => {
		await getAtlasVersionPolicy();
		fetchPolicy.mockRejectedValue(new Error('offline'));
		jest.advanceTimersByTime(24 * 60 * 60 * 1000 - 1);
		expect(await getAtlasVersionPolicy()).toEqual(policy);
		expect(fetchPolicy).toHaveBeenCalledTimes(1);
	});

	it('fails open when both the cache and the network are unavailable', async () => {
		await rm(cacheDir, { recursive: true });
		await writeFile(cacheDir, 'unchanged');
		fetchPolicy.mockRejectedValue(new Error('offline'));
		expect(await getAtlasVersionPolicy()).toBeUndefined();
		expect(await readFile(cacheDir, 'utf8')).toBe('unchanged');
	});

	it('fails open when a corrupt cache cannot be refreshed', async () => {
		await writeFile(cache.path('version-policy'), '{broken');
		fetchPolicy.mockRejectedValue(new Error('offline'));
		expect(await getAtlasVersionPolicy()).toBeUndefined();
	});

	it('refreshes corrupt and future-dated caches', async () => {
		await writeFile(cache.path('version-policy'), '{broken');
		expect(await getAtlasVersionPolicy()).toEqual(policy);
		jest.setSystemTime(now - 1);
		expect(await getAtlasVersionPolicy()).toEqual(policy);
		expect(fetchPolicy).toHaveBeenCalledTimes(2);
	});

	it('refreshes a cache entry containing an invalid policy', async () => {
		await cache.set('version-policy', {
			checkedAt: now,
			policy: { enabled: true, minimumVersion: 'invalid' },
		});
		expect(await getAtlasVersionPolicy()).toEqual(policy);
		expect(fetchPolicy).toHaveBeenCalledTimes(1);
	});

	it('keeps concurrent invocations usable', async () => {
		expect(
			await Promise.all([
				getAtlasVersionPolicy(),
				getAtlasVersionPolicy(),
				getAtlasVersionPolicy(),
			]),
		).toEqual([policy, policy, policy]);
		expect(await getAtlasVersionPolicy()).toEqual(policy);
	});

	it('can enforce a fetched policy when the cache cannot be written', async () => {
		await rm(cacheDir, { recursive: true });
		await writeFile(cacheDir, 'unchanged');
		expect(await getAtlasVersionPolicy()).toEqual(policy);
		expect(await readFile(cacheDir, 'utf8')).toBe('unchanged');
	});
});

describe('Atlas version policy HTTP read', () => {
	let request: EventEmitter & { destroy: jest.Mock };
	let response: EventEmitter & { statusCode: number; setEncoding: jest.Mock; destroy: jest.Mock };

	beforeEach(() => {
		jest.useFakeTimers();
		request = Object.assign(new EventEmitter(), { destroy: jest.fn() });
		response = Object.assign(new EventEmitter(), {
			statusCode: 200,
			setEncoding: jest.fn(),
			destroy: jest.fn(),
		});
		mockGet.mockImplementation((_url, _options, receive) => {
			receive(response);
			return request;
		});
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	it('reads JSON from the fixed ADS Statlas policy URL', async () => {
		const result = fetchAtlasVersionPolicy();
		response.emit('data', '{"enabled":false}');
		response.emit('end');
		expect(await result).toEqual({ enabled: false });
		expect(mockGet.mock.calls[0][0]).toBe(
			'https://statlas.prod.atl-paas.net/atlas-cli-plugin-ads/version-policy.json',
		);
		expect(mockGet.mock.calls[0][1].headers).toEqual({
			Accept: 'application/json',
			Pragma: 'no-cache',
		});
	});

	it.each([301, 401, 403, 404, 429, 500, 503])('fails open for HTTP %s', async (status) => {
		response.statusCode = status;
		expect(await fetchAtlasVersionPolicy()).toBeUndefined();
		expect(response.destroy).toHaveBeenCalled();
	});

	it('fails open when the response stream errors', async () => {
		const result = fetchAtlasVersionPolicy();
		response.emit('data', '{"enabled":');
		response.emit('error', new Error('connection reset'));
		expect(await result).toBeUndefined();
	});

	it('fails open for invalid JSON', async () => {
		const result = fetchAtlasVersionPolicy();
		response.emit('data', '<html>not JSON</html>');
		response.emit('end');
		expect(await result).toBeUndefined();
	});

	it('bounds the size and duration of a policy request', async () => {
		let result = fetchAtlasVersionPolicy();
		response.emit('data', 'x'.repeat(16 * 1024 + 1));
		expect(await result).toBeUndefined();
		expect(request.destroy).toHaveBeenCalled();
		result = fetchAtlasVersionPolicy();
		jest.advanceTimersByTime(1500);
		expect(await result).toBeUndefined();
		expect(request.destroy).toHaveBeenCalledTimes(2);
	});

	it('fails open when the request errors or cannot start', async () => {
		const result = fetchAtlasVersionPolicy();
		request.emit('error', new Error('offline'));
		expect(await result).toBeUndefined();
		mockGet.mockImplementation(() => {
			throw new Error('cannot start');
		});
		expect(await fetchAtlasVersionPolicy()).toBeUndefined();
	});
});
