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
	| 'mutation:rll-placeholder'
	| 'mutation:third-party-element'
	| 'mutation:ssr-placeholder'
	| 'layout-shift'
	| 'window:event'
	| 'ssr-hydration'
	| 'unknown';

export type ViewportEntryData = {
	readonly type: VCObserverEntryType;
	readonly elementName: string;
	readonly rect: DOMRect;
	readonly previousRect?: DOMRect | undefined;
	readonly visible: boolean;
	readonly attributeName?: string | null | undefined;
	readonly oldValue?: string | null | undefined;
	readonly newValue?: string | null | undefined;
};

export type WindowEventEntryData = {
	readonly type: VCObserverEntryType;
	readonly eventType: ObservedWindowEvent;
};

export type VCObserverEntry = {
	readonly time: DOMHighResTimeStamp;
	readonly data: ViewportEntryData | WindowEventEntryData;
};

export type VCObserverGetVCResultParam = {
	start: number;
	stop: number;
	interactionId?: string;
	ssr?: number;
};
