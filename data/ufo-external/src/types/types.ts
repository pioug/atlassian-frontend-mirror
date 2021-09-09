import { AbstractExperienceConfig } from '../platform-client/core/experience/abstract-experience';
import { UFOExperienceStateType } from '../platform-client/core/experience/experience-state';
import { ExperienceTypes } from '../platform-client/core/experience/experience-types';

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

export interface ExperienceData {
  id: string;
  uuid: string | null;
  type: ExperienceTypes;
  category: string | null;
  state: UFOExperienceStateType;
  metadata: CustomData;
  metrics: ExperienceMetrics;
  children: Array<ExperienceData>;
  platform: { component: string } | null;
  result: {
    success: boolean;
    startTime: number | null;
    duration: number;
  };
}

export interface PageLoadExperienceData extends ExperienceData {
  initial: boolean;
}

export type ExperienceConfig = AbstractExperienceConfig;

export const SUBSCRIBE_ALL = '__SUBSCRIBE_ALL__';
