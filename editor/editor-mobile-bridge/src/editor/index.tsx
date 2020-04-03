import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import MobileEditor from './mobile-editor-element';
import { IS_DEV, determineMode } from '../utils';
import {
  createMentionProvider,
  createMediaProvider,
  createEmojiProvider,
  createCardClient,
  createCardProvider,
} from '../providers';

function main() {
  const params = new URLSearchParams(window.location.search);
  const mode = determineMode(params.get('mode'));

  // Read default value from defaultValue query parameter when in development
  const rawDefaultValue = IS_DEV ? params.get('defaultValue') : null;
  const defaultValue =
    IS_DEV && rawDefaultValue ? atob(rawDefaultValue) : undefined;

  ReactDOM.render(
    <MobileEditor
      mode={mode}
      cardClient={createCardClient()}
      cardProvider={createCardProvider()}
      defaultValue={defaultValue}
      emojiProvider={createEmojiProvider()}
      mediaProvider={createMediaProvider()}
      mentionProvider={createMentionProvider()}
    />,
    document.getElementById('editor'),
  );
}

window.addEventListener('DOMContentLoaded', main);
