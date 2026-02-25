import type { UnbindFn } from 'bind-event-listener';

export const AbortEvent = {
	wheel: 'wheel',
	keydown: 'keydown',
	resize: 'resize',
} as const;

export type VCAbortReason =
	| 'custom'
	| 'scroll'
	| 'keypress'
	| 'resize'
	| 'error'
	| 'not-supported'
	| 'wheel'
	| 'browser_backgrounded';

export type VCAbortReasonType = {
	reason: null | VCAbortReason;
	info: string;
	timestamp: number;
	blocking: boolean;
};

export type VCRatioType = {
	[elementName: string]: number;
};

export type VCLabelStacks = {
	[elementName: string]:
		| {
				segment: string;
				labelStack: string;
		  }
		| string;
};

export type VCRawDataType = {
	abortReasonInfo: string | null;
	abortReason: VCAbortReasonType;
	heatmap: number[][];
	heatmapNext: number[][];
	outOfBoundaryInfo: string;
	totalTime: number;
	componentsLog: ComponentsLogType;
	viewport: { w: number; h: number };
	oldDomUpdatesEnabled: boolean;
	devToolsEnabled: boolean;
	ratios: VCRatioType;
};

export type VCEntryType = {
	time: number;
	vc: number;
	elements: string[];
};

export type VCIgnoreReason =
	| 'image'
	| 'ssr-hydration'
	| 'not-visible'
	| 'non-visual-style'
	| 'rll-placeholder'
	| '';

export type ComponentsLogEntry = {
	type?: string;
	targetName: string;
	__debug__element: WeakRef<Element> | null;
	intersectionRect: {
		width: number;
		height: number;
		top: number;
		bottom: number;
		left: number;
		right: number;
	};
	ignoreReason?: VCIgnoreReason;
	attributeName?: string | null;
	oldValue?: string | null;
	newValue?: string | null;
};

export type VCIgnoredElement = Pick<ComponentsLogEntry, 'targetName' | 'ignoreReason'>;

export type VCResult = {
	[key: string]:
		| boolean
		| number
		| string
		| null
		| undefined
		| VCEntryType[]
		| VCIgnoredElement[]
		| { w: number; h: number }
		| {
				[key: string]: boolean | number | string[] | null | VCEntryType[];
		  }
		| RevisionPayload;
};

export type MetricsDevToolsTypes = {
	'75': number | null;
	'80': number | null;
	'85': number | null;
	'90': number | null;
	'95': number | null;
	'98': number | null;
	'99': number | null;
	tti: number;
	ttai: number;
};

export type ExperimentalVCDevToolsOptions = {
	enableLog?: boolean;
};

export type ComponentsLogType = { [timestamp: number]: ComponentsLogEntry[] };

interface VCDebugInfo {
	entries: VCEntryType[];
	log: ComponentsLogType;
	metrics: MetricsDevToolsTypes;
	heatmap: number[][];
	ratios: VCRatioType;
	start: number;
	stop: number;
}
declare global {
	interface Window {
		__vc?: VCDebugInfo;
		__vcNext?: VCDebugInfo;
		__vcNotAvailableReason?: string;
		__SSR_PLACEHOLDERS_DIMENSIONS__?: { [key: string]: DOMRectReadOnly };
		__SSR_ABORT_LISTENERS__?: {
			unbinds: UnbindFn[];
			aborts: { [key in keyof typeof AbortEvent]?: number };
		};
	}
}

export type RevisionPayloadVCDetails = Record<
	string,
	{
		t: number;
		e: string[];
	}
>;

export type CalculateTTVCResult = {
	vcDetails: RevisionPayloadVCDetails;
	ssrRatio: number;
	speedIndex: number;
	VC90layoutShiftInsights: LayoutShiftInsights;
};

export type RawObservation = {
	t: number;
	r: [number, number, number, number];
	chg: number | string;
	eid: number;
	att?: number;
};

export type RawEventObservation = {
	t: number;
	evt: number;
};

export type LayoutShiftInsightsPayload = {
	impact: number;
	sources: number;
	same: {
		dir: boolean;
		dist: boolean;
	};
	total_mut: number;
	mut: Array<{
		e: string;
		size: number;
		attr: {
			t_before: boolean;
			p_above: 'all' | 'some' | 'none';
			p_left: 'all' | 'some' | 'none';
			p_right: 'all' | 'some' | 'none';
			p_h_overlap: 'all' | 'some' | 'none';
			p_v_overlap: 'all' | 'some' | 'none';
			p_same_offset: 'all' | 'some' | 'none';
		};
	}>;
};

export type RevisionPayloadEntry = {
	'metric:vc90': number | null;
	'vc90:ls'?: LayoutShiftInsightsPayload;
	revision: string;
	clean: boolean;
	vcDetails?: RevisionPayloadVCDetails;
	ratios?: VCRatioType;
	ssrRatio?: number;
	speedIndex?: number;
	labelStacks?: VCLabelStacks;
	abortReason?: VCAbortReason | null;
	abortTimestamp?: number;
	rawData?: {
		obs?: Array<RawObservation>;
		eid?: Record<number, string>;
		chg?: Record<number, string>;
		att?: Record<number, string>;
		evts?: Array<RawEventObservation>;
		evt?: Record<number, string>;
	};
	viewport?: { w: number; h: number };
	feVCTime?: number;
	rawVCTime?: number;
};

export type RevisionPayload = RevisionPayloadEntry[];

export type LayoutShiftVariables =
	| {
			allHaveRects: false;
			allMovedSameWay: false;
			allMovedSameAmount: false;
	  }
	| {
			allHaveRects: true;
			allMovedSameWay: boolean;
			allMovedSameAmount: boolean;
			deltaX: number;
			deltaY: number;
	  };

export type LayoutShiftOffenderMatchState = 'all' | 'some' | 'none';

export type LayoutShiftOffender = {
	offender: string;
	happenedBefore: boolean;
	distanceToLS: number;
	isAbove: LayoutShiftOffenderMatchState;
	isLeft: LayoutShiftOffenderMatchState;
	isRight: LayoutShiftOffenderMatchState;
	hasHorizontalOverlap: LayoutShiftOffenderMatchState;
	hasVerticalOverlap: LayoutShiftOffenderMatchState;
	matchesLayoutShiftDelta: boolean;
};

export type LayoutShiftInsights = {
	layoutShiftOffendersResult: {
		layoutShiftVariables: LayoutShiftVariables;
		layoutShiftOffenders: LayoutShiftOffender[];
	};
	layoutShiftEntriesCount: number;
	layoutShiftImpact: number;
} | null;
