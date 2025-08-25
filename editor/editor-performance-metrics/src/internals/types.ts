export type HeatmapEntrySource =
	| 'layout-shift'
	| 'layout-shift:element-moved'
	| 'mutation'
	| 'mutation:root-element'
	| 'mutation:children-element'
	| 'mutation:parent-mounted'
	| 'mutation:attribute'
	| 'mutation:re-mounted'
	| 'mutation:attribute:no-layout-shift'
	| 'mutation:node-replacement';

export type ViewportDimension = {
	h: number;
	w: number;
};

export type UserEventCategory =
	| 'mouse-movement'
	| 'mouse-action'
	| 'keyboard'
	| 'form'
	| 'clipboard'
	| 'drag-and-drop'
	| 'page-resize'
	| 'scroll'
	| 'touch'
	| 'other';
