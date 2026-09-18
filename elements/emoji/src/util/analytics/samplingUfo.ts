/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import type { UFOExperience } from '@atlaskit/ufo/experience';

export interface UFOExperienceSampledRecords {
	[experienceName: string]: UFOExperienceSampledRecord;
}

interface SamplingInstancesRecord {
	[key: string]: boolean;
}

interface UFOExperienceSampledRecord {
	sampled: boolean;
	sampledInstance: SamplingInstancesRecord;
}

export interface WithSamplingUFOExperience extends Omit<UFOExperience, 'start'> {
	start: (options: {
		samplingFunc?: SamplingFunc;
		samplingRate: number;
		startTime?: number;
	}) => Promise<void>;
}

export const ufoExperiencesSampled: UFOExperienceSampledRecords = {};

export type SamplingFunc = (rate: number) => boolean;

/**
 * @deprecated Use `import { clearSampled } from '@atlaskit/emoji/sampling-ufo'` instead.
 */
export { clearSampled } from './clearSampled';
/**
 * @deprecated Use `import { isExperienceSampled } from '@atlaskit/emoji/sampling-ufo'` instead.
 */
export { isExperienceSampled } from './isExperienceSampled';
/**
 * @deprecated Use `import { withSampling } from '@atlaskit/emoji/sampling-ufo'` instead.
 */
export { withSampling } from './withSampling';
