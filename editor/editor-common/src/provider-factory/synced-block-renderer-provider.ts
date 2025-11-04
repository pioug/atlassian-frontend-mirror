import type { EmojiProvider } from '@atlaskit/emoji';
import type { MentionProvider } from '@atlaskit/mention/types';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

import type { CardProvider } from './card-provider';
import type { MediaProvider } from './media-provider';
import type { ProfilecardProvider } from './profile-card-provider';

export type SyncedBlockRendererDataProviders = {
	cardProvider: Promise<CardProvider> | undefined;
	emojiProvider: Promise<EmojiProvider> | undefined;
	mediaProvider: Promise<MediaProvider> | undefined;
	mentionProvider: Promise<MentionProvider> | undefined;
	profilecardProvider: Promise<ProfilecardProvider> | undefined;
	taskDecisionProvider: Promise<TaskDecisionProvider> | undefined;
};
