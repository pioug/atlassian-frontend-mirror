import React from 'react';
import { disableZooming } from './utils/viewport';
import {
  cardProvider,
  storyMediaProviderFactory,
} from '@atlaskit/editor-test-helpers';
import {
  createCardClient,
  createEmojiProvider,
  createMentionProvider,
} from '../src/providers';
import Editor from './../src/labs/mobile-editor-element';
import { useFetchProxy } from '../src/utils/fetch-proxy';

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
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    disableZooming();
    // Set initial padding (this usually is set by native)
    if (window.bridge) window.bridge.setPadding(32, 16, 0, 16);
  }

  render() {
    return (
      <div id="editor">
        <EditorWithFetchProxy />
      </div>
    );
  }
}
