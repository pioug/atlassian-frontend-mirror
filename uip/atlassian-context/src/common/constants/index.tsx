export const FEDRAMP_MODERATE = 'fedramp-moderate';
export const COMMERCIAL = 'commercial';
export const FEDRAMP_FEDEX = 'fedramp-fedex';

export const STAGING = 'stg';
export const PRODUCTION = 'prod';
export const DEV = 'dev';

type EnvironmentType = typeof STAGING | typeof PRODUCTION | typeof DEV;

export type PerimeterType = typeof FEDRAMP_MODERATE | typeof COMMERCIAL | typeof FEDRAMP_FEDEX;

export const L2_PERIMETER_TYPES = new Set([COMMERCIAL]) as Set<PerimeterType>;

export type EnvironmentLookupResult = [EnvironmentType, PerimeterType];
