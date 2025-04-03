import type { ObservedWindowEvent } from './window-event-observer';

export type VCObserverEntryType =
	| 'mutation:child-element'
	| 'mutation:remount'
	| 'mutation:element'
	| 'mutation:element-replacement'
	| 'mutation:attribute:no-layout-shift'
	| 'mutation:attribute:non-visual-style'
	| 'mutation:attribute'
	| 'mutation:media'
	| 'layout-shift'
	| 'window:event'
	| 'unknown';

export type ViewportEntryData = {
	readonly elementName: string;
	readonly rect: DOMRect;
	readonly previousRect?: DOMRect | undefined;
	readonly visible: boolean;
	readonly attributeName?: string | null | undefined;
};

export type WindowEventEntryData = {
	readonly eventType: ObservedWindowEvent;
};

export type VCObserverEntry = {
	readonly time: DOMHighResTimeStamp;
	readonly type: VCObserverEntryType;
	readonly data: ViewportEntryData | WindowEventEntryData;
};

export type VCObserverGetVCResultParam = {
	start: number;
	stop: number;
};
