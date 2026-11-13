import { parseAtlasReleaseBuild } from './parse-atlas-release-build';

export const isAtlasReleaseOutdated = (
	installed: string | undefined,
	minimum: string | undefined,
): boolean => {
	const installedBuild = parseAtlasReleaseBuild(installed);
	const minimumBuild = parseAtlasReleaseBuild(minimum);
	// Compare valid build numbers for either threshold; unknown versions remain usable.
	return (
		installedBuild !== undefined && minimumBuild !== undefined && installedBuild < minimumBuild
	);
};
