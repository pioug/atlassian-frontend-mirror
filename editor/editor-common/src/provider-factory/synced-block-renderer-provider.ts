import type { EmojiProvider } from '@atlaskit/emoji';
import type { MentionProvider } from '@atlaskit/mention/types';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

import type { MediaProvider } from './media-provider';
import type { ProfilecardProvider } from './profile-card-provider';

export type SyncedBlockRendererDataProviders = {
	emojiProvider?: Promise<EmojiProvider>;
	mediaProvider?: Promise<MediaProvider>;
	mentionProvider?: Promise<MentionProvider>;
	profilecardProvider?: Promise<ProfilecardProvider>;
	taskDecisionProvider?: Promise<TaskDecisionProvider>;
};
