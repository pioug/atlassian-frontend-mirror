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

// @ts-ignore
window.logBridge = window.logBridge || [];

export default class Example extends React.Component {
  componentDidMount() {
    disableZooming();
    // Set initial padding (this usually gets set by native)
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
