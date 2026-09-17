import fs from 'node:fs';
import path from 'node:path';

/**
 * Verifies an installed dependency without treating unresolved or workspace imports as external.
 */
export function isThirdPartyModule(filename: string, source: string): boolean {
	if (!path.isAbsolute(filename) || !/^(?:@[\w.-]+\/)?[\w-][\w.-]*(?:\/|$)/.test(source)) {
		return false;
	}
	const parts = source.split('/');
	if (parts.some((part) => part === '.' || part === '..')) {
		return false;
	}
	const packageName = parts.slice(0, source.startsWith('@') ? 2 : 1).join('/');
	let checkedOwner = false;
	for (let directory = path.dirname(filename); ; directory = path.dirname(directory)) {
		const ownerManifest = path.join(directory, 'package.json');
		if (!checkedOwner && fs.existsSync(ownerManifest)) {
			checkedOwner = true;
			try {
				const owner = JSON.parse(fs.readFileSync(ownerManifest, 'utf8'));
				const version =
					owner.dependencies?.[packageName] ??
					owner.devDependencies?.[packageName] ??
					owner.peerDependencies?.[packageName] ??
					owner.optionalDependencies?.[packageName];
				if (
					owner.name === packageName ||
					(typeof version === 'string' && /^(workspace|link|portal|file):/.test(version))
				) {
					return false;
				}
			} catch {
				return false;
			}
		}
		const manifest = path.join(directory, 'node_modules', packageName, 'package.json');
		if (fs.existsSync(manifest)) {
			try {
				const resolved = fs.realpathSync(manifest);
				const metadata = JSON.parse(fs.readFileSync(resolved, 'utf8'));
				return resolved.split(path.sep).includes('node_modules') && metadata.name === packageName;
			} catch {
				return false;
			}
		}
		if (path.dirname(directory) === directory) {
			return false;
		}
	}
}
