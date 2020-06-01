import React from 'react';
import ReactDOM from 'react-dom';
import MobileRenderer from './mobile-renderer-element';
import { IS_DEV } from '../utils';
import {
  createMentionProvider,
  createMediaProvider,
  createCardClient,
} from '../providers';
import { createEmojiProvider } from '../providers/emojiProvider';
import { getAllowAnnotations } from '../query-param-reader';

function main() {
  const params = new URLSearchParams(window.location.search);

  // Read default value from defaultValue query parameter when in development
  const rawDefaultValue = IS_DEV ? params.get('defaultValue') : null;
  const defaultValue = IS_DEV && rawDefaultValue ? atob(rawDefaultValue) : '';

  ReactDOM.render(
    <MobileRenderer
      cardClient={createCardClient()}
      document={defaultValue}
      emojiProvider={createEmojiProvider()}
      mediaProvider={createMediaProvider()}
      mentionProvider={createMentionProvider()}
      allowAnnotations={getAllowAnnotations()}
    />,
    document.getElementById('renderer'),
  );
}

window.addEventListener('DOMContentLoaded', main);
