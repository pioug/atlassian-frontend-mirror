import type { CustomData } from '@atlaskit/ufo/types';
import type { UFOExperience } from '@atlaskit/ufo/experience';

import { isExperienceSampled } from './isExperienceSampled';
import { ufoExperiencesSampled } from './samplingUfo';
import type { SamplingFunc, WithSamplingUFOExperience } from './samplingUfo';

type EndStateConfig = {
	force?: boolean;
	metadata?: CustomData;
};

const hasSampledFromStart = (experience: UFOExperience) => {
	if (!ufoExperiencesSampled[experience.id]) {
		return false;
	}
	if (experience.instanceId) {
		// if the instance of concurrent exp has been sampled from start, allow it.
		return ufoExperiencesSampled[experience.id].sampledInstance[experience.instanceId];
	}
	return ufoExperiencesSampled[experience.id].sampled;
};

/**
 * This function is a temp solution to reduce the event traffic, as UFO package does not support it.
 *
 * e.g. Emoji Picker contains thousands of emojis, which means will trigger a large number of renderred events without sampling
 * @param ufoExperience
 * @returns
 */
export const withSampling: any = (ufoExperience: UFOExperience) => {
	const init = () => {
		if (!ufoExperiencesSampled[ufoExperience.id]) {
			ufoExperiencesSampled[ufoExperience.id] = {
				sampled: false,
				sampledInstance: {},
			};
		}
	};

	const start = async (options: {
		samplingFunc?: SamplingFunc;
		samplingRate: number;
		startTime?: number;
	}): Promise<void> => {
		// check if the experience has already sampled before
		if (hasSampledFromStart(ufoExperience)) {
			return;
		}
		const isSampled = options.samplingFunc || isExperienceSampled;
		if (!isSampled(options.samplingRate)) {
			if (ufoExperience.instanceId) {
				ufoExperiencesSampled[ufoExperience.id].sampledInstance[ufoExperience.instanceId] = false;
			}
			ufoExperiencesSampled[ufoExperience.id].sampled = false;
			return;
		}
		// update sampled records
		if (ufoExperience.instanceId) {
			ufoExperiencesSampled[ufoExperience.id].sampledInstance[ufoExperience.instanceId] = true;
			ufoExperiencesSampled[ufoExperience.id].sampled = true;
		}
		return ufoExperience.start(options.startTime);
	};

	const success = async (config?: EndStateConfig | undefined) => {
		if (!hasSampledFromStart(ufoExperience)) {
			return null;
		}
		return ufoExperience.success(config);
	};

	const failure = async (config?: EndStateConfig | undefined) => {
		if (!hasSampledFromStart(ufoExperience)) {
			return null;
		}
		return ufoExperience.failure(config);
	};

	const abort = async (config?: EndStateConfig | undefined) => {
		if (!hasSampledFromStart(ufoExperience)) {
			return null;
		}
		return ufoExperience.abort(config);
	};

	const addMetadata = (data: CustomData) => {
		if (!hasSampledFromStart(ufoExperience)) {
			return;
		}
		return ufoExperience.addMetadata(data);
	};

	const mark = (name: string, timestamp?: number) => {
		if (!hasSampledFromStart(ufoExperience)) {
			return;
		}
		return ufoExperience.mark(name, timestamp);
	};

	const markFMP = (timestamp?: number) => {
		if (!hasSampledFromStart(ufoExperience)) {
			return;
		}
		return ufoExperience.markFMP(timestamp);
	};

	const markInlineResponse = (timestamp?: number) => {
		if (!hasSampledFromStart(ufoExperience)) {
			return;
		}
		return ufoExperience.markInlineResponse(timestamp);
	};

	init();

	return {
		...ufoExperience,
		start,
		addMetadata,
		success,
		failure,
		abort,
		mark,
		markFMP,
		markInlineResponse,
	} as WithSamplingUFOExperience;
};
