import { EmojiProvider } from '@atlaskit/emoji/types';
import { MentionProvider } from '@atlaskit/mention/types';
import { TaskDecisionProvider } from '@atlaskit/task-decision/types';
import { MediaProvider } from './media-provider';
import { ExtensionProvider } from '../extensions/types';
import { AutoformattingProvider } from './autoformatting-provider';
import { ContextIdentifierProvider } from './context-identifier-provider';
import { ImageUploadProvider } from './image-upload-provider';
import { CollabEditProvider } from '../collab/types';
import { MacroProvider } from './macro-provider';
import { CardProvider } from './card-provider';
import { QuickInsertProvider } from './quick-insert-provider';
import { ProfilecardProvider } from './profile-card-provider';

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

  activityProvider?: Promise<any>; // TODO: Activity AK component looks deprecated any suggestion?
  presenceProvider?: Promise<any>; // TODO: https://product-fabric.atlassian.net/browse/ED-8592
  reactionsStore?: Promise<any>; // TODO: https://product-fabric.atlassian.net/browse/ED-8593
}

export type ProviderName = keyof Providers;
export type ProviderType<T> = T extends keyof Providers
  ? Providers[T]
  : Promise<any>;

export type ProviderHandler<T extends string = any> = (
  name: T,
  provider?: ProviderType<typeof name>,
) => void;
