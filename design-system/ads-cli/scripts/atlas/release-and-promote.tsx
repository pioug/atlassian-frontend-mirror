import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { readManifest, releaseBuild, validateRelease } from './release-manifest';

const updatePolicy = (env: NodeJS.ProcessEnv): void => {
	execFileSync('run-ts', [path.join(__dirname, 'publish-version-policy.tsx')], {
		stdio: 'inherit',
		env,
	});
};

const release = (): void => {
	if (process.env.BITBUCKET_BRANCH !== 'master') {
		throw new Error('Run the ADS release pipeline from master.');
	}
	const build = process.env.BITBUCKET_BUILD_NUMBER ?? '';
	const commit = process.env.BITBUCKET_COMMIT ?? '';
	if (!/^\d+$/.test(build) || !/^[a-f\d]{40}$/i.test(commit)) {
		throw new Error('Expected a Bitbucket build number and full commit SHA.');
	}
	const version = `${build}-${commit.slice(0, 8)}`;
	releaseBuild(version);
	const env = { ...process.env, VERSION: version };
	const run = (script: string) => execFileSync('afm', ['run', script], { env, stdio: 'inherit' });
	let manifest = readManifest();
	const packageVersion = JSON.parse(
		readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'),
	).version;
	if (typeof packageVersion !== 'string' || !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(packageVersion)) {
		throw new Error('Expected a valid ADS CLI package version.');
	}
	const existing = manifest.release.find((entry) => entry.version === version);
	if (
		!existing?.channels?.includes('stable') &&
		manifest.release.some(
			(entry) =>
				entry.channels?.includes('stable') && releaseBuild(entry.version) >= releaseBuild(version),
		)
	) {
		throw new Error(
			'A newer or equal build is already stable; do not promote an older pipeline run.',
		);
	}
	const latestStable = manifest.release
		.filter((entry) => entry.channels?.includes('stable'))
		.sort((a, b) => releaseBuild(b.version) - releaseBuild(a.version))[0];
	if (!existing?.channels?.includes('stable') && latestStable?.package_version === packageVersion) {
		process.stdout.write(
			`ADS CLI ${packageVersion} is already released; skipping build, upload and promotion.\n`,
		);
		updatePolicy(env);
		return;
	}
	// Legacy manifest entries lack package_version; one release establishes the baseline.
	if (!existing) {
		const validationOptions = {
			env,
			stdio: 'inherit' as const,
			cwd: path.resolve(__dirname, '../../../../../'),
		};
		execFileSync(
			'afm',
			['test', 'unit', 'packages/design-system/ads-cli/src/__tests__', '--run-in-band'],
			validationOptions,
		);
		execFileSync(
			'afm',
			['ts', 'check', '--project', 'packages/design-system/ads-cli/tsconfig.app.json'],
			validationOptions,
		);
		// Upload packages all five platforms, smoke-tests the Linux binary, then publishes alpha.
		run('release:atlas:upload');
		manifest = readManifest();
	}
	if (
		manifest.release.find((entry) => entry.version === version)?.package_version !== packageVersion
	) {
		throw new Error('The release did not record the expected ADS CLI package version.');
	}
	if (!existing?.channels?.includes('stable')) {
		validateRelease(manifest, version, 'alpha');
		run('release:atlas:promote');
		manifest = readManifest();
	}
	// On retries, resume at the first unfinished stage. Never move the minimum before stable exists.
	validateRelease(manifest, version, 'stable');
	if (
		manifest.release.find((entry) => entry.version === version)?.package_version !== packageVersion
	) {
		throw new Error('The stable release did not record the expected ADS CLI package version.');
	}
	updatePolicy(env);
	process.stdout.write(`Released ADS ${version} on stable and checked the automatic minimum.\n`);
};

try {
	release();
} catch (error) {
	process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
	process.exitCode = 1;
}
