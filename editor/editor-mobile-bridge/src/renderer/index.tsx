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
import {
  getAllowAnnotations,
  getAllowHeadingAnchorLinks,
} from '../query-param-reader';
import { useFetchProxy } from '../utils/fetch-proxy';
import { getEmptyADF } from '@atlaskit/adf-utils';

interface AppProps {
  document: string;
}

const initialDocSerialized = JSON.stringify(getEmptyADF());

const App: React.FC<AppProps> = props => {
  const fetchProxy = useFetchProxy();

  return (
    <MobileRenderer
      cardClient={createCardClient()}
      document={props.document}
      emojiProvider={createEmojiProvider(fetchProxy)}
      mediaProvider={createMediaProvider()}
      mentionProvider={createMentionProvider()}
      allowAnnotations={getAllowAnnotations()}
      allowHeadingAnchorLinks={getAllowHeadingAnchorLinks()}
    />
  );
};

function main() {
  const params = new URLSearchParams(window.location.search);

  // Read default value from defaultValue query parameter when in development
  const rawDefaultValue = IS_DEV ? params.get('defaultValue') : null;
  const defaultValue =
    IS_DEV && rawDefaultValue ? atob(rawDefaultValue) : initialDocSerialized;

  ReactDOM.render(
    <App document={defaultValue} />,
    document.getElementById('renderer'),
  );
}

window.addEventListener('DOMContentLoaded', main);
