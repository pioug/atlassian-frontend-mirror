import { type AbstractExperienceConfig } from './platform-client/core/experience/abstract-experience';
import { type UFOExperienceStateType } from './platform-client/core/experience/experience-state';
import {
	type ExperiencePerformanceTypes,
	type ExperienceTypes,
} from './platform-client/core/experience/experience-types';
export type { GlobalEventStream } from './global-stream-buffer';

export enum UFOGlobalEventStreamEventType {
	EXPERIENCE_PAYLOAD,
	SUBSCRIBE,
	UNSUBSCRIBE,
}

export type SubscribeCallback = (data: ExperienceData) => void;

export type UFOGlobalEventStreamExperiencePayload = {
	payload: ExperienceData;
	type: UFOGlobalEventStreamEventType.EXPERIENCE_PAYLOAD;
};

export type UFOGlobalEventStreamSubscribe = {
	payload: { callback: SubscribeCallback; experienceId: string };
	type: UFOGlobalEventStreamEventType.SUBSCRIBE;
};

export type UFOGlobalEventStreamUnsubscribe = {
	payload: { callback: SubscribeCallback; experienceId: string };
	type: UFOGlobalEventStreamEventType.UNSUBSCRIBE;
};

export type UFOGlobalEventStreamEvent =
	| UFOGlobalEventStreamExperiencePayload
	| UFOGlobalEventStreamSubscribe
	| UFOGlobalEventStreamUnsubscribe;

export type CustomData = {
	[key: string]: string | number | boolean | CustomData | undefined;
};

export type ExperienceMetrics = {
	endTime: null | number;
	marks: Array<{ name: string; time: number }>;
	startTime: null | number;
};

export enum PageVisibleState {
	VISIBLE = 'visible',
	HIDDEN = 'hidden',
	MIXED = 'mixed',
}

export type Timing =
	| {
			component?: string;
			endMark: string;
			key: string;
			startMark: string;
	  }
	| {
			component?: string;
			endMark: string;
			key: string;
	  }
	| {
			component?: string;
			key: string;
			startMark: string;
	  };

export type ReportedTiming = { duration: number; startTime: number };

export type ReportedTimings = {
	[key: string]: ReportedTiming;
};

export enum PageLoadMetrics {
	fmp = 'fmp',
	tti = 'tti',
}

export enum PageSegmentLoadMetrics {
	fmp = 'fmp',
	tti = 'tti',
}

export enum InteractionMetrics {
	response = 'response',
	result = 'result',
}

export enum CustomMetrics {
	duration = 'duration',
}

export type BasePageLoadHistogramConfig = {
	[PageLoadMetrics.fmp]: string;
	[PageLoadMetrics.tti]: string;
};

export type PageLoadHistogramConfig = {
	initial: BasePageLoadHistogramConfig;
	transition: BasePageLoadHistogramConfig;
};

export type BasePageSegmentLoadHistogramConfig = {
	[PageSegmentLoadMetrics.fmp]: string;
	[PageSegmentLoadMetrics.tti]: string;
};

export type PageSegmentLoadHistogramConfig = {
	initial: BasePageSegmentLoadHistogramConfig;
	transition: BasePageSegmentLoadHistogramConfig;
};

export type InteractionHistogramConfig = {
	[InteractionMetrics.response]: string;
	[InteractionMetrics.result]: string;
};

export type CustomHistogramConfig = {
	[CustomMetrics.duration]: string;
};

export type HistogramConfig = {
	[ExperiencePerformanceTypes.Custom]?: CustomHistogramConfig;
	[ExperiencePerformanceTypes.InlineResult]?: InteractionHistogramConfig;
	[ExperiencePerformanceTypes.PageLoad]?: PageLoadHistogramConfig;
	[ExperiencePerformanceTypes.PageSegmentLoad]?: PageSegmentLoadHistogramConfig;
};

export type PerformanceConfig = {
	histogram?: HistogramConfig;
};

export interface ExperienceData {
	category: string | null;
	children: Array<ExperienceData>;
	explicitTimings: ReportedTimings;
	featureFlags: string[];
	id: string;
	isSSROutputAsFMP: boolean;
	metadata: CustomData;
	metrics: ExperienceMetrics;
	pageVisibleState: PageVisibleState;
	performanceConfig?: PerformanceConfig;
	performanceType: ExperiencePerformanceTypes;
	platform: { component: string } | null;
	result: {
		duration: number;
		startTime: number | null;
		success: boolean;
	};
	schemaVersion: string;
	state: UFOExperienceStateType;
	timings: Timing[];
	type: ExperienceTypes;
	uuid: string | null;
}

export interface PageLoadExperienceData extends ExperienceData {
	initial: boolean;
}

export type ExperiencePerformanceConfig = PerformanceConfig;
export type ExperienceConfig = AbstractExperienceConfig;

export const SUBSCRIBE_ALL = '__SUBSCRIBE_ALL__';
export const FMP_MARK = 'fmp';
export const INLINE_RESPONSE_MARK = 'inline-response';
