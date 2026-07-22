import { type createPayloads } from '../create-payload';
import type { LabelStackTrieLookupTable } from '../create-payload/common/utils/label-stack-registry';
import type { HiddenTimingItem } from '../hidden-timing';
import { type LabelStack } from '../interaction-context';
import type { SsrSuccessBreakdown } from '../ssr';
import { type VCObserver } from '../vc/vc-observer';

import type {
	AbortReasonType,
	ApdexType,
	HoldActive,
	InteractionError,
	InteractionType,
	MinorInteraction,
	Segment3pDataPayload,
	SegmentInfo,
} from './common/types';
import type { RevisionPayload, RevisionPayloadEntry } from './vc/types';

type ExtractPromise<T> = T extends Promise<infer U> ? U : never;

export type PageVisibility = 'hidden' | 'mixed' | 'visible';

type ReactUFOAttributesProperties = ExtractPromise<
	ReturnType<typeof createPayloads>
>[number]['attributes']['properties'];

export type ResourceTiming = {
	label: string;
	data: {
		startTime: number;
		duration: number;
		workerStart: number;
		fetchStart: number;
		type: string;
		count?: number;
		ttfb?: number;
		requestStart?: number;
		transferType?: 'network' | 'memory' | 'disk' | null;
		serverTime?: number;
		networkTime?: number;
		encodedSize?: number | null;
		decodedSize?: number | null;
		size?: number;
	};
};

export type CompactResourceTimingEntry = {
	/** label */
	l: string;
	/** resource type */
	rt: number | string;
	/** startTime */
	st: number;
	/** duration */
	du: number;
	/** workerStart */
	ws: number;
	/** fetchStart */
	fs: number;
	/** ttfb */
	tb?: number;
	/** requestStart */
	rq?: number;
	/** transferType */
	tr?: number | string | null;
	/** serverTime */
	sv?: number;
	/** networkTime */
	nw?: number;
	/** encodedSize */
	es?: number | null;
	/** decodedSize */
	ds?: number | null;
	/** size */
	sz?: number;
	/** count */
	ct?: number;
};

export type CompactResourceTimings = {
	v: 1;
	r: CompactResourceTimingEntry[];
};

export type ReactProfilerTiming = {
	labelStack: LabelStack;
	startTime: number;
	endTime: number;
	mountCount: number;
	rerenderCount: number;
	renderDuration: number;
	unmountCount?: number;
};

export type HoldInfo = {
	labelStack: LabelStack;
	startTime: number;
	endTime: number;
};

export type OptimizedHoldInfo = {
	labelStack: string;
	startTime: number;
	endTime: number;
};

export type VCParts = (typeof VCObserver.VCParts)[number];

export type LeafSegment = {
	n: string;
};

export interface ParentSegment {
	n: string;
	c: {
		[segmentId: string]: ParentSegment | LeafSegment;
	};
}

export type RootSegment = {
	r: ParentSegment;
};

export type ReactUFOPayload = {
	// Static values expected by GASv3 - this is not expected to be any other value
	action: 'measured';
	actionSubject: 'experience';
	eventType: 'operational';
	source: 'measured';
	tags: ['observability'];

	// values set from UFO data
	attributes: {
		properties: ReactUFOAttributesProperties & {
			'event:hostname': string;
			'event:product': string;
			'event:population': string;
			'event:schema': '1.0.0';
			'event:sizeInKb': number;
			'event:source': { name: 'react-ufo/web'; version: '1.0.1' | '2.0.0' };
			'event:region': string;
			'experience:key': 'custom.interaction-metrics' | 'custom.experimental-interaction-metrics';
			'experience:name': string;
			'event:localHour': number;
			'event:localDayOfWeek': number;
			'event:localTimezoneOffset': number;
			'event:browser:name': string;
			'event:browser:version': string;
			'event:webdriver:enabled'?: boolean;
			'event:cpus': number;
			'event:memory': 0.25 | 0.5 | 1 | 2 | 4 | 8; // as per https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory#value
			'event:network:effectiveType': 'slow-2g' | '2g' | '3g' | '4g'; // as per https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType
			'event:network:rtt': number;
			'event:network:downlink': number;
			'ssr:success': boolean;
			'ssr:success:breakdown'?: SsrSuccessBreakdown;
			'ssr:featureFlags?': Record<string, boolean | string | number>;
			'metric:fp': number;
			'metric:fcp': number;
			'metric:lcp': number;
			'metrics:navigation': {
				redirectStart: number;
				redirectEnd: number;
				fetchStart: number;
				domainLookupStart: number;
				domainLookupEnd: number;
				connectStart: number;
				connectEnd: number;
				secureConnectionStart: number;
				requestStart: number;
				responseStart: number;
				responseEnd: number;
				encodedBodySize: number;
				decodedBodySize: number;
				transferSize: number;
				redirectCount: number;
				type: 'navigate' | 'reload' | 'back_forward' | 'prerender'; // as per https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type
				unloadEventEnd: number;
				unloadEventStart: number;
				workerStart: number;
				nextHopProtocol: 'http/0.9' | 'http/1.0' | 'http/1.1' | 'h2' | 'h2c' | 'h3'; // as per https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/nextHopProtocol
			};
			'ufo:errors:globalCount': number;
			'ufo:errors:count': number;
			'ufo:payloadTime'?: number;
			'ufo:pageVisibilityHiddenTimestamp'?: number;
			'ufo:wasPageHiddenBeforeInit'?: boolean;
			'ufo:isOpenedInBackground'?: boolean;
			'ufo:isTabThrottled'?: boolean;
			'ufo:pageVisibilityTimeline': HiddenTimingItem[];

			// TODO: align this better with `InteractionMetrics` type - that is outdated now, this is the type as sent by the UFO payload as of 10th April 2025
			interactionMetrics: {
				namePrefix: string;
				segmentPrefix: string;
				interactionId: string;
				pageVisibilityAtTTI: PageVisibility;
				pageVisibilityAtTTAI: PageVisibility;
				experimental__pageVisibilityAtTTI: PageVisibility;
				experimental__pageVisibilityAtTTAI: PageVisibility;
				rate: number;
				routeName: string;
				type: InteractionType;
				abortReason: AbortReasonType;
				featureFlags?: {
					prior: Record<string, boolean | string | number>;
					during: Record<string, boolean | string | number>;
				};
				previousInteractionName?: string;
				isPreviousInteractionAborted: boolean;
				abortedByInteractionName?: string;
				apdex: ApdexType[];
				end: number;
				start: number;
				isBM3ConfigSSRDoneAsFmp: boolean;
				isUFOConfigSSRDoneAsFmp: boolean;
				resourceTimings: ResourceTiming[] | CompactResourceTimings;
				/** Third-party segment timing and metadata. */
				segment3pData?: Segment3pDataPayload;
				segments: SegmentInfo[] | RootSegment;
				reactProfilerTimings: ReactProfilerTiming[];
				holdInfo: OptimizedHoldInfo[];
				errors: InteractionError[];
				responsiveness?: {
					inputDelay?: number;
					experimentalInputToNextPaint?: number;
				};
				customData: Array<{ labelStack: LabelStack; data: any }>;
				SSRTimings: Array<{ label: string; data: any }>;
				holdActive: HoldActive[];
				unknownElementName?: string;
				unknownElementHierarchy?: string;
				minorInteractions?: MinorInteraction[];
				_ls?: LabelStackTrieLookupTable;
				// TODO: fix typings here - update as necessary for integration tests
				// marks: [];
				// redirects: [];
				// spans: [];
				// requestInfo: [];
				// customTimings: [];
				// bundleEvalTimings: [];
				// initialPageLoadExtraTimings: [];
			};

			// TTVC fields that will be maintained and supported
			'ufo:vc:rev': RevisionPayload;
			'ufo:vc:ratios': Record<string, number>;
			'ufo:vc:size': { w: number; h: number };
			'ufo:vc:time': number;
			'ufo:speedIndex'?: number;

			// TTVC fields to be deprecated
			'ufo:vc:ignored'?: string[];
			'ufo:vc:abort:reason'?: string;
			'ufo:vc:state'?: boolean;
			'ufo:vc:clean'?: boolean;
			'metrics:vc'?: Record<VCParts, number>;
			'ufo:vc:dom'?: Record<VCParts, string[]>;
			'ufo:vc:updates'?: Array<{ time: number; vc: number; elements: string[] }>;
			'ufo:vc:total'?: number;
			'ufo:vc:next'?: Record<VCParts, number>;
			'ufo:vc:next:updates'?: Array<{ time: number; vc: number; elements: string[] }>;
			'ufo:vc:next:dom'?: Record<VCParts, string[]>;
			'metric:vc90'?: number;
			'ufo:next:speedIndex'?: number;
			'ufo:vc:updates:next'?: Array<{ time: number; vc: number; elements: string[] }>;

			// Tracing context
			'ufo:tracingContext'?: {
				'X-B3-TraceId': string;
				'X-B3-SpanId': string;
				browserTimeOrigin: number;
			};
		};
	};
};

export type LateMutation = {
	time: number;
	element: string;
	viewportHeatmapPercentage: number;
	segment?: string;
	labelStack?: string;
};

export type PostInteractionLogPayload = {
	actionSubject: 'experience';
	action: 'measured';
	eventType: 'operational';
	source: 'measured';
	tags: ['observability'];
	attributes: {
		properties: {
			'event:hostname': string;
			'event:product': string;
			'event:schema': '1.0.0';
			'event:source': {
				name: 'react-ufo/web';
				version: '1.0.1';
			};
			'event:region': string;
			'experience:key': 'custom.post-interaction-logs';
			postInteractionLog: {
				rawVCRevisions?: {
					lastInteractionFinish?: RevisionPayloadEntry;
					postInteractionFinish?: RevisionPayloadEntry;
				};
				lastInteractionFinish: {
					ufoName: string;
					start: number;
					end: number;
					id: string;
					routeName: string;
					type: InteractionType;
					errors: InteractionError[];
					ttai: number;
					vc90: number | null;
					vcClean: boolean;
				};
				revisedEndTime: number;
				revisedTtai: number;
				revisedVC90: number | null;
				vcClean: boolean;
				lateMutations: LateMutation[];
				reactProfilerTimings: ReactProfilerTiming[];
				postInteractionHoldInfo?: HoldActive[];
			};
		};
	};
};
