import simpleGit from 'simple-git';
import { ValidationError, type ParsedPkg } from './types';

const packageRegex = /"(@(?:atlaskit|atlassian|atlassiansox)\/.*)": "(.*)"/;

type DiffEntry = {
	type: 'deleted' | 'added';
	name: string;
	version: string;
};

const parseDiffLine = (line: string): DiffEntry | null => {
	const type = line.startsWith('-') ? 'deleted' : line.startsWith('+') ? 'added' : null;

	const match = line.match(packageRegex);

	if (!type || !match) {
		return null;
	}

	return {
		type,
		name: match[1],
		version: match[2],
	};
};

/** Returns packages that have been upgraded in package.json since ref. The version refers to their previous
 * version
 */
export const getPackagesSinceRef = async (ref: string): Promise<ParsedPkg[]> => {
	const git = simpleGit();
	let commit: string;
	try {
		commit = await git.revparse(['--verify', ref]);
	} catch (e) {
		throw new ValidationError(`Invalid git ref "${ref}"`);
	}

	const diff = await git.diff([commit, '--', 'package.json']);
	const modifiedPackages = diff
		.split('\n')
		.map(parseDiffLine)
		.filter((pkg): pkg is DiffEntry => Boolean(pkg));

	const addedPackages = new Map(
		modifiedPackages.filter((pkg) => pkg.type === 'added').map((pkg) => [pkg.name, pkg]),
	);

	/* This is holds the previous version of packages that have been upgraded. Packages are treated as
	 * upgraded if they have both an addition/deletion entry in the diff and their versions differ
	 */
	const upgradedPackages = modifiedPackages
		.filter((pkg) => {
			const addedEntry = addedPackages.get(pkg.name);
			if (pkg.type !== 'deleted' || !addedEntry) {
				return false;
			}
			return pkg.version !== addedEntry.version;
		})
		.map(({ name, version }) => ({ name, version }));

	return upgradedPackages;
};

if (require.main === module) {
	// eslint-disable-next-line no-console
	getPackagesSinceRef(process.argv[2]).then((res) => console.log(res));
}
