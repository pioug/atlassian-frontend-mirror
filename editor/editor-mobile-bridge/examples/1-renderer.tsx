import React, { useEffect } from 'react';
import type { DocNode } from '@atlaskit/adf-schema';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import Renderer from './../src/renderer/mobile-renderer-element';
import { type MentionProvider } from '@atlaskit/mention/types';
import { createCardClient, createMentionProvider } from '../src/providers';
import getBridge from '../src/renderer/native-to-web/bridge-initialiser';
import useRendererConfiguration from '../src/renderer/hooks/use-renderer-configuration';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

window.logBridge = window.logBridge || [];

const initialDocument = {
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
} as DocNode;

const providerFactory = ProviderFactory.create({
  mentionProvider: Promise.resolve({} as MentionProvider),
});

export default function Example() {
  const rendererBridge = getBridge();
  const rendererConfiguration = useRendererConfiguration(rendererBridge);
  const emojiProvider = getEmojiResource();

  useEffect(() => {
    // This is the only reason bridge.updateSystemFontSize works in the tests
    // I extracted this from the custom example mark-up here: atlassian-frontend/packages/editor/editor-mobile-bridge/public/renderer.html.ejs
    // Apparently there is something similar in how the webview is integrated in mobile that it makes font size dependent on the root element too
    const style = document.createElement('style');
    style.innerHTML = `
#renderer .ak-renderer-document {
  font-size: 1rem !important;
}
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      id="renderer"
      style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        position: 'absolute',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        top: '0',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        left: '0',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        right: '0',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        bottom: '0',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        height: '100%',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        width: '100%',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        boxSizing: 'border-box',
      }}
    >
      <Renderer
        cardClient={createCardClient()}
        emojiProvider={emojiProvider}
        mentionProvider={createMentionProvider()}
        document={initialDocument}
        mediaProvider={storyMediaProviderFactory({
          collectionName: 'InitialCollectionForTesting',
        })}
        dataProviders={providerFactory}
        allowHeadingAnchorLinks
        locale={rendererConfiguration.getLocale()}
        rendererBridge={rendererBridge}
      />
    </div>
  );
}
