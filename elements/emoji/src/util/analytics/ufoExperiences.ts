/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import { ExperiencePerformanceTypes, ExperienceTypes } from '@atlaskit/ufo/experience-types';
import { ConcurrentExperience } from '@atlaskit/ufo/concurrent-experience';
import { UFOExperience } from '@atlaskit/ufo/experience';

import {
	UfoComponentName,
	UfoEmojiTimings,
	UfoEmojiTimingsKeys,
	UfoExperienceName,
} from '../../types';

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
	{
		key: UfoEmojiTimingsKeys.FMP,
		endMark: UfoEmojiTimings.FMP_END,
	},
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
		key: UfoEmojiTimingsKeys.MOUNTED,
		component: 'emoji',
		endMark: UfoEmojiTimings.MOUNTED_END,
	},
	{
		key: UfoEmojiTimingsKeys.ONLOAD,
		startMark: UfoEmojiTimings.ONLOAD_START,
		endMark: UfoEmojiTimings.ONLOAD_END,
	},
];

export const ufoExperiences: {
	'emoji-picker-opened': UFOExperience;
	'emoji-rendered': ConcurrentExperience;
	'emoji-resource-fetched': ConcurrentExperience;
	'emoji-searched': UFOExperience;
	'emoji-selection-recorded': UFOExperience;
	'emoji-uploaded': UFOExperience;
} = {
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

/**
 * @deprecated Use `import { sampledUfoRenderedEmoji } from '@atlaskit/emoji/ufo-experiences'` instead.
 */
export { sampledUfoRenderedEmoji } from './sampledUfoRenderedEmoji';
/**
 * @deprecated Use `import { hasUfoMarked } from '@atlaskit/emoji/ufo-experiences'` instead.
 */
export { hasUfoMarked } from './hasUfoMarked';
/**
 * @deprecated Use `import { sampledUfoEmojiResourceFetched } from '@atlaskit/emoji/ufo-experiences'` instead.
 */
export { sampledUfoEmojiResourceFetched } from './sampledUfoEmojiResourceFetched';
