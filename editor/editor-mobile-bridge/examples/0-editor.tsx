import React from 'react';
import { disableZooming } from './utils/viewport';

import {
  cardProvider,
  storyMediaProviderFactory,
} from '@atlaskit/editor-test-helpers';

import Editor from './../src/editor/mobile-editor-element';
import {
  createCardClient,
  createEmojiProvider,
  createMentionProvider,
} from '../src/providers';
import { useFetchProxy } from '../src/utils/fetch-proxy';
import { createCollabProviderFactory } from '../src/providers/collab-provider';
import { getBridge } from '../src/editor/native-to-web/bridge-initialiser';
import { useEditorConfiguration } from '../src/editor/hooks/use-editor-configuration';

window.logBridge = window.logBridge || [];

function EditorWithFetchProxy() {
  const fetchProxy = useFetchProxy();
  const bridge = getBridge();
  const editorConfiguration = useEditorConfiguration(bridge);

  return (
    <Editor
      bridge={bridge}
      createCollabProvider={createCollabProviderFactory(fetchProxy)}
      cardProvider={Promise.resolve(cardProvider)}
      cardClient={createCardClient()}
      emojiProvider={createEmojiProvider(fetchProxy)}
      mentionProvider={createMentionProvider()}
      mediaProvider={storyMediaProviderFactory({
        collectionName: 'InitialCollectionForTesting',
        includeUserAuthProvider: true,
      })}
      placeholder="Type something here"
      shouldFocus={true}
      editorConfiguration={editorConfiguration}
      locale={editorConfiguration.getLocale()}
    />
  );
}

export default class Example extends React.Component {
  componentDidMount() {
    disableZooming();
    // Set initial padding (this usually gets set by native)
    if (window.bridge) {
      window.bridge.setPadding(32, 16, 0, 16);
    }
  }

  render() {
    return (
      <div id="editor">
        <EditorWithFetchProxy />
      </div>
    );
  }
}
