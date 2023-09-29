import { useState, useCallback } from 'react';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import {
  createMediaProvider,
  createCardProvider,
  createCardClient,
  createEmojiProvider,
  createMentionProvider,
} from '../../providers';
import type { Provider as CollabProvider } from '@atlaskit/collab-provider';
import type WebBridgeImpl from '../native-to-web';
import type { CardClient } from '@atlaskit/link-provider';
import type { EditorCardProvider } from '@atlaskit/editor-card-provider';
import { fetchProxy } from '../../utils/fetch-proxy';
import type { EmojiResource } from '@atlaskit/emoji';
import type { MentionProvider } from '@atlaskit/mention';
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
