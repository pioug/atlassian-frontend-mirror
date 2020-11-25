/**
 * This file is very similar to editor-mobile-bridge/src/editor/index.tsx
 * but duplicated in purpose since it's used for mobile integration tests.
 * It mocks providers by default and imports testing helpers that we don't want in prod.
 */
import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import MobileEditor from '../../../editor/mobile-editor-element';
import {
  createMentionProvider,
  createEmojiProvider,
  createCardClient,
  createCardProvider,
} from '../../../providers';
import { getModeValue } from '../../../query-param-reader';
import { useFetchProxy } from '../../../utils/fetch-proxy';
import { createCollabProviderFactory } from '../../../providers/collab-provider';
import { createMediaProvider } from './media-provider';

const App = () => {
  const fetchProxy = useFetchProxy();

  return (
    <MobileEditor
      mode={getModeValue()}
      createCollabProvider={createCollabProviderFactory(fetchProxy)}
      cardClient={createCardClient()}
      cardProvider={createCardProvider()}
      emojiProvider={createEmojiProvider(fetchProxy)}
      mediaProvider={createMediaProvider()}
      mentionProvider={createMentionProvider()}
    />
  );
};

function main() {
  ReactDOM.render(<App />, document.getElementById('editor'));
}

window.addEventListener('DOMContentLoaded', main);
