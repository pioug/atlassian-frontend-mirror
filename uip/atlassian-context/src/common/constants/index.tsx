export const FEDRAMP_MODERATE = 'fedramp-moderate';
export const COMMERCIAL = 'commercial';
export const FEDRAMP_FEDEX = 'fedramp-fedex';

export const STAGING = 'stg';
export const PRODUCTION = 'prod';
export const DEV = 'dev';

type EnvironmentType = typeof STAGING | typeof PRODUCTION | typeof DEV;
type PerimeterType = typeof FEDRAMP_MODERATE | typeof COMMERCIAL | typeof FEDRAMP_FEDEX;

export type EnvironmentLookupResult = [EnvironmentType, PerimeterType];
