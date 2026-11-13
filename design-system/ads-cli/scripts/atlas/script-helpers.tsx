import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { statlas } from './release-manifest';

export const packageDir: string = path.resolve(__dirname, '../..');
export const manifestPath: string = path.join(packageDir, 'manifest.toml');

export const runScript = (action: () => void | Promise<unknown>): void => {
	Promise.resolve()
		.then(action)
		.catch((error: unknown) => {
			process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
			process.exitCode = 1;
		});
};

export const getReleaseVersion = (): string => {
	const version = process.env.VERSION;
	if (!version) throw new Error('Set VERSION before preparing, uploading or promoting a release.');
	if (!/^[0-9A-Za-z][0-9A-Za-z._+-]*$/.test(version)) {
		throw new Error(
			'Use only letters, numbers, dots, underscores, plus signs, and hyphens in VERSION.',
		);
	}
	return version;
};

export const writeChecksum = (file: string, checksumFile: string): void => {
	const hash = createHash('sha256').update(readFileSync(file)).digest('hex');
	writeFileSync(checksumFile, `${hash}  ${path.basename(file)}\n`);
};

export const publishManifest = (directory: string): void => {
	writeChecksum(manifestPath, path.join(directory, 'manifest.toml.sha256'));
	const bundle = path.join(directory, 'manifest');
	execFileSync('tar', [
		'-czf',
		bundle,
		'-C',
		packageDir,
		'manifest.toml',
		'-C',
		directory,
		'manifest.toml.sha256',
	]);
	// Publish the manifest last, after every archive and checksum is available.
	statlas(['post', '--file', bundle]);
};
