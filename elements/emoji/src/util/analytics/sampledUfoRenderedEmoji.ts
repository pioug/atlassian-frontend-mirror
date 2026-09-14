import { type EmojiId } from '../../types';
import type { WithSamplingUFOExperience } from './samplingUfo';
import { ufoExperiences } from './ufoExperiences';
import { withSampling } from './withSampling';

export const sampledUfoRenderedEmoji = (emojiId: EmojiId): WithSamplingUFOExperience => {
	return withSampling(
		ufoExperiences['emoji-rendered'].getInstance(emojiId.id || emojiId.shortName),
	);
};
