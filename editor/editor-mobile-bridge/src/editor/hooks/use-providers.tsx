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
import { CardClient, EditorCardProvider } from '@atlaskit/link-provider';
import { fetchProxy } from '../../utils/fetch-proxy';
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
  const [providers, setProviders] = useState<Providers>(() => {
    const initialValue: Providers = {
      mediaProvider: createMediaProvider(),
      cardClient: createCardClient(),
      cardProvider: createCardProvider(),
      emojiProvider: createEmojiProvider(fetchProxy),
      mentionProvider: createMentionProvider(),
      createCollabProvider: createCollabProviderFactory(fetchProxy),
    };

    return initialValue;
  });

  const resetProviders = useCallback(() => {
    setProviders({
      mediaProvider: createMediaProvider(),
      cardClient: createCardClient(),
      cardProvider: createCardProvider(),
      emojiProvider: providers.emojiProvider ?? createEmojiProvider(fetchProxy),
      mentionProvider: createMentionProvider(),
      createCollabProvider: createCollabProviderFactory(fetchProxy),
    });
  }, [providers]);

  return { providers, resetProviders };
};

export { useProviders };
