export const FEDRAMP_MODERATE = 'fedramp-moderate';
export const COMMERCIAL = 'commercial';
export const FEDRAMP_FEDEX = 'fedramp-fedex';

export const STAGING = 'stg';
export const PRODUCTION = 'prod';
export const DEV = 'dev';

export type EnvironmentType = typeof STAGING | typeof PRODUCTION | typeof DEV;
type PerimeterType = typeof FEDRAMP_MODERATE | typeof COMMERCIAL | typeof FEDRAMP_FEDEX;
export type EnvironmentLookupResult = [EnvironmentType, PerimeterType];

export const ISOLATED_CLOUD_PERIMETERS = [COMMERCIAL] as const;
export type IsolatedCloudPerimeterType = (typeof ISOLATED_CLOUD_PERIMETERS)[number];

export const NON_ISOLATED_CLOUD_PERIMETERS = [COMMERCIAL, FEDRAMP_MODERATE] as const;
export type NonIsolatedCloudPerimeterType = (typeof NON_ISOLATED_CLOUD_PERIMETERS)[number];

export type GeneralizedPerimeterType = IsolatedCloudPerimeterType | NonIsolatedCloudPerimeterType;
