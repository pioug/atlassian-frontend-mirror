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

export type ImportMetadata = {
	name: string;
	package: string;
	type: 'default' | 'named';
	packagePath: string;
	packageJson: {
		name: string;
		version: string;
		atlassian: {
			team: string;
		} & Record<string, unknown>;
		exports: unknown;
	} & Record<string, unknown>;
};
