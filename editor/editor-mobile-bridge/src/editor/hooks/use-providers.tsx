import { useState, useCallback } from 'react';
import { MediaProvider } from '@atlaskit/editor-core';
import {
  createMediaProvider,
  createCardProvider,
  createCardClient,
  createEmojiProvider,
  createMentionProvider,
} from '../../providers';
import { Provider as CollabProvider } from '@atlaskit/collab-provider';
import WebBridgeImpl from '../native-to-web';
import { useFetchProxy } from '../../utils/fetch-proxy';
import { Client as CardClient, EditorCardProvider } from '@atlaskit/smart-card';
import { EmojiResource } from '@atlaskit/emoji';
import { MentionProvider } from '@atlaskit/mention';
import { createCollabProviderFactory } from '../../providers/collab-provider';

interface Providers {
  mediaProvider: Promise<MediaProvider>;
  cardClient: CardClient;
  cardProvider: Promise<EditorCardProvider>;
  emojiProvider: Promise<EmojiResource>;
  mentionProvider: Promise<MentionProvider>;
  createCollabProvider: (bridge: WebBridgeImpl) => Promise<CollabProvider>;
}

const useProviders = () => {
  const fetchProxy = useFetchProxy();
  const [providers, setProviders] = useState<Providers>({
    mediaProvider: createMediaProvider(),
    cardClient: createCardClient(),
    cardProvider: createCardProvider(),
    emojiProvider: createEmojiProvider(fetchProxy),
    mentionProvider: createMentionProvider(),
    createCollabProvider: createCollabProviderFactory(fetchProxy),
  });

  const resetProviders = useCallback(() => {
    setProviders({
      mediaProvider: createMediaProvider(),
      cardClient: createCardClient(),
      cardProvider: createCardProvider(),
      emojiProvider: createEmojiProvider(fetchProxy),
      mentionProvider: createMentionProvider(),
      createCollabProvider: createCollabProviderFactory(fetchProxy),
    });
  }, [setProviders, fetchProxy]);

  return { providers, resetProviders };
};

export { useProviders };
