/**
 * ADS releases use <Bitbucket build number>-<8-character commit SHA>. The build number
 * increases with each pipeline run; the SHA identifies the source but does not affect ordering.
 */
export const parseAtlasReleaseBuild = (version: unknown): number | undefined => {
	if (typeof version !== 'string') {
		return undefined;
	}
	const match = /^(\d+)-[a-f\d]{8}$/i.exec(version);
	const build = match ? Number(match[1]) : NaN;
	return Number.isSafeInteger(build) && build > 0 ? build : undefined;
};
