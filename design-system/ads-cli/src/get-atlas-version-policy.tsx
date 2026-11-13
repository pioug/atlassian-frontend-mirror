import { mkdir } from 'fs/promises';
import { homedir } from 'os';
import path from 'path';

import { Cache } from 'file-system-cache';

import { fetchAtlasVersionPolicy } from './fetch-atlas-version-policy';
import { parseAtlasReleaseBuild } from './parse-atlas-release-build';

const CACHE_TTL_SECONDS = 24 * 60 * 60;
const CACHE_KEY = 'version-policy';

export type AtlasVersionPolicy = {
	enabled: boolean;
	minimumVersion?: string;
	recommendedVersion?: string;
};

const parsePolicy = (value: unknown): AtlasVersionPolicy | undefined => {
	if (typeof value !== 'object' || value === null || !('enabled' in value)) {
		return undefined;
	}
	if (value.enabled === false) {
		return { enabled: false };
	}
	const minimumVersion = 'minimumVersion' in value ? value.minimumVersion : undefined;
	const recommendedVersion = 'recommendedVersion' in value ? value.recommendedVersion : undefined;
	const minimumBuild = parseAtlasReleaseBuild(minimumVersion);
	const recommendedBuild = parseAtlasReleaseBuild(recommendedVersion);
	if (
		value.enabled === true &&
		(minimumVersion !== undefined || recommendedVersion !== undefined) &&
		(minimumVersion === undefined || minimumBuild !== undefined) &&
		(recommendedVersion === undefined || recommendedBuild !== undefined) &&
		(minimumBuild === undefined ||
			recommendedBuild === undefined ||
			minimumBuild <= recommendedBuild)
	) {
		return {
			enabled: true,
			...(minimumVersion !== undefined ? { minimumVersion: minimumVersion as string } : {}),
			...(recommendedVersion !== undefined
				? { recommendedVersion: recommendedVersion as string }
				: {}),
		};
	}
	return undefined;
};

/**
 * Share a 24-hour policy cache across Atlas invocations, including disabled and failed checks.
 */
export const getAtlasVersionPolicy = async (): Promise<AtlasVersionPolicy | undefined> => {
	const cacheDir = path.join(
		process.env.ATLAS_CACHE || path.join(homedir(), '.cache/atlassian/atlas'),
		'ads',
	);
	// eslint-disable-next-line @repo/internal/react/disallow-unstable-values -- This is a Node CLI cache clock, not React render data.
	const checkedAt = Date.now();
	let cache: Cache | undefined;
	try {
		cache = new Cache({ basePath: cacheDir, ttl: CACHE_TTL_SECONDS });
		const cached = (await cache.get(CACHE_KEY)) as
			| {
					checkedAt?: unknown;
					policy?: unknown;
			  }
			| undefined;
		// The library handles expiry; reject future-dated entries if the machine's clock moves back.
		if (typeof cached?.checkedAt === 'number' && checkedAt >= cached.checkedAt) {
			if (cached.policy === null) {
				return undefined;
			}
			const policy = parsePolicy(cached.policy);
			if (policy) {
				return policy;
			}
		}
	} catch {
		// Unreadable or partial concurrent writes are cache misses, so try a fresh check.
	}

	let policy: AtlasVersionPolicy | undefined;
	try {
		policy = parsePolicy(await fetchAtlasVersionPolicy());
	} catch {
		// Match devenv's fail-open behavior when remote configuration is unavailable.
	}
	try {
		if (cache) {
			// Owner-only access to the directory (chmod 700) protects the library-managed files.
			await mkdir(cacheDir, { recursive: true, mode: 0o700 });
			await cache.set(CACHE_KEY, { checkedAt, policy: policy ?? null });
		}
	} catch {
		// The policy still works when a machine's cache is read-only.
	}
	return policy;
};
