import { CustomData, UFOExperience } from '@atlaskit/ufo';

export interface UFOExperienceSampledRecords {
  [experienceName: string]: UFOExperienceSampledRecord;
}
interface SamplingInstancesRecord {
  [key: string]: boolean;
}

interface UFOExperienceSampledRecord {
  sampledInstance: SamplingInstancesRecord;
  sampled: boolean;
}

export const ufoExperiencesSampled: UFOExperienceSampledRecords = {};

type EndStateConfig = {
  force?: boolean;
  metadata?: CustomData;
};

type SamplingFunc = (rate: number) => boolean;

const sampleChance = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const clearSampled = () => {
  for (const prop of Object.getOwnPropertyNames(ufoExperiencesSampled)) {
    delete ufoExperiencesSampled[prop];
  }
};

// default sampling function to determine which one to be sampled
export const isExperienceSampled = (rate: number) => {
  // if invalid sampling rate provided, we sample it
  if (rate > 1 || rate < 0) {
    return true;
  }
  if (rate === 1) {
    return true;
  }
  if (rate === 0) {
    return false;
  }
  const maxCount = Math.ceil(1 / rate);
  const chance = sampleChance(1, maxCount);
  return chance === maxCount;
};

const hasSampledFromStart = (experience: UFOExperience) => {
  if (!ufoExperiencesSampled[experience.id]) {
    return false;
  }
  if (experience.instanceId) {
    // if the instance of concurrent exp has been sampled from start, allow it.
    return ufoExperiencesSampled[experience.id].sampledInstance[
      experience.instanceId
    ];
  }
  return ufoExperiencesSampled[experience.id].sampled;
};

export interface WithSampling extends Omit<UFOExperience, 'start'> {
  start: (options: {
    samplingRate: number;
    samplingFunc?: SamplingFunc;
    startTime?: number;
  }) => Promise<void>;
}

/**
 * This function is a temp solution to reduce the event traffic, as UFO package does not support it.
 *
 * e.g. Emoji Picker contains thousands of emojis, which means will trigger a large number of renderred events without sampling
 * @param ufoExperience
 * @returns
 */
export const withSampling = (ufoExperience: UFOExperience) => {
  const init = () => {
    if (!ufoExperiencesSampled[ufoExperience.id]) {
      ufoExperiencesSampled[ufoExperience.id] = {
        sampled: false,
        sampledInstance: {},
      };
    }
  };

  const start = async (options: {
    samplingRate: number;
    samplingFunc?: SamplingFunc;
    startTime?: number;
  }): Promise<void> => {
    // check if the experience has already sampled before
    if (hasSampledFromStart(ufoExperience)) {
      return;
    }
    const isSampled = options.samplingFunc || isExperienceSampled;
    if (!isSampled(options.samplingRate)) {
      if (ufoExperience.instanceId) {
        ufoExperiencesSampled[ufoExperience.id].sampledInstance[
          ufoExperience.instanceId
        ] = false;
      }
      ufoExperiencesSampled[ufoExperience.id].sampled = false;
      return;
    }
    // update sampled records
    if (ufoExperience.instanceId) {
      ufoExperiencesSampled[ufoExperience.id].sampledInstance[
        ufoExperience.instanceId
      ] = true;
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
    success,
    failure,
    abort,
    mark,
    markFMP,
    markInlineResponse,
  } as WithSampling;
};
