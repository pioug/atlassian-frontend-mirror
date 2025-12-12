import type { AbortReasonType, InteractionType } from '../../common/common/types';

import type { ObservedWindowEvent } from './window-event-observer';

export type VCObserverEntryType =
	| 'mutation:child-element'
	| 'mutation:remount'
	| 'mutation:element'
	| 'mutation:element-replacement'
	| 'mutation:display-contents-children-element'
	| 'mutation:display-contents-children-attribute'
	| 'mutation:attribute:no-layout-shift'
	| 'mutation:attribute:non-visual-style'
	| 'mutation:attribute:non-visual-input-name'
	| 'mutation:attribute'
	| 'mutation:media'
	| 'mutation:rll-placeholder'
	| 'mutation:third-party-element'
	| 'mutation:third-party-attribute'
	| 'mutation:ssr-placeholder'
	| 'layout-shift'
	| 'layout-shift:same-rect'
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
	readonly labelStacks?: VCObserverLabelStacks;
};

export type VCObserverLabelStacks = {
	segment: string;
	labelStack: string;
};

export type WindowEventEntryData = {
	readonly type: VCObserverEntryType;
	readonly eventType: ObservedWindowEvent;
};

export type VCObserverEntry = {
	readonly time: DOMHighResTimeStamp;
	readonly data: ViewportEntryData | WindowEventEntryData;
	ignoredInRevision?: string[];
};

export type VCObserverGetVCResultParam = {
	start: number;
	stop: number;
	interactionId?: string;
	ssr?: number;
	include3p?: boolean;
	excludeSmartAnswersInSearch?: boolean;
	includeSSRRatio?: boolean;
	interactionType: InteractionType;
	isPageVisible: boolean;
	interactionAbortReason?: AbortReasonType;
	includeRawData?: boolean;
	includeSSRInV3?: boolean;
	rawDataStopTime?: number;
};
