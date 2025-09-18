export const FEDRAMP_MODERATE = 'fedramp-moderate';
export const COMMERCIAL = 'commercial';

export const STAGING = 'staging';
export const PRODUCTION = 'prod';
export const DEV = 'dev';

export type EnvironmentType = typeof STAGING | typeof PRODUCTION | typeof DEV;

export const ISOLATED_CLOUD_PERIMETERS = [COMMERCIAL] as const;
export type IsolatedCloudPerimeterType = (typeof ISOLATED_CLOUD_PERIMETERS)[number];

export const NON_ISOLATED_CLOUD_PERIMETERS = [COMMERCIAL, FEDRAMP_MODERATE] as const;
export type NonIsolatedCloudPerimeterType = (typeof NON_ISOLATED_CLOUD_PERIMETERS)[number];

export type GeneralizedPerimeterType = IsolatedCloudPerimeterType | NonIsolatedCloudPerimeterType;

export type CloudEnvironment =
	| {
			type: 'isolated-cloud';
			perimeter: IsolatedCloudPerimeterType;
	  }
	| {
			type: 'non-isolated-cloud';
			perimeter: NonIsolatedCloudPerimeterType;
	  };

export const ATL_CTX_PERIMETER = 'Atl-Ctx-Perimeter';
export const ATL_CTX_ISOLATION_CONTEXT_DOMAIN = 'Atl-Ctx-Isolation-Context-Domain';
export const ATL_CTX_ISOLATION_CONTEXT_ID = 'Atl-Ctx-Isolation-Context-Id';

export type AtlCtxCookieName =
	| typeof ATL_CTX_PERIMETER
	| typeof ATL_CTX_ISOLATION_CONTEXT_DOMAIN
	| typeof ATL_CTX_ISOLATION_CONTEXT_ID;
