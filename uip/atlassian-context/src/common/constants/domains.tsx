import {
	type COMMERCIAL,
	type DEV,
	type FEDRAMP_MODERATE,
	type PRODUCTION,
	type STAGING,
} from './index';

export type DomainConfig = {
	[COMMERCIAL]: RequiredDomainEnvironment;
	[FEDRAMP_MODERATE]?: DomainEnvironment;
};
export type DomainEnvironment = {
	[STAGING]?: string;
	[PRODUCTION]?: string;
	[DEV]?: string;
};
export type RequiredDomainEnvironment = {
	[PRODUCTION]: string;
} & DomainEnvironment;
