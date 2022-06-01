import {
  EmojiId,
  UfoComponentName,
  UfoEmojiTimings,
  UfoEmojiTimingsKeys,
  UfoExperienceName,
} from '../../types';

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

const customEmojiTimings = [
  { key: UfoEmojiTimingsKeys.MOUNTED, endMark: UfoEmojiTimings.MOUNTED_END },
  {
    key: UfoEmojiTimingsKeys.METADATA,
    component: 'resourced-emoji',
    startMark: UfoEmojiTimings.METADATA_START,
    endMark: UfoEmojiTimings.METADATA_END,
  },
  {
    key: UfoEmojiTimingsKeys.MEDIADATA,
    component: 'caching-emoji',
    startMark: UfoEmojiTimings.MEDIA_START,
    endMark: UfoEmojiTimings.MEDIA_END,
  },
  {
    key: UfoEmojiTimingsKeys.ONLOAD,
    startMark: UfoEmojiTimings.ONLOAD_START,
    endMark: UfoEmojiTimings.ONLOAD_END,
  },
];

export const ufoExperiences = {
  'emoji-rendered': new ConcurrentExperience(UfoExperienceName.EMOJI_RENDERED, {
    platform: { component: UfoComponentName.EMOJI },
    type: ExperienceTypes.Operation,
    performanceType: ExperiencePerformanceTypes.Custom,
    timings: customEmojiTimings,
  }),
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
