/* eslint-disable @repo/internal/react/boolean-prop-naming-convention -- not our types */
export type Status =
	| 'release-candidate'
	| 'early-access'
	| 'open-beta'
	| 'general-availability'
	| 'intent-to-deprecate'
	| 'deprecated'
	| 'unmaintained';

export type DocsParameter = {
	name: string;
	type: string;
	description?: string;
	defaultValue?: string;
	isOptional?: boolean;
};

export type DocsReturns = {
	type: string;
	description?: string;
};
