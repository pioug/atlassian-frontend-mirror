import readPkgUp from 'read-pkg-up';

import type { TeamInfo } from '../types';

/**
 * Looks for the closest package.json and gets team and package information from it.
 *
 * @param {string} filePath
 * @returns {Promise<AtlassianTeamInfo>}
 */
export const getTeamInfo = async (filePath: string): Promise<TeamInfo> => {
	const pkgJson = await readPkgUp({ cwd: filePath });

	if (!pkgJson || !pkgJson.packageJson) {
		throw new Error(`Closest package.json file could not be found or is invalid for ${filePath}.`);
	}

	const packageName = pkgJson.packageJson.name || '';
	const teamName = pkgJson.packageJson.atlassian?.team || '';

	return {
		packageName,
		teamName,
	};
};
