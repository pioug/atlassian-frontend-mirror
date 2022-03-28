import { EmojiId } from '../../types';

import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
  ConcurrentExperience,
  UFOExperience,
} from '@atlaskit/ufo';
import { withSampling } from './samplingUfo';

// TODO: clean up as not needed
export type UfoExperienceName =
  | 'emoji-rendered'
  | 'emoji-resource-fetched'
  | 'emoji-picker-opened'
  | 'emoji-selection-recorded'
  | 'emoji-uploaded'
  | 'emoji-searched';

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
    'emoji-rendered',
    createRenderExperience('emoji'),
  ),
  'emoji-resource-fetched': new ConcurrentExperience(
    'emoji-resource-fetched',
    createRenderExperience('emoji-provider'),
  ),
  'emoji-picker-opened': new UFOExperience(
    'emoji-picker-opened',
    createRenderExperience('emoji-picker'),
  ),
  'emoji-selection-recorded': new UFOExperience(
    'emoji-selection-recorded',
    createInlineExperience('emoji-picker'),
  ),
  'emoji-uploaded': new UFOExperience(
    'emoji-uploaded',
    createInlineExperience('emoji-picker'),
  ),
  'emoji-searched': new UFOExperience(
    'emoji-searched',
    createInlineExperience('emoji-picker'),
  ),
};

export const sampledUfoRenderedEmoji = (emojiId: EmojiId) => {
  return withSampling(
    ufoExperiences['emoji-rendered'].getInstance(
      emojiId.id || emojiId.shortName,
    ),
  );
};
