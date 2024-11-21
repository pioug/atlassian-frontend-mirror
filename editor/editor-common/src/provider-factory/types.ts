import type { ActivityProvider } from '@atlaskit/activity-provider';
import type { EmojiProvider } from '@atlaskit/emoji/types';
import type { MentionProvider } from '@atlaskit/mention/types';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

import type { CollabEditProvider } from '../collab';
import type { ExtensionProvider } from '../extensions/types/extension-provider';

import type { AutoformattingProvider } from './autoformatting-provider';
import type { CardProvider } from './card-provider';
import type { ContextIdentifierProvider } from './context-identifier-provider';
import type { ImageUploadProvider } from './image-upload-provider';
import type { MacroProvider } from './macro-provider';
import type { MediaProvider } from './media-provider';
import type { ProfilecardProvider } from './profile-card-provider';
import type { QuickInsertProvider } from './quick-insert-provider';
import type { SearchProvider } from './search-provider';

export interface Providers {
	mediaProvider?: Promise<MediaProvider>;
	emojiProvider?: Promise<EmojiProvider>;
	mentionProvider?: Promise<MentionProvider>;
	extensionProvider?: Promise<ExtensionProvider>;
	autoformattingProvider?: Promise<AutoformattingProvider>;
	taskDecisionProvider?: Promise<TaskDecisionProvider>;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	imageUploadProvider?: Promise<ImageUploadProvider>;
	collabEditProvider?: Promise<CollabEditProvider>;
	macroProvider?: Promise<MacroProvider>;
	cardProvider?: Promise<CardProvider>;
	quickInsertProvider?: Promise<QuickInsertProvider>;
	profilecardProvider?: Promise<ProfilecardProvider>;
	searchProvider?: Promise<SearchProvider>;
	activityProvider?: Promise<ActivityProvider>;

	presenceProvider?: Promise<any>; // TODO: https://product-fabric.atlassian.net/browse/ED-8592
	reactionsStore?: Promise<any>; // TODO: https://product-fabric.atlassian.net/browse/ED-8593
}

export type ProviderName = keyof Providers;
export type ProviderType<T> = T extends keyof Providers ? Providers[T] : Promise<any>;

export type ProviderHandler<T extends string = any> = (
	name: T,
	provider?: ProviderType<typeof name>,
) => void;
