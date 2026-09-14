import { mentionSampleAvatarUrl } from '@atlaskit/util-data-test/mention-story-data'; // eslint-disable-line import/no-extraneous-dependencies

export const withLocalResource = <T extends { avatarUrl?: string }>(items: T[]): T[] => {
	return items.map((item) => ({ ...item, avatarUrl: mentionSampleAvatarUrl }));
};
