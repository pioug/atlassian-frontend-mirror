import { mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { parseManifest, statlas } from './release-manifest';
import { manifestPath, packageDir, runScript } from './script-helpers';

export const fetchManifest = (): void => {
	const source = statlas(['get', '--subdirectory', 'manifest.toml']);
	parseManifest(source);
	const buildDir = path.join(packageDir, 'build/atlas');
	mkdirSync(buildDir, { recursive: true });
	const directory = mkdtempSync(path.join(buildDir, 'manifest-'));
	try {
		const temporaryManifest = path.join(directory, 'manifest.toml');
		writeFileSync(temporaryManifest, source);
		renameSync(temporaryManifest, manifestPath);
	} finally {
		rmSync(directory, { recursive: true, force: true });
	}
	process.stdout.write('Fetched the ADS Atlas plugin manifest from atlas-cli-plugin-ads.\n');
};

if (require.main === module) runScript(fetchManifest);
