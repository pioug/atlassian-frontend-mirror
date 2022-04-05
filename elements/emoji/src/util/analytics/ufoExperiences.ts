import { EmojiId, UfoComponentName, UfoExperienceName } from '../../types';

import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
  ConcurrentExperience,
  UFOExperience,
} from '@atlaskit/ufo';
import { withSampling } from './samplingUfo';

const createRenderExperience = (componentName: string) => {
  return {
    platform: { component: componentName },
    type: ExperienceTypes.Load,
    performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
  };
};

const createInlineExperience = (componentName: string) => {
  return {
    platform: { component: componentName },
    type: ExperienceTypes.Experience,
    performanceType: ExperiencePerformanceTypes.InlineResult,
  };
};

export const ufoExperiences = {
  'emoji-rendered': new ConcurrentExperience(
    UfoExperienceName.EMOJI_RENDERED,
    createRenderExperience(UfoComponentName.EMOJI),
  ),
  'emoji-resource-fetched': new ConcurrentExperience(
    UfoExperienceName.EMOJI_RESOURCE_FETCHED,
    createRenderExperience(UfoComponentName.EMOJI_PROVIDER),
  ),
  'emoji-picker-opened': new UFOExperience(
    UfoExperienceName.EMOJI_PICKER_OPENED,
    createRenderExperience(UfoComponentName.EMOJI_PICKER),
  ),
  'emoji-selection-recorded': new UFOExperience(
    UfoExperienceName.EMOJI_SELECTION_RECORDED,
    createInlineExperience(UfoComponentName.EMOJI_PROVIDER),
  ),
  'emoji-uploaded': new UFOExperience(
    UfoExperienceName.EMOJI_UPLOADED,
    createInlineExperience(UfoComponentName.EMOJI_PICKER),
  ),
  'emoji-searched': new UFOExperience(
    UfoExperienceName.EMOJI_SEARCHED,
    createInlineExperience(UfoComponentName.EMOJI_PICKER),
  ),
};

export const sampledUfoRenderedEmoji = (emojiId: EmojiId) => {
  return withSampling(
    ufoExperiences['emoji-rendered'].getInstance(
      emojiId.id || emojiId.shortName,
    ),
  );
};
