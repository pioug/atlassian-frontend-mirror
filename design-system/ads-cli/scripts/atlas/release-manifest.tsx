import { execFileSync, type ExecFileSyncOptionsWithStringEncoding } from 'node:child_process';

// eslint-disable-next-line import/no-extraneous-dependencies -- These CI scripts are not published.
import toml from '@iarna/toml';

export type AtlasRelease = toml.JsonMap & {
	version: string;
	channels?: string[];
	variants?: string[];
	package_version?: string;
};
export type ReleaseManifest = toml.JsonMap & { name: string; release: AtlasRelease[] };
export type VersionPolicy = {
	enabled: boolean;
	minimumVersion?: string;
	recommendedVersion?: string;
};

const namespace = 'atlas-cli-plugin-ads';
export const variants: string[] = [
	'darwin-amd64',
	'darwin-arm64',
	'linux-amd64',
	'linux-arm64',
	'windows-amd64',
];

export const statlas = (
	args: string[],
	options: Omit<ExecFileSyncOptionsWithStringEncoding, 'encoding'> = {},
): string =>
	execFileSync('atlas', ['statlas', args[0], '--namespace', namespace, ...args.slice(1)], {
		encoding: 'utf8',
		timeout: 30000,
		maxBuffer: 1024 * 1024,
		stdio: ['ignore', 'pipe', 'inherit'],
		...options,
	});

export const releaseBuild = (version: unknown): number => {
	const match = typeof version === 'string' && /^(\d+)-[a-f\d]{8}$/i.exec(version);
	const build = match ? Number(match[1]) : NaN;
	if (!Number.isSafeInteger(build) || build <= 0) {
		throw new Error('Expected an exact Atlas release, such as 123-abcdef12.');
	}
	return build;
};

export const parseManifest = (source: string): ReleaseManifest => {
	const manifest = toml.parse(source);
	if (manifest.name !== 'ads' || !Array.isArray(manifest.release)) {
		throw new Error('Expected the ADS release manifest.');
	}
	return manifest as ReleaseManifest;
};

// Read the canonical object rather than the public proxy's cached copy.
export const readManifest = (): ReleaseManifest =>
	parseManifest(statlas(['get', '--subdirectory', 'manifest.toml']));

export const validateRelease = (
	manifest: ReleaseManifest,
	version: string,
	channel: string,
): void => {
	const matches = manifest.release.filter((entry) => entry.version === version);
	if (matches.length !== 1 || !matches[0].channels?.includes(channel)) {
		throw new Error(`${version} is not uniquely published on the ADS ${channel} channel.`);
	}
	if (!variants.every((variant) => matches[0].variants?.includes(variant))) {
		throw new Error('The release must support all five ADS Atlas platforms.');
	}
	for (const variant of variants) {
		for (const suffix of ['', '.sha256']) {
			const artifact = `releases/${version}/${variant}.tar.gz${suffix}`;
			// Statlas head exits zero even for HTTP errors; inspect the response status.
			const metadata = JSON.parse(statlas(['head', '--subdirectory', artifact, '--output=json']));
			if (metadata.statusCode !== 200) {
				throw new Error(`${artifact} is unavailable (HTTP ${metadata.statusCode}).`);
			}
		}
	}
};

export const readPolicy = (): VersionPolicy | undefined => {
	const metadata = JSON.parse(
		statlas(['head', '--subdirectory', 'version-policy.json', '--output=json']),
	);
	if (metadata.statusCode === 404) {
		return undefined;
	}
	if (metadata.statusCode !== 200) {
		throw new Error(`Cannot read the policy (HTTP ${metadata.statusCode}).`);
	}
	const policy = JSON.parse(statlas(['get', '--subdirectory', 'version-policy.json']));
	if (typeof policy?.enabled !== 'boolean') {
		throw new Error('Cannot replace an invalid version policy.');
	}
	if (policy.enabled) {
		if (!policy.minimumVersion && !policy.recommendedVersion) {
			throw new Error('An enabled policy needs a minimum or recommended version.');
		}
		if (policy.minimumVersion !== undefined) releaseBuild(policy.minimumVersion);
		if (policy.recommendedVersion !== undefined) releaseBuild(policy.recommendedVersion);
		if (
			policy.minimumVersion &&
			policy.recommendedVersion &&
			releaseBuild(policy.minimumVersion) > releaseBuild(policy.recommendedVersion)
		) {
			throw new Error('The recommended version cannot be below the minimum.');
		}
	}
	return policy;
};
