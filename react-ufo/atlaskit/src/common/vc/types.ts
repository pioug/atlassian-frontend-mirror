import type { UnbindFn } from 'bind-event-listener';

export const AbortEvent = {
	wheel: 'wheel',
	keydown: 'keydown',
	resize: 'resize',
} as const;

export type VCAbortReason = 'scroll' | 'keypress' | 'resize' | 'error' | 'not-supported';

export type VCAbortReasonType = {
	reason: null | VCAbortReason;
	info: string;
	timestamp: number;
	blocking: boolean;
};

export type VCRatioType = {
	[elementName: string]: number;
};

export type VCRawDataType = {
	abortReasonInfo: string | null;
	abortReason: VCAbortReasonType;
	heatmap: number[][];
	oldHeatmap: number[][];
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

export type VCIgnoreReason = 'image' | 'ssr-hydration' | 'editor-lazy-node-view' | '';

export type ComponentsLogEntry = {
	targetName: string;
	__debug__element: WeakRef<Element> | null;
	intersectionRect: DOMRectReadOnly;
	ignoreReason?: VCIgnoreReason;
};

export type VCIgnoredElement = Pick<ComponentsLogEntry, 'targetName' | 'ignoreReason'>;

export type VCResult = {
	[key: string]:
		| boolean
		| number
		| string
		| null
		| VCEntryType[]
		| VCIgnoredElement[]
		| { w: number; h: number }
		| {
				[key: string]: boolean | number | string[] | null | VCEntryType[];
		  };
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

declare global {
	interface Window {
		__vc?: {
			entries: VCEntryType[];
			log: ComponentsLogType;
			metrics: MetricsDevToolsTypes;
			heatmap: number[][];
			ratios: VCRatioType;
		};
		__vcNotAvailableReason?: string;
		__SSR_PLACEHOLDERS_DIMENSIONS__?: { [key: string]: DOMRectReadOnly };
		__SSR_ABORT_LISTENERS__?: {
			unbinds: UnbindFn[];
			aborts: { [key in keyof typeof AbortEvent]?: number };
		};
	}
}
