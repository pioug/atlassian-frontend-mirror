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

// @ts-ignore
window.logBridge = window.logBridge || [];

export default class Example extends React.Component {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    disableZooming();
    // Set initial padding (this usually is set by native)
    (window as any).bridge.setPadding(32, 16, 0, 16);
  }

  render() {
    return (
      <div id="editor">
        <Editor
          cardProvider={Promise.resolve(cardProvider)}
          cardClient={createCardClient()}
          emojiProvider={createEmojiProvider()}
          mentionProvider={createMentionProvider()}
          mediaProvider={storyMediaProviderFactory({
            collectionName: 'InitialCollectionForTesting',
            includeUserAuthProvider: true,
          })}
          placeholder="Type something here"
          shouldFocus={true}
        />
      </div>
    );
  }
}
