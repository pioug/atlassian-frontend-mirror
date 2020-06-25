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

// @ts-ignore
window.logBridge = window.logBridge || [];

function EditorWithFetchProxy() {
  const fetchProxy = useFetchProxy();

  return (
    <Editor
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
    />
  );
}

export default class Example extends React.Component {
  componentDidMount() {
    disableZooming();
    // Set initial padding (this usually gets set by native)
    (window as any).bridge.setPadding(32, 16, 0, 16);
  }

  render() {
    return (
      <div id="editor">
        <EditorWithFetchProxy />
      </div>
    );
  }
}
