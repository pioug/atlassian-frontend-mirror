export const FEDRAMP_MODERATE = 'fedramp-moderate';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const COMMERCIAL = 'commercial';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const FEDRAMP_FEDEX = 'fedramp-fedex';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const STAGING = 'stg';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const PRODUCTION = 'prod';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const DEV = 'dev';

export type EnvironmentType = typeof STAGING | typeof PRODUCTION | typeof DEV;
type PerimeterType = typeof FEDRAMP_MODERATE | typeof COMMERCIAL | typeof FEDRAMP_FEDEX;
export type EnvironmentLookupResult = [EnvironmentType, PerimeterType];
