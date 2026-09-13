import { type DependencyType } from '../../types';

export type PopulateHistoricDataFlags = {
	cwd?: string;
	dev: boolean;
	dryRun: boolean;
	limit?: number;
	interactive: boolean;
	includeRestrictedScopes?: boolean;
};

export type DependencyMap = {
	[name: string]: {
		version: string;
		type: DependencyType;
	};
};

export type PackageChange = {
	deps: DependencyMap;
	date: string;
};
