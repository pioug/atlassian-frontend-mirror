// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead

import { type CustomData, type PerformanceConfig, type Timing } from '../../../types';

import { type ExperiencePerformanceTypes, type ExperienceTypes } from './experience-types';

export type AbstractExperienceConfig = {
	category?: string | null;
	featureFlags?: string[];
	isSSROutputAsFMP?: boolean;
	performanceConfig?: PerformanceConfig;
	performanceType: ExperiencePerformanceTypes;
	platform?: { component: string };
	timings?: Timing[];
	type: ExperienceTypes;
	until?: Function | null;
};

export type EndStateConfig = {
	force?: boolean;
	metadata?: CustomData;
};
