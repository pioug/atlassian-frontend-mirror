import {
  ConcurrentExperience,
  UFOExperience,
  ExperiencePerformanceTypes,
  ExperienceTypes,
} from '@atlaskit/ufo';
import { withSampling } from '@atlaskit/emoji';

/**
 * Initial experience config object (deferred from @atlaskit/ufo inner types)
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
  REACTION_DETAILS_FETCHED = 'reaction-details-fetched',
  REACTION_DIALOG_OPENED = 'reaction-dialog-opened',
  REACTION_DIALOG_CLOSED = 'reaction-dialog-closed',
  REACTION_DIALOG_SELECTED_REACTION_CHANGED = 'reaction-dialog-selected-reaction-changed',
}

/**
 * UFO types of components been instrumented
 */
export enum ComponentName {
  PICKER_RENDERED = 'reactions-picker',
  REACTIONS = 'reactions-list',
  REACTION_ITEM = 'reaction-item',
  REACTION_DIALOG = 'reaction-dialog',
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
    ExperienceTypes.Load,
    ExperiencePerformanceTypes.PageSegmentLoad,
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
 * Expeirence when a reaction dialog is opened
 */
export const ReactionDialogOpened = new UFOExperience(
  ExperienceName.REACTION_DIALOG_OPENED,
  createExperienceConfig(
    ComponentName.REACTION_DIALOG,
    ExperienceTypes.Experience,
    ExperiencePerformanceTypes.InlineResult,
  ),
);

/**
 * Experience when a reaction dialog is closed
 */
export const ReactionDialogClosed = new UFOExperience(
  ExperienceName.REACTION_DIALOG_CLOSED,
  createExperienceConfig(
    ComponentName.REACTION_DIALOG,
    ExperienceTypes.Experience,
    ExperiencePerformanceTypes.InlineResult,
  ),
);

/**
 * Experience when a reaction changed/fetched from inside the modal dialog
 */
export const ReactionDialogSelectedReactionChanged = new UFOExperience(
  ExperienceName.REACTION_DIALOG_SELECTED_REACTION_CHANGED,
  createExperienceConfig(
    ComponentName.REACTION_DIALOG,
    ExperienceTypes.Experience,
    ExperiencePerformanceTypes.InlineResult,
  ),
);

/**
 * Experience when a reaction details gets fetched
 */
export const ReactionDetailsFetch = new ConcurrentExperience(
  ExperienceName.REACTION_DETAILS_FETCHED,
  createExperienceConfig(
    ComponentName.REACTION_ITEM,
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

export const sampledReactionsRendered = (instanceId: string) =>
  withSampling(ReactionsRendered.getInstance(instanceId));
