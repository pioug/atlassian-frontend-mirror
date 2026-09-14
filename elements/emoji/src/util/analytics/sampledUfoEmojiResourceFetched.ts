import { type ProviderTypes } from '../../types';
import type { WithSamplingUFOExperience } from './samplingUfo';
import { ufoExperiences } from './ufoExperiences';
import { withSampling } from './withSampling';

export const sampledUfoEmojiResourceFetched = (
	providerType: ProviderTypes,
): WithSamplingUFOExperience => {
	return withSampling(ufoExperiences['emoji-resource-fetched'].getInstance(providerType));
};
