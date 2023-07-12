import React, { useEffect } from 'react';
import { disableZooming } from './utils/viewport';

import { cardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';

import MobileEditor from './../src/editor/mobile-editor-element';
import { createCardClient, createMentionProvider } from '../src/providers';
import { fetchProxy } from '../src/utils/fetch-proxy';
import { createCollabProviderFactory } from '../src/providers/collab-provider';
import { getBridge } from '../src/editor/native-to-web/bridge-initialiser';
import { useEditorConfiguration } from '../src/editor/hooks/use-editor-configuration';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

// For media mocking
import '../src/__tests__/integration-webview/_mocks/editorTestSetup';

window.logBridge = window.logBridge || [];

export default function Example() {
  const bridge = getBridge();
  const editorConfiguration = useEditorConfiguration(bridge);
  const emojiProvider = getEmojiResource();

  useEffect(() => {
    // This is the only reason bridge.updateSystemFontSize works in the tests
    // I extracted this from the custom example mark-up here: atlassian-frontend/packages/editor/editor-mobile-bridge/public/editor.html.ejs
    // Apparently there is something similar in how the webview is integrated in mobile that it makes font size dependent on the root element too
    const style = document.createElement('style');
    style.innerHTML = `
#editor .ProseMirror {
  font-size: 1rem !important;
}
    `;
    document.head.appendChild(style);

    disableZooming();
    // Set initial padding (this usually gets set by native)
    if (window.bridge) {
      window.bridge.setPadding(32, 16, 0, 16);
    }
  }, []);

  return (
    <div id="editor">
      <MobileEditor
        bridge={bridge}
        createCollabProvider={createCollabProviderFactory(fetchProxy)}
        cardProvider={Promise.resolve(cardProvider)}
        cardClient={createCardClient()}
        emojiProvider={emojiProvider}
        mentionProvider={createMentionProvider()}
        mediaProvider={storyMediaProviderFactory({
          collectionName: 'InitialCollectionForTesting',
        })}
        placeholder="Type something here"
        shouldFocus={true}
        editorConfiguration={editorConfiguration}
        locale={editorConfiguration.getLocale()}
      />
    </div>
  );
}
