import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import MobileEditor from './mobile-editor-element';
import { IS_DEV } from '../utils';
import {
  createMentionProvider,
  createMediaProvider,
  createEmojiProvider,
  createCardClient,
  createCardProvider,
} from '../providers';
import {
  getModeValue,
  getQueryParams,
  getAllowPredictableList,
} from '../query-param-reader';
import { useFetchProxy } from '../utils/fetch-proxy';
import { createCollabProviderFactory } from '../providers/collab-provider';
import { ErrorBoundary } from './error-boundary';
import { toNativeBridge } from './web-to-native';

interface AppProps {
  defaultValue?: Node | string | Object;
}

const App: React.FC<AppProps> = props => {
  const fetchProxy = useFetchProxy();

  return (
    <ErrorBoundary>
      <MobileEditor
        mode={getModeValue()}
        createCollabProvider={createCollabProviderFactory(fetchProxy)}
        cardClient={createCardClient()}
        cardProvider={createCardProvider()}
        defaultValue={props.defaultValue}
        emojiProvider={createEmojiProvider(fetchProxy)}
        mediaProvider={createMediaProvider()}
        mentionProvider={createMentionProvider()}
        UNSAFE_predictableLists={getAllowPredictableList()}
      />
    </ErrorBoundary>
  );
};

function main() {
  // Read default value from defaultValue query parameter when in development
  const rawDefaultValue = IS_DEV ? getQueryParams().get('defaultValue') : null;
  const defaultValue =
    IS_DEV && rawDefaultValue ? atob(rawDefaultValue) : undefined;

  if (toNativeBridge.startWebBundle) {
    toNativeBridge.startWebBundle();
  }

  ReactDOM.render(
    <App defaultValue={defaultValue} />,
    document.getElementById('editor'),
  );
}

window.addEventListener('DOMContentLoaded', main);
