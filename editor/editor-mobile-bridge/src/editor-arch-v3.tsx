import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import MobileEditor from './labs/mobile-editor-element';
import { IS_DEV } from './utils';
import {
  createMentionProvider,
  createMediaProvider,
  createEmojiProvider,
  createCardClient,
  createCardProvider,
} from './providers';
import { getModeValue, getQueryParams } from './query-param-reader';
import { FetchProxy } from './utils/fetch-proxy';

interface AppProps {
  defaultValue?: string;
}

const App: React.FC<AppProps> = props => {
  const fetchProxy = new FetchProxy();
  return (
    <MobileEditor
      mode={getModeValue()}
      cardClient={createCardClient()}
      cardProvider={createCardProvider()}
      defaultValue={props.defaultValue}
      emojiProvider={createEmojiProvider(fetchProxy)}
      mediaProvider={createMediaProvider()}
      mentionProvider={createMentionProvider()}
    />
  );
};
function main() {
  // Read default value from defaultValue query parameter when in development
  const rawDefaultValue = IS_DEV ? getQueryParams().get('defaultValue') : null;
  const defaultValue =
    IS_DEV && rawDefaultValue ? atob(rawDefaultValue) : undefined;

  ReactDOM.render(
    <App defaultValue={defaultValue} />,
    document.getElementById('editor'),
  );
}

window.addEventListener('DOMContentLoaded', main);
