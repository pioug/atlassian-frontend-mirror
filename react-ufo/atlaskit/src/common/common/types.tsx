import type { ReactHydrationStats } from '../../config';
import type { TraceIdContext } from '../../experience-trace-id-context';
import type { LabelStack, UFOInteractionContextType } from '../../interaction-context';
import type { VCObserverInterface } from '../../vc/types';
import { type VCRawDataType, type VCResult } from '../vc/types';

export type LifecycleMarkType =
	| 'render'
	| 'beforePaint'
	| 'afterPaint'
	| 'nextTick'
	| 'mount'
	| 'commit';
export type MarkType =
	| ('placeholder' | 'bm3_stop' | 'bundle_preload' | 'custom' | 'first_segment_load')
	| LifecycleMarkType;
export type SpanType =
	| 'placeholder'
	| 'relay'
	| 'hidden_timing'
	| 'bundle_load'
	| 'graphql'
	| 'fetch'
	| 'reducer'
	| 'custom';
export type InteractionType = 'page_load' | 'press' | 'typing' | 'transition' | 'segment';
export type AbortReasonType =
	| 'new_interaction'
	| 'unload'
	| 'transition'
	| 'timeout'
	| 'excluded_by_sampling';

export interface ReactProfilerTiming {
	type: 'mount' | 'update' | 'nested-update';
	actualDuration: number;
	baseDuration: number;
	startTime: number;
	commitTime: number;
	labelStack: LabelStack;
}

export interface Span {
	type: SpanType;
	name: string;
	labelStack: LabelStack | null;
	start: number;
	end: number;
	size?: number;
}

export interface Mark {
	type: MarkType;
	name: string;
	labelStack: LabelStack | null;
	time: number;
}

export interface InteractionError {
	name: string;
	labelStack: LabelStack | null;
	errorType: string;
	errorMessage: string;
	errorStack?: string;
	forcedError?: boolean;
	errorHash?: string;
	errorStatusCode?: number;
}

interface FlushInfo {
	label?: string;
	size: number;
	time: number;
}

export interface RequestInfo {
	name: string;
	start: number;
	flushes: FlushInfo[];
	networkStart?: number;
	networkComplete?: number;
	fetchStart?: number;
	end?: number;
	size?: number;
	error?: Error;
}

type FeatureFlagValue = boolean | string | number | Record<any, any> | 'non_boolean';

export interface ApdexType {
	key: string;
	startTime?: number;
	stopTime: number;
	labelStack?: LabelStack;
}

export interface SegmentInfo {
	labelStack: LabelStack;
}

export interface CustomData {
	[key: string]:
		| null
		| string
		| number
		| boolean
		| undefined
		| CustomData
		| Record<string, CustomData>;
}

export type CustomTiming = Record<string, { startTime: number; endTime: number }>;

export interface HoldActive {
	labelStack: LabelStack;
	name: string;
	start: number;
	ignoreOnSubmit?: boolean;
}

export type HoldInfo = HoldActive & {
	end: number;
};

export interface Redirect {
	fromInteractionName: string;
	time: number;
}

export type ResponsivenessMetric = {
	experimentalInputToNextPaint?: number;
	inputDelay?: number;
	visuallyComplete?: number;
	totalBlockingTime?: number;
};

export type MinorInteraction = {
	name: string;
	startTime: DOMHighResTimeStamp;
};

export interface InteractionMetrics {
	id: string;
	start: number;
	end: number;
	ufoName: string;
	previousInteractionName?: string;
	isPreviousInteractionAborted: boolean;
	type: InteractionType;
	marks: Mark[];
	customData: { labelStack: LabelStack; data: CustomData }[];
	cohortingCustomData: Map<string, number | boolean | string | null | undefined>;
	customTimings: { labelStack: LabelStack; data: CustomTiming }[];
	spans: Span[];
	requestInfo: (RequestInfo & { labelStack: LabelStack })[];
	holdInfo: HoldInfo[];
	holdExpInfo: HoldInfo[];
	holdActive: Map<string, HoldActive>;
	reactProfilerTimings: ReactProfilerTiming[];
	holdExpActive: Map<string, HoldActive>;
	measureStart: number;
	rate: number;
	cancelCallbacks: (() => void)[];
	cleanupCallbacks: (() => void)[];
	metaData: Record<string, unknown>;
	errors: InteractionError[];
	abortReason?: AbortReasonType;
	abortedByInteractionName?: string;
	/**
	 * Apdex is a legacy performance measurement where it is
	 * capturing TTI at arbitrary point in the code (bm3/UFOv1)
	 *
	 * We are intercepting its values now just so we can use it for
	 * topline metric, but should encourage teams to adopt TTAI
	 *
	 * This field might be ignored/dropped in the future.
	 */
	apdex: ApdexType[];
	/**
	 * LabelStack is a stack of labels that are used to identify the
	 * breadcrumb of segments of the current interaction.
	 * For example, it could look something like:
	 * ```
	 * [
	 *  { name: 'product', segmentId: 'xxx' },
	 *  { name: 'issue-navigator', segmentId: 'xxx' },
	 *  { name: 'ui', segmentId: 'xxx' }
	 * ]
	 */
	responsiveness?: ResponsivenessMetric;
	labelStack: LabelStack | null;
	routeName: string | null;
	featureFlags?: {
		prior: Record<string, FeatureFlagValue>;
		during: Record<string, FeatureFlagValue>;
	};
	knownSegments: SegmentInfo[];
	awaitReactProfilerCount: number;
	redirects: Redirect[];
	timerID: ReturnType<typeof setInterval> | undefined;
	changeTimeout: (newTime: number) => void;
	trace: TraceIdContext | null;
	legacyMetrics?: BM3Event[];
	vcObserver?: VCObserverInterface;
	experimentalVCObserver?: VCObserverInterface;
	vc?: VCRawDataType | null;
	hydration?: ReactHydrationStats;
	experimentalTTAI?: number;
	experimentalVC90?: number;
	unknownElementName?: string;
	unknownElementHierarchy?: string;
	hold3pActive?: Map<string, HoldActive>;
	hold3pInfo?: HoldInfo[];
	minorInteractions?: MinorInteraction[];
}

export type LoadProfilerEventInfo = {
	identifier: string;
};

export interface RelayMetricsRecorder {
	retainQuery(info: RequestInfo): void;
}

export interface LazyLoadProfilerContext {
	addPreload(moduleId: string, timestamp: number): void;

	addLoad(identifier: string, start: number, end: number): void;
}

export interface EnhancedUFOInteractionContextType
	extends UFOInteractionContextType,
		RelayMetricsRecorder,
		LazyLoadProfilerContext {
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	_internalHold(labelStack: LabelStack, name: string, experimental?: boolean): void | (() => void);

	_internalHoldByID(
		labelStack: LabelStack,
		id: string,
		name: string,
		remove: boolean,
		// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	): void | (() => void);

	addHoldByID(labelStack: LabelStack, id: string, name?: string): void;

	removeHoldByID(labelStack: LabelStack, id: string, name?: string): void;

	onRender: (
		phase: 'mount' | 'update' | 'nested-update',
		actualDuration: number,
		baseDuration: number,
		startTime: number,
		commitTime: number,
	) => void;

	complete(endTime?: number): void;
}

export type BM3Event = {
	key: string;
	custom: any;
	config: {
		timings?: {
			key: string;
			startMark?: string;
			endMark?: string;
			component?: string;
		}[];
		type: string;
		reactUFOName?: string;
	};
	start: number | null;
	stop: number | null;
	marks?: { [key: string]: number };
	submetrics?: BM3Event[];
	pageVisibleState?: string;
	type: string;
};

export type LastInteractionFinishInfo = Pick<
	InteractionMetrics,
	| 'ufoName'
	| 'start'
	| 'end'
	| 'id'
	| 'abortReason'
	| 'abortedByInteractionName'
	| 'routeName'
	| 'type'
	| 'experimentalVC90'
	| 'experimentalTTAI'
	| 'errors'
>;

export type PostInteractionLogOutput = {
	lastInteractionFinish: LastInteractionFinishInfo;
	reactProfilerTimings?: ReactProfilerTiming[];
	postInteractionFinishVCResult?: VCResult;
	lastInteractionFinishVCResult?: VCResult;
	postInteractionHoldInfo?: HoldActive[];
};
