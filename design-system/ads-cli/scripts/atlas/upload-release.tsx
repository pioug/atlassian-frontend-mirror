import path from 'node:path';

import { fetchManifest } from './fetch-manifest';
import { prepareRelease } from './prepare-release';
import { statlas, variants } from './release-manifest';
import { getReleaseVersion, packageDir, publishManifest, runScript } from './script-helpers';

export const uploadRelease = (): void => {
	const version = getReleaseVersion();
	fetchManifest();
	prepareRelease();
	const releaseRoot = path.join(packageDir, 'build/releases', version);
	for (const variant of variants) {
		for (const suffix of ['', '.sha256']) {
			statlas(
				['put', '--file', `${variant}.tar.gz${suffix}`, '--subdirectory', `releases/${version}/`],
				{ cwd: path.join(releaseRoot, variant), timeout: 300000 },
			);
		}
		process.stdout.write(`Uploaded ${variant} artifacts for release ${version}.\n`);
	}
	publishManifest(releaseRoot);
	process.stdout.write(`Published ADS Atlas plugin release ${version} to the alpha channel.\n`);
};

if (require.main === module) runScript(uploadRelease);
