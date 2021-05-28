import React from 'react';
import styled from 'styled-components';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { ProviderFactory } from '@atlaskit/editor-common';

import Renderer from './../src/renderer/mobile-renderer-element';
import { MentionProvider } from '@atlaskit/mention/types';
import {
  createCardClient,
  createEmojiProvider,
  createMentionProvider,
} from '../src/providers';
import { useFetchProxy } from '../src/utils/fetch-proxy';
import getBridge from '../src/renderer/native-to-web/bridge-initialiser';
import useRendererConfiguration from '../src/renderer/hooks/use-renderer-configuration';

export const Wrapper: any = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

Wrapper.displayName = 'Wrapper';

window.logBridge = window.logBridge || [];

const initialDocument = JSON.stringify({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is the mobile renderer',
        },
      ],
    },
  ],
});

const providerFactory = ProviderFactory.create({
  mentionProvider: Promise.resolve({} as MentionProvider),
});

export default function Example() {
  const fetchProxy = useFetchProxy();
  const rendererBridge = getBridge();
  const rendererConfiguration = useRendererConfiguration(rendererBridge);

  return (
    <Wrapper>
      <Renderer
        cardClient={createCardClient()}
        emojiProvider={createEmojiProvider(fetchProxy)}
        mentionProvider={createMentionProvider()}
        document={initialDocument}
        mediaProvider={storyMediaProviderFactory({
          collectionName: 'InitialCollectionForTesting',
          includeUserAuthProvider: false,
        })}
        dataProviders={providerFactory}
        allowHeadingAnchorLinks
        locale={rendererConfiguration.getLocale()}
        rendererBridge={rendererBridge}
      />
    </Wrapper>
  );
}
