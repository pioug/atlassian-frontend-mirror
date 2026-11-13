import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

// eslint-disable-next-line import/no-extraneous-dependencies -- These CI scripts are not published.
import toml from '@iarna/toml';

import { fetchManifest } from './fetch-manifest';
import { parseManifest } from './release-manifest';
import { getReleaseVersion, manifestPath, publishManifest, runScript } from './script-helpers';

export const promoteStable = (): void => {
	const version = getReleaseVersion();
	fetchManifest();
	const manifest = parseManifest(readFileSync(manifestPath, 'utf8'));
	const matches = manifest.release.filter((entry) => entry.version === version);
	if (matches.length !== 1 || !Array.isArray(matches[0].channels)) {
		throw new Error(
			`Release ${version} must appear once with channels in the remote manifest. Upload it to alpha first.`,
		);
	}
	const release = matches[0];
	if (release.channels?.includes('stable')) {
		process.stdout.write(`Release ${version} is already on the stable channel.\n`);
		return;
	}
	release.channels?.push('stable');
	writeFileSync(manifestPath, toml.stringify(manifest));
	const directory = mkdtempSync(path.join(tmpdir(), 'ads-atlas-promote-'));
	try {
		publishManifest(directory);
	} finally {
		rmSync(directory, { recursive: true, force: true });
	}
	process.stdout.write(`Promoted ADS Atlas plugin release ${version} to the stable channel.\n`);
};

if (require.main === module) runScript(promoteStable);
