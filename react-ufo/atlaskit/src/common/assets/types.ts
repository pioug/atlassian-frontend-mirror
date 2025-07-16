import type { ResourceEntry } from '../../resource-timing/common/types';

export type AssetsConfigAllAtlassianArgs = {
	entry: ResourceEntry;
};

export type AssetsConfigPreloadedArgs = {
	entry: ResourceEntry;
	SSRDoneTime?: number;
};

export type AssetsConfig = {
	allowedTypes?: string[];
	classification: {
		all: boolean;
		allAtlassian: (args: AssetsConfigAllAtlassianArgs) => boolean;
		preloaded: (args: AssetsConfigPreloadedArgs) => boolean;
	};
};

export type AssetsReporter = {
	size: number | null; // null if not available // encodedSize <-> encodedSize == decodedSize
	chr: number | null; // null if not available -> based on size
	count: number;
};

export interface AssetsData {
	[key: string]: AssetsReporter;
}
