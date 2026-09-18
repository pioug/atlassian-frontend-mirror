import { type TeamAvatarImage } from '../types/team';
import { randomHeaderImage } from './random-header-image';
import type { MockConfig } from './team';

export const randomTeamImages =
	({ faker }: MockConfig) =>
	(customImage?: string): TeamAvatarImage => {
		const headerImage = customImage || randomHeaderImage({ faker })();

		return {
			largeAvatarImageUrl: headerImage,
			smallAvatarImageUrl: headerImage,
			largeHeaderImageUrl: headerImage,
			smallHeaderImageUrl: headerImage,
		};
	};
