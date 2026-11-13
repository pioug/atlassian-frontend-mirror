declare const __ADS_ATLAS_RELEASE_VERSION__: string;

export const getAtlasReleaseVersion = (): string | undefined =>
	typeof __ADS_ATLAS_RELEASE_VERSION__ === 'string' && __ADS_ATLAS_RELEASE_VERSION__ !== ''
		? __ADS_ATLAS_RELEASE_VERSION__
		: undefined;
