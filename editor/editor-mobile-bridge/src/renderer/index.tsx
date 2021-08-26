import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import MobileRenderer from './mobile-renderer-element';
import { IS_DEV } from '../utils';
import {
  createMentionProvider,
  createMediaProvider,
  createCardClient,
} from '../providers';
import { createEmojiProvider } from '../providers/emojiProvider';
import { useFetchProxy } from '../utils/fetch-proxy';
import { getEmptyADF } from '@atlaskit/adf-utils';
import getBridge from './native-to-web/bridge-initialiser';
import useRendererConfiguration from './hooks/use-renderer-configuration';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { Serialized } from '../types';

interface AppProps {
  document: string;
}

const initialDocSerialized = JSON.stringify(getEmptyADF());

export const App: React.FC<AppProps> = (props) => {
  const content = useRef<Serialized<JSONDocNode>>('');
  const fetchProxy = useFetchProxy();
  const rendererBridge = getBridge();
  const rendererConfiguration = useRendererConfiguration(rendererBridge);

  const onLocaleChanged = useCallback(() => {
    rendererBridge.setContent(content.current);
  }, [rendererBridge]);

  const onWillLocaleChange = useCallback(() => {
    content.current = rendererBridge.getContent();
  }, [rendererBridge]);

  return (
    <MobileRenderer
      allowAnnotations={rendererConfiguration.isAnnotationsAllowed()}
      allowHeadingAnchorLinks={rendererConfiguration.isHeadingAnchorLinksAllowed()}
      cardClient={createCardClient()}
      disableActions={rendererConfiguration.isActionsDisabled()}
      disableMediaLinking={rendererConfiguration.isMedialinkingDisabled()}
      document={props.document}
      emojiProvider={createEmojiProvider(fetchProxy)}
      locale={rendererConfiguration.getLocale()}
      mediaProvider={createMediaProvider()}
      mentionProvider={createMentionProvider()}
      onLocaleChanged={onLocaleChanged}
      onWillLocaleChange={onWillLocaleChange}
      rendererBridge={rendererBridge}
      UNSAFE_allowCustomPanels={rendererConfiguration.isCustomPanelEnabled()}
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
