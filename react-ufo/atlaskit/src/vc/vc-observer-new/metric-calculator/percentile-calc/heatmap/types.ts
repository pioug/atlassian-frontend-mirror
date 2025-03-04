import type { VCObserverEntryType } from '../../../types';
/**
 * Represents a rectangular area in the heatmap.
 */
export type HeatmapRect = {
	left: number;
	top: number;
	right: number;
	bottom: number;
};

export type HeatmapSource =
	| VCObserverEntryType
	| 'mutation:parent-mounted'
	| 'mutation:node-replacement';

export type HeatmapEntryData = {
	time: DOMHighResTimeStamp;
	elementName: string | null;
	rect: HeatmapRect | null;
	source: HeatmapSource | null;
	ratio: number | null;
};
export type HeatmapEntry = {
	head: HeatmapEntryData | null;
	previousEntries: Array<HeatmapEntryData>;
};

export type Viewport = {
	width: number;
	height: number;
};

export type HeatmapOptions = {
	viewport: Viewport;
	heatmapSize: number;
};

export type DOMSelector = string;
export type HeatmapCheckpointMetrics = {
	[checkpoint: string]: {
		/**
		 * Time when this checkpoint reached
		 */
		t: DOMHighResTimeStamp;
		/**
		 * A collection of DOM Selector that are part of the checkpoint
		 */
		e: DOMSelector[];
	};
};
