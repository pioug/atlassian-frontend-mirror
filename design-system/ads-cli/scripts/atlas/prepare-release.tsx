import { execFileSync } from 'node:child_process';
import {
	appendFileSync,
	chmodSync,
	copyFileSync,
	mkdirSync,
	readFileSync,
	statSync,
} from 'node:fs';
import path from 'node:path';

// eslint-disable-next-line import/no-extraneous-dependencies -- These CI scripts are not published.
import toml from '@iarna/toml';

import { parseManifest, variants } from './release-manifest';
import {
	getReleaseVersion,
	manifestPath,
	packageDir,
	runScript,
	writeChecksum,
} from './script-helpers';

export const prepareRelease = (): void => {
	const version = getReleaseVersion();
	const assertNewRelease = () => {
		if (
			parseManifest(readFileSync(manifestPath, 'utf8')).release.some(
				(entry) => entry.version === version,
			)
		) {
			throw new Error(`Release ${version} already exists in manifest.toml. Choose a new VERSION.`);
		}
	};
	assertNewRelease();
	const releaseRoot = path.join(packageDir, 'build/releases', version);
	mkdirSync(path.dirname(releaseRoot), { recursive: true });
	// Exclusive creation prevents retries from mixing old and new release artifacts.
	mkdirSync(releaseRoot);
	execFileSync('afm', ['run', 'package:atlas'], {
		cwd: packageDir,
		env: {
			...process.env,
			PKG_CACHE_PATH: process.env.PKG_CACHE_PATH ?? path.join(packageDir, 'build/pkg-cache'),
		},
		stdio: 'inherit',
	});
	for (const variant of variants) {
		const directory = path.join(releaseRoot, variant);
		mkdirSync(directory);
		const windows = variant === 'windows-amd64';
		const binaryName = windows ? 'ads.exe' : 'ads';
		const binary = path.join(directory, binaryName);
		copyFileSync(
			path.join(packageDir, 'build/atlas', `ads-${variant}${windows ? '.exe' : ''}`),
			binary,
		);
		if (!windows) chmodSync(binary, statSync(binary).mode | 0o111);
		const archive = `${variant}.tar.gz`;
		execFileSync('tar', ['-czf', archive, binaryName], { cwd: directory });
		writeChecksum(path.join(directory, archive), path.join(directory, `${archive}.sha256`));
	}
	if (process.platform === 'linux' && process.arch === 'x64') {
		execFileSync(
			path.join(releaseRoot, 'linux-amd64/ads'),
			['search', 'avatar', '--type', 'component', '--limit', '1'],
			{ stdio: ['ignore', 'ignore', 'inherit'] },
		);
		process.stdout.write('Smoke-tested the Linux AMD64 Atlas plugin binary.\n');
	}
	const packageVersion: unknown = JSON.parse(
		readFileSync(path.join(packageDir, 'package.json'), 'utf8'),
	).version;
	if (typeof packageVersion !== 'string') throw new Error('Expected an ADS CLI package version.');
	// Recheck after the build, before appending to the manifest.
	assertNewRelease();
	appendFileSync(
		manifestPath,
		`\n${toml.stringify({
			release: [
				{
					version,
					package_version: packageVersion,
					timestamp:
						process.env.RELEASE_TIMESTAMP ?? new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
					variants,
					channels: ['alpha'],
				},
			],
		})}`,
	);
	process.stdout.write(`Prepared ADS Atlas plugin release ${version} in ${releaseRoot}.\n`);
};

if (require.main === module) runScript(prepareRelease);
