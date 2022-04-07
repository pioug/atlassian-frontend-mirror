import { AbstractExperienceConfig } from './platform-client/core/experience/abstract-experience';
import { UFOExperienceStateType } from './platform-client/core/experience/experience-state';
import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
} from './platform-client/core/experience/experience-types';
export type { GlobalEventStream } from './global-stream-buffer';

export enum UFOGlobalEventStreamEventType {
  EXPERIENCE_PAYLOAD,
  SUBSCRIBE,
  UNSUBSCRIBE,
}

export type SubscribeCallback = (data: ExperienceData) => void;

export type UFOGlobalEventStreamExperiencePayload = {
  type: UFOGlobalEventStreamEventType.EXPERIENCE_PAYLOAD;
  payload: ExperienceData;
};

export type UFOGlobalEventStreamSubscribe = {
  type: UFOGlobalEventStreamEventType.SUBSCRIBE;
  payload: { experienceId: string; callback: SubscribeCallback };
};

export type UFOGlobalEventStreamUnsubscribe = {
  type: UFOGlobalEventStreamEventType.UNSUBSCRIBE;
  payload: { experienceId: string; callback: SubscribeCallback };
};

export type UFOGlobalEventStreamEvent =
  | UFOGlobalEventStreamExperiencePayload
  | UFOGlobalEventStreamSubscribe
  | UFOGlobalEventStreamUnsubscribe;

export type CustomData = {
  [key: string]: string | number | boolean | CustomData | undefined;
};

export type ExperienceMetrics = {
  startTime: null | number;
  endTime: null | number;
  marks: Array<{ name: string; time: number }>;
};

export enum PageVisibleState {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  MIXED = 'mixed',
}

export type Timing =
  | {
      key: string;
      startMark: string;
      endMark: string;
      component?: string;
    }
  | {
      key: string;
      endMark: string;
      component?: string;
    }
  | {
      key: string;
      startMark: string;
      component?: string;
    };

export type ReportedTiming = { startTime: number; duration: number };

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
  [ExperiencePerformanceTypes.PageLoad]?: PageLoadHistogramConfig;
  [ExperiencePerformanceTypes.PageSegmentLoad]?: PageSegmentLoadHistogramConfig;
  [ExperiencePerformanceTypes.InlineResult]?: InteractionHistogramConfig;
  [ExperiencePerformanceTypes.Custom]?: CustomHistogramConfig;
};

export type PerformanceConfig = {
  histogram?: HistogramConfig;
};

export interface ExperienceData {
  id: string;
  uuid: string | null;
  type: ExperienceTypes;
  schemaVersion: string;
  performanceType: ExperiencePerformanceTypes;
  category: string | null;
  state: UFOExperienceStateType;
  metadata: CustomData;
  metrics: ExperienceMetrics;
  children: Array<ExperienceData>;
  pageVisibleState: PageVisibleState;
  platform: { component: string } | null;
  result: {
    success: boolean;
    startTime: number | null;
    duration: number;
  };
  featureFlags: string[];
  isSSROutputAsFMP: boolean;
  timings: Timing[];
  explicitTimings: ReportedTimings;
  performanceConfig?: PerformanceConfig;
}

export interface PageLoadExperienceData extends ExperienceData {
  initial: boolean;
}

export type ExperiencePerformanceConfig = PerformanceConfig;
export type ExperienceConfig = AbstractExperienceConfig;

export const SUBSCRIBE_ALL = '__SUBSCRIBE_ALL__';
export const FMP_MARK = 'fmp';
export const INLINE_RESPONSE_MARK = 'inline-response';
