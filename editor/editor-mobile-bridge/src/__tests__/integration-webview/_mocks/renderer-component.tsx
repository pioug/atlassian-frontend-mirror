import React from 'react';
import ReactDOM from 'react-dom';
import { getEmptyADF } from '@atlaskit/adf-utils';
import MobileRenderer from '../../../renderer/mobile-renderer-element';
import { createMentionProvider, createCardClient } from '../../../providers';
import { createEmojiProvider } from '../../../providers/emojiProvider';
import { useFetchProxy } from '../../../utils/fetch-proxy';
import { createMediaProvider } from './media-provider';
import { getLocaleValue } from '../../../query-param-reader';
import getBridge from '../../../renderer/native-to-web/bridge-initialiser';

const App = () => {
  const fetchProxy = useFetchProxy();
  const initialDocSerialized = JSON.stringify(getEmptyADF());
  return (
    <MobileRenderer
      cardClient={createCardClient()}
      document={initialDocSerialized}
      emojiProvider={createEmojiProvider(fetchProxy)}
      mediaProvider={createMediaProvider()}
      mentionProvider={createMentionProvider()}
      allowAnnotations={false}
      allowHeadingAnchorLinks={false}
      locale={getLocaleValue()}
      rendererBridge={getBridge()}
    />
  );
};

function main() {
  ReactDOM.render(<App />, document.getElementById('renderer'));
}

window.addEventListener('DOMContentLoaded', main);
