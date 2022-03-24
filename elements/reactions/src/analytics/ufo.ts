import {
  ConcurrentExperience,
  UFOExperience,
  ExperiencePerformanceTypes,
  ExperienceTypes,
} from '@atlaskit/ufo';

/**
 * Initial experience config object (deferred from @atlaskit/ufo inner types)
 * TODO: Check if possible to add this to exported types from @atlaskit/ufo
 */
type Config = {
  type: ExperienceTypes;
  performanceType: ExperiencePerformanceTypes;
  platform?: { component: string };
};

/**
 * Helper method for create the config type for an individual/Concurrent experience
 * @param componentName
 */
const createExperienceConfig: (
  componentName: string,
  type: ExperienceTypes,
  performanceType: ExperiencePerformanceTypes,
) => Config = (componentName, type, performanceType) => {
  return {
    platform: { component: componentName },
    type,
    performanceType,
  };
};

/**
 * Types of experiences
 */
export enum ExperienceName {
  REACTIONS_RENDERED = 'reactions-rendered',
  PICKER_OPENED = 'reactions-picker-opened',
  REACTION_ADDED = 'reaction-added',
  REACTION_REMOVED = 'reaction-removed',
}

/**
 * UFO types of components been instrumented
 */
enum ComponentName {
  PICKER_RENDERED = 'reactions-picker',
  REACTIONS = 'reactions-list',
}

/**
 * Experience when the emoji picker is opened
 */
export const PickerRender = new UFOExperience(
  ExperienceName.PICKER_OPENED,
  createExperienceConfig(
    ComponentName.PICKER_RENDERED,
    ExperienceTypes.Experience,
    ExperiencePerformanceTypes.InlineResult,
  ),
);

/**
 * Experience when the list of reactions gets rendered
 */
export const ReactionsRendered = new ConcurrentExperience(
  ExperienceName.REACTIONS_RENDERED,
  createExperienceConfig(
    ComponentName.REACTIONS,
    ExperienceTypes.Experience,
    ExperiencePerformanceTypes.InlineResult,
  ),
);

/**
 * Experience when a reaction emoji gets added
 */
export const ReactionsAdd = new ConcurrentExperience(
  ExperienceName.REACTION_ADDED,
  createExperienceConfig(
    ComponentName.REACTIONS,
    ExperienceTypes.Experience,
    ExperiencePerformanceTypes.InlineResult,
  ),
);

/**
 * Experience when a reaction emoji gets removed/decrement
 */
export const ReactionsRemove = new ConcurrentExperience(
  ExperienceName.REACTION_REMOVED,
  createExperienceConfig(
    ComponentName.REACTIONS,
    ExperienceTypes.Experience,
    ExperiencePerformanceTypes.InlineResult,
  ),
);
