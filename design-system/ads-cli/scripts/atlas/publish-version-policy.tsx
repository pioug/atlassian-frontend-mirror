import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import {
	readManifest,
	readPolicy,
	releaseBuild,
	statlas,
	validateRelease,
	type VersionPolicy,
} from './release-manifest';

// AFM can execute from a separate checkout. Write review artifacts into Bitbucket's workspace.
const artifactRoot = process.env.BITBUCKET_CLONE_DIR_DEFAULT ?? process.env.BITBUCKET_CLONE_DIR;
const outputDir = artifactRoot
	? path.join(artifactRoot, 'platform/packages/design-system/ads-cli/build/atlas/version-policy')
	: path.resolve(__dirname, '../../build/atlas/version-policy');

const publish = () => {
	const args = process.argv.slice(2);
	if (args.some((arg) => arg !== '--dry-run')) {
		throw new Error('The only supported option is --dry-run.');
	}
	const dryRun = args.includes('--dry-run');
	if (!dryRun && process.env.BITBUCKET_BRANCH !== 'master') {
		throw new Error(
			'Publish policies only from the master custom pipeline. Use a dry run on branches.',
		);
	}
	const existing = readPolicy();
	const manifest = readManifest();
	// Count stable releases, not AFM build-number gaps. Warn at 1 behind; block at 7+.
	const versions = [
		...new Set(
			manifest.release
				.filter((entry) => entry.channels?.includes('stable'))
				.map((entry) => entry.version),
		),
	];
	versions.forEach(releaseBuild);
	versions.sort((a, b) => releaseBuild(b) - releaseBuild(a));
	if (versions.length === 0) {
		process.stdout.write('No stable releases; leaving the policy unchanged.\n');
		return;
	}
	const recommendedVersion = versions[0];
	// The seventh newest release is still supported: the next (7 behind) must upgrade.
	// With fewer than eight stable releases, only publish a warning threshold.
	const minimumVersion = versions.length >= 8 ? versions[6] : undefined;
	validateRelease(manifest, recommendedVersion, 'stable');
	if (minimumVersion) {
		validateRelease(manifest, minimumVersion, 'stable');
	}
	const policy: VersionPolicy = {
		enabled: true,
		...(minimumVersion ? { minimumVersion } : {}),
		recommendedVersion,
	};

	mkdirSync(outputDir, { recursive: true });
	const policyFile = path.resolve(outputDir, 'version-policy.json');
	writeFileSync(policyFile, `${JSON.stringify(policy, null, 2)}\n`);
	process.stdout.write(`Validated policy: ${JSON.stringify(policy)}\n`);
	if (dryRun) {
		process.stdout.write(`Dry run: no policy published. Review ${policyFile}.\n`);
		return;
	}
	if (
		existing?.enabled === policy.enabled &&
		existing?.minimumVersion === policy.minimumVersion &&
		existing?.recommendedVersion === policy.recommendedVersion
	) {
		process.stdout.write('The automatic policy is already current; no publication needed.\n');
		return;
	}
	// Omit --lifecycle deliberately: Statlas files are permanent by default.
	statlas(['put', '--file', 'version-policy.json', '--subdirectory', 'version-policy.json'], {
		cwd: path.dirname(policyFile),
	});
	const published = statlas(['get', '--subdirectory', 'version-policy.json']);
	writeFileSync(path.resolve(outputDir, 'published-policy.json'), published);
	const publishedPolicy = JSON.parse(published);
	const writtenPolicy = policy;
	if (
		publishedPolicy.enabled !== writtenPolicy.enabled ||
		publishedPolicy.minimumVersion !== writtenPolicy.minimumVersion ||
		publishedPolicy.recommendedVersion !== writtenPolicy.recommendedVersion
	) {
		throw new Error(
			'Policy readback differs from the requested policy. Check for concurrent publishers.',
		);
	}
	process.stdout.write(
		'Published and verified the ADS version policy. Allow for Statlas propagation and local caches.\n',
	);
};

try {
	publish();
} catch (error) {
	process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
	process.exitCode = 1;
}
