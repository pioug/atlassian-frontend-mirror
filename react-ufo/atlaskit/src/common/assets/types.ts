import type { ResourceTiming } from '../../resource-timing';

export type AssetResourceEntry = { label: string; entry: ResourceTiming };
export type AssetsClassification = {
	all: boolean;
	allAtlassian: (entry: AssetResourceEntry) => boolean;
	preloaded: (entry: AssetResourceEntry) => boolean;
};

export type AssetsReporter = {
	size: number | null; // null if not available // encodedSize <-> encodedSize == decodedSize
	chr: number | null; // null if not available -> based on size
	count: number;
};

export interface AssetsData {
	[key: string]: AssetsReporter;
}
